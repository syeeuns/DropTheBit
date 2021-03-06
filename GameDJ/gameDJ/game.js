import webhook from '../slack.js';

class Game {
    constructor(io, socket) {
        this.io = io;
        this.socket = socket;
    }

    startGame(musicData) {
        try {
            const { io, socket } = this;
            let roomID = socket.roomID;

            // 방장만 노래를 바꿀 수 있도록 함
            if (roomList[roomID]['gaming'] === false) {
                console.log('startGame1----- gaming==false');
                roomList[roomID]['gaming'] = true;
                roomList[roomID]['music'] = musicData['musicName'];
                roomList[roomID]['gameTime'] = musicData['gameTime'];
                roomList[roomID]['initGameTime'] = musicData['gameTime'];
            }
            io.to(roomID).emit('chartData', { chartData: chartData });

            // 방장이면 룸 전체를 시작하게 함
            if (roomList[roomID]['roomLeader'] === socket.id) {
                console.log('startGame2----- 방장일때');
                io.to(roomID).emit('startGame_Res', {
                    gameTime: roomList[roomID]['gameTime'],
                    musicName: roomList[roomID]['music'],
                });
            }
            // 방장이 아니면, 게임 중인 방에 자기만 들어감
            else if (roomList[roomID]['gaming'] === true) {
                console.log('startGame1----- gaming==true, 방장아닐때');
                io.to(socket.id).emit('startGame_Res', {
                    gameTime: roomList[roomID]['gameTime'],
                    musicName: roomList[roomID]['music'],
                });
            }

            else{
                console.log('침입자다');
            }

            function realStart() {
                let roomID = socket.roomID;
                let dataForStart = {};
                // 방장이 시작하는 경우에만 3,2,1 추가되도록함 (중간유저 입장 시 3초 추가 안되도록)
                if (!roomList[roomID]) return 0;
                if (
                    roomList[roomID].hasOwnProperty('roomLeader') &&
                    roomList[roomID]['roomLeader'] === socket.id
                ) {
                    roomList[roomID]['gameTime'] =
                        roomList[roomID]['initGameTime'];
                }
                dataForStart['musicName'] = roomList[roomID]['music'];
                dataForStart['gameTime'] = roomList[roomID]['gameTime'];
                io.to(roomID).emit('startGame_Real', dataForStart);
            }
            //!  확인 필요
            let gameSchedule1 = setTimeout(realStart, 3000);

            let bfrWallet = {};
            bfrWallet['coinVol'] = 0;
            bfrWallet['cash'] = 100000000;
            bfrWallet['asset'] = 100000000;

            let refreshWallet = {};
            refreshWallet['result'] = 'success';
            refreshWallet['type'] = 'initialize';
            refreshWallet['coinVol'] = 0;
            refreshWallet['cash'] = 100000000;
            refreshWallet['asset'] = 100000000;
            refreshWallet['preExPrice'] = 0;

            // let walletInfo = {
            //     refreshWallet: refreshWallet,
            //     bfrWallet: bfrWallet,
            // };
            this.refreshWallet(roomID, refreshWallet, bfrWallet);
        } catch (err) {
            console.error(err);
            webhook.sendMessage(`에러 발생 : ${err}`);
        }
    }

    buy(reqJson) {
        try {
            const { io, socket } = this;
            // 1. reqJson setting
            let roomID = reqJson['roomID'];
            let socketID = socket.id;
            let reqPrice = Number(reqJson['currentBid']);

            // 2. player_info 가져오기
            let playerInfo = roomList[roomID][socketID];
            let cash = playerInfo['cash'];
            let coinVol = playerInfo['coinVol'];
            let playerID = playerInfo['playerID'];

            let bfrWallet = {};
            bfrWallet['coinVol'] = 0;
            bfrWallet['cash'] = playerInfo['cash'];
            bfrWallet['asset'] = playerInfo['asset'];

            // ! 음수 값 처리
            if (reqPrice <= 0 || cash < reqPrice) {
                console.log('Buy 0이하의 요청이 감지되었다 :', reqJson);
                console.log('cash :', cash, ' reqPrice : ', reqPrice);
                return;
            }

            // 5. 구매 처리 및 asset 정보 emit
            // 6. 요청가 >= 현재가 : 거래 체결 후 결과 송신(asset, buy_res("체결"))
            if (reqPrice >= curPrice) {
                let reqVol = Math.floor(cash / curPrice);
                // 6-1. cash, coin 갯수 갱신
                cash -= curPrice * reqVol;
                coinVol += reqVol;

                // 6-2. playerInfo Update
                playerInfo['cash'] = cash;
                playerInfo['coinVol'] = coinVol;
                playerInfo['actionRestTime'] = 5;
                playerInfo['recentAction'] = 1;

                roomList[roomID][socketID] = playerInfo;

                // 6-4. buyDone
                let buyDone = {
                    type: '매수 완료',
                    // 6-3. refreshWallet update & emit
                    socketID: socketID,
                    playerID: playerID,
                    vol: reqVol,
                    price: curPrice,
                };
                io.to(socketID).emit('buyDone_Room', buyDone);

                // 7. 요청가 < 현재가 : 호가 등록 후 결과 송신(asset, buy_res("호가"))
            } else {
                let reqVol = Math.floor(cash / reqPrice);
                // 7-1. cash 갱신
                cash -= reqPrice * reqVol;
                playerInfo['cash'] = cash;

                // 4-3. player 호가 목록 등록

                playerInfo['bid'][reqPrice] = reqVol;
                if (!bidList.hasOwnProperty(reqPrice)) {
                    bidList[reqPrice] = {};
                }
                bidList[reqPrice][socketID] = roomID;
                roomList[roomID][socketID] = playerInfo;

                let bidDone = {
                    type: '매수 주문',
                    socketID: socketID,
                    playerID: playerID,
                    vol: reqVol,
                    price: reqPrice,
                };
                io.to(socketID).emit('bidDone_Room', bidDone);
                // this.sendBidTable(reqJson);
            }

            let refreshWallet = {};
            refreshWallet['result'] = 'success';
            refreshWallet['type'] = 'buy';
            refreshWallet['coinVol'] = playerInfo['coinVol'];
            refreshWallet['cash'] = playerInfo['cash'];
            refreshWallet['asset'] = playerInfo['asset'];

            this.refreshWallet(socketID, refreshWallet, bfrWallet);
        } catch (err) {
            console.error(err);
            webhook.sendMessage(`에러 발생 : ${err}`);
        }
    }

    // 매도 요청 등록
    sell(reqJson) {
        try {
            const { io, socket } = this;
            // 1. reqJson setting
            let roomID = reqJson['roomID'];
            let socketID = socket.id;
            let reqPrice = Number(reqJson['currentBid']);

            // 2. player_info 가져오기
            let playerInfo = roomList[roomID][socketID];
            let cash = playerInfo['cash'];
            let coinVol = playerInfo['coinVol'];
            let playerID = playerInfo['playerID'];

            let bfrWallet = {};
            bfrWallet['cash'] = playerInfo['cash'];
            bfrWallet['coinVol'] = playerInfo['coinVol'];
            bfrWallet['asset'] = playerInfo['asset'];

            // ! 실수로 잘못된 값이 들어온 경우 처리하기
            if (coinVol === 0) {
                console.log('Sell 이상한 요청이 감지되었다', reqJson);
                return;
            }

            // 6. 요청가 <= 현재가 : 거래 체결 후 결과 송신(asset, sell_res("체결"))
            if (reqPrice <= curPrice) {
                let reqVol = coinVol;
                // 6-1. cash, coin 갯수 갱신
                cash += curPrice * reqVol;
                coinVol -= reqVol;
                // asset = cash + coinVol * curPrice

                // 6-3. playerInfo Update
                playerInfo['cash'] = cash;
                playerInfo['coinVol'] = coinVol;
                playerInfo['actionRestTime'] = 5;
                playerInfo['recentAction'] = 0;

                roomList[roomID][socketID] = playerInfo;

                // 6-4. sellDone
                let sellDone = {
                    type: '매도 완료',
                    socketID: socketID,
                    playerID: playerID,
                    vol: reqVol,
                    price: curPrice,
                };

                io.to(socketID).emit('sellDone_Room', sellDone);
                // 7. 요청가 > 현재가 : 호가 등록 후 결과 송신(asset, sell_res("호가"))
            } else {
                let reqVol = coinVol;
                coinVol -= reqVol;

                playerInfo['coinVol'] = coinVol;
                // playerInfo['asset'] = asset;
                // 4-3. player 호가 목록 등록

                playerInfo['ask'][reqPrice] = reqVol;
                if (!askList.hasOwnProperty(reqPrice)) {
                    askList[reqPrice] = {};
                }
                askList[reqPrice][socketID] = roomID;

                roomList[roomID][socketID] = playerInfo;

                let askDone = {
                    type: '매도 주문',
                    socketID: socketID,
                    playerID: playerID,
                    vol: reqVol,
                    price: reqPrice,
                };

                io.to(socketID).emit('askDone_Room', askDone);
                // this.sendAskTable(reqJson);
            }

            let refreshWallet = {};
            refreshWallet['result'] = 'success';
            refreshWallet['type'] = 'sell';
            refreshWallet['coinVol'] = playerInfo['coinVol'];
            refreshWallet['cash'] = playerInfo['cash'];
            refreshWallet['asset'] = playerInfo['asset'];
            this.refreshWallet(socketID, refreshWallet, bfrWallet);
        } catch (err) {
            console.error(err);
            webhook.sendMessage(`에러 발생 : ${err}`);
        }
    }

    // 매수 요청 취소
    cancelBid(reqJson) {
        try {
            let roomID = reqJson['roomID'];
            let socketID = reqJson['socketID'];
            let bidPrice = Object.keys(roomList[roomID][socketID]['bid'])[0];

            // bidList의 Length가 1이면 가격 자체를 지워버린다.
            if (!bidList[bidPrice]) return false;
            if (Object.keys(bidList[bidPrice]).length === 1) {
                delete bidList[bidPrice];
            } else {
                delete bidList[bidPrice][socketID];
            }

            let playerInfo = roomList[roomID][socketID];
            let cash = playerInfo['cash'];
            let bidVol = playerInfo['bid'][bidPrice];

            let bfrWallet = {};
            bfrWallet['coinVol'] = playerInfo['coinVol'];
            bfrWallet['cash'] = playerInfo['cash'];
            bfrWallet['asset'] = playerInfo['asset'];

            cash += bidVol * Number(bidPrice);
            playerInfo['cash'] = cash;

            delete playerInfo['bid'][bidPrice];
            roomList[roomID][socketID] = playerInfo;

            let refreshWallet = {};
            refreshWallet['result'] = 'success';
            refreshWallet['type'] = 'cancelBid';
            refreshWallet['coinVol'] = playerInfo['coinVol'];
            refreshWallet['cash'] = playerInfo['cash'];
            refreshWallet['asset'] = playerInfo['asset'];

            this.refreshWallet(socketID, refreshWallet, bfrWallet);
            this.io.to(socketID).emit('cancelBid_Res', 'success');
            // this.sendBidTable(reqJson);
        } catch (err) {
            console.error(err);
            webhook.sendMessage(`에러 발생 : ${err}`);
        }
    }

    // 매도 요청 취소
    cancelAsk(reqJson) {
        try {
            let roomID = reqJson['roomID'];
            let socketID = reqJson['socketID'];
            let askPrice = Object.keys(roomList[roomID][socketID]['ask'])[0];

            // 취소 요청한 가격에 해당하는 목록을 불러온다
            // askList의 Length가 1이면 가격 자체를 지워버린다.
            if (!askList[askPrice]) return false;
            if (Object.keys(askList[askPrice]).length === 1) {
                delete askList[askPrice];
            } else {
                delete askList[askPrice][socketID];
            }

            let playerInfo = roomList[roomID][socketID];
            let coinVol = playerInfo['coinVol'];
            let askVol = playerInfo['ask'][askPrice];

            let bfrWallet = {};
            bfrWallet['coinVol'] = playerInfo['coinVol'];
            bfrWallet['cash'] = playerInfo['cash'];
            bfrWallet['asset'] = playerInfo['asset'];

            coinVol += askVol;
            playerInfo['coinVol'] = coinVol;
            delete playerInfo['ask'][askPrice];
            roomList[roomID][socketID] = playerInfo;

            let refreshWallet = {};
            refreshWallet['result'] = 'success';
            refreshWallet['type'] = 'sell';
            refreshWallet['coinVol'] = playerInfo['coinVol'];
            refreshWallet['cash'] = playerInfo['cash'];
            refreshWallet['asset'] = playerInfo['asset'];

            this.refreshWallet(socketID, refreshWallet, bfrWallet);
            this.io.to(socketID).emit('cancelAsk_Res', 'success');
            // this.sendAskTable(reqJson);
        } catch (err) {
            console.error(err);
            webhook.sendMessage(`에러 발생 : ${err}`);
        }
    }

    refreshWallet(socketID, refreshWallet, bfrWallet) {
        const { io } = this;
        let walletInfo = {
            refreshWallet: refreshWallet,
            bfrWallet: bfrWallet,
        };

        if (bfrWallet['cash'] !== refreshWallet['cash']) {
            io.to(socketID).emit('refreshCash', walletInfo);
        }
        if (bfrWallet['coinVol'] !== refreshWallet['coinVol']) {
            io.to(socketID).emit('refreshCoin', walletInfo);
        }
        // if (bfrWallet['asset'] !== refreshWallet['asset']) {
        io.to(socketID).emit('refreshAsset', walletInfo);
        // }
        io.to(socketID).emit('refreshWallet', walletInfo);
    }

    timerSet() {
        const { socket } = this;
        const roomID = socket.roomID;

        let timerSetData = {
            timerSet: true,
            isPlaying: true,
            initGameTime: roomList[roomID]['initGameTime'] + 1,
            gameTime: roomList[roomID]['gameTime'] + 1,
        };

        socket.emit('timerSet_Res', timerSetData);
    }
}
export default Game;
