import React, { useEffect, useState, useLayoutEffect } from 'react';
import {
    IconButton,
    Button,
    TextField,
    Grid,
    Paper,
    makeStyles,
    withStyles,
} from '@material-ui/core';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { grey, red } from '@material-ui/core/colors';
import { SnackAlertFunc } from './SnackAlert';
import { SnackbarProvider } from 'notistack';
// import {YellowShiningButton} from './ShiningButton';
import './ShiningButton.css';

// 음악
// Effect

import BuyMax from './audios/effect/BuyMax.wav';
import BuyConfirm from './audios/effect/BuyConfirm.wav';

import Check from './audios/effect/Check.mp3';
import CurPrice from './audios/effect/CurPrice.wav';

import PriceDown from './audios/effect/PriceDown.wav';
import PriceUp from './audios/effect/PriceUp.wav';
import SellMax from './audios/effect/SellMax.wav';
import SellConfirm from './audios/effect/SellConfirm.wav';
import VolDown from './audios/effect/VolDown.wav';
import VolUp from './audios/effect/VolUp.wav';
import { SplitByThree } from './parseMoney';
// import {CancelBid} from './BidTable';
import './blink.css';

const CssTextField = withStyles({
    root: {
        '& label.Mui-focused': {
            color: '#CDD7E0',
        },
        '& .MuiInputLabel-root': {
            color: '#CDD7E0',
        },
        '& .MuiInputBase-input': {
            color: '#CDD7E0',
            fontFamily: 'NEXON Lv1 Gothic OTF',
            fontSize: '2.5vw',
        },

        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: 'red',
            },
            '&:hover fieldset': {
                borderColor: 'yellow',
            },
            '&.Mui-focused fieldset': {
                borderColor: 'green',
            },
        },
    },
})(TextField);

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        color: '#CDD7E0',
        backgroundColor: '#0C151C',
    },
    button_layer: {
        // width:
        minWidth: '100%',
        // maxHeight: '18%',
    },
    input: {
        color: '#CDD7E0',
    },
    small_text: {
        margin: '1 0.5vw -0.5vh 0.5vw',
        fontSize: '1.5vw',
        padding: '0.5vh 0.5vw 0.5vh 0.5vw',
    },
}));

export default function TradeStock(props) {
    const classes = useStyles();
    const [currentBid, SetBid] = useState(0);
    const [newBid, SetNewBid] = useState(0); //props.APIdata.curPrice
    const [currentVolume, SetVolume] = useState(1);
    const [newVolume, SetNewVolume] = useState(1);
    const [unitBid, SetUnit] = useState(0); // props.APIdata.priceUnit
    const [unitVolume, SetUnitVolume] = useState(1);
    const [isBind, SetBind] = useState(false);
    const [isFocus, SetFocus] = useState(false);
    const [sellStatus, setSellStatus] = useState({
        status: '',
        val: 0,
        vol: 0,
    });
    const [buyStatus, setBuyStatus] = useState({
        status: '',
        val: 0,
        vol: 0,
    });
    const [prevStatus, setPrevStatus] = useState({
        status: '',
        val: 0,
        vol: 0,
    });
    const [myWallet, setWallet] = useState({
        myCash: 0,
        myAsset: 0,
        myCoin: 0,
    });
    const [isInit, setInit] = useState(false);

    if (!isBind) SetBind(true);
    if (!isInit) setInit(true);
    //@ 가정 => props에 socket이 전달되었어야함.

    const eventTime = 300;

    useLayoutEffect(() => {
        if (props.socket == null) {
            props.requestSocket('MyAsset', props.socket);
            setInit(true);
        } else {
            props.socket.on('refreshWallet', (data) => {
                //@ buyreq
                const refreshWallet = data.refreshWallet;
                const currentCash = refreshWallet.cash;
                const currentAsset = refreshWallet.asset;
                const currentCoin = refreshWallet.coinVol;
                setWallet({
                    myCash: currentCash,
                    myAsset: currentAsset,
                    myCoin: currentCoin,
                });
            });
        }
    }, [isInit]);

    function VolumeUp(volume) {
        //myWallet.myCoin == 매도 가능한 최대 코인수
        //Math.floor(myWallet.myCash / currentBid) == 매수 가능한 최대코인수
        const maxVol = Math.max(
            myWallet.myCoin,
            Math.floor(myWallet.myCash / currentBid)
        );
        if (maxVol < volume + unitVolume) {
            SetNewVolume(maxVol);
            return;
        }
        // if (
        //     volume + Math.floor((myWallet.myCash / currentBid) * 0.1) >
        //     Math.floor(myWallet.myCash / currentBid)
        // )
        //     return;555
        // SetNewVolume(volume + Math.floor((myWallet.myCash / currentBid) * 0.1));
        SetNewVolume(volume + unitVolume);
    }
    function VolumeDown(volume) {
        if (volume - unitVolume <= 0) {
            SetNewVolume(1);
            return;
        }
        // SetNewVolume(
        //     volume - Math.floor((myWallet.myCash / currentBid) * 0.1 + 1)
        // );
        SetNewVolume(volume - unitVolume);
    }
    function BidUp() {
        SetBid(Number(currentBid) + Number(unitBid));
        props.SetBid(Number(currentBid) + Number(unitBid))
    }
    function BidDown() {
        SetBid(Number(currentBid) - Number(unitBid));
        props.SetBid(Number(currentBid) - Number(unitBid))
    }

    function RefreshBid_Req() {
        props.socket.emit('RefreshBid_Req');
        props.socket.once('RefreshBid_Res', (curPrice) => {
            // console.log('RefreshBid_Req');
            SetBid(curPrice);
            props.SetBid(curPrice);
        });
    }

    // function RefreshBid_Res() {
    //     props.socket.once('RefreshBid_Res', (curPrice) => {
    //         SetBid(curPrice);
    //     });
    // }
    // function CancelBid(num, table) {
    //     let reqJson = {
    //         socketID: props.socket.id,
    //         roomID: props.roomID,
    //         reqPrice: table[num]['price'],
    //         reqVol: table[num]['vol'],
    //     };
    //     props.socket.emit('cancelBid_Req', reqJson);
    // }

    function Buy(bid, volume) {
        let status = '';
        if (bid < 0) bid = 0;
        if (volume < 0) volume = 0;
        if (bid  === 0 || volume === 0) {
            return {
                status: 'invalid',
                val: bid,
                vol: volume,
            };
        }

        if (bid * volume > myWallet.myCash) {
            // SnackAlertFunc({
            //     severity:"error",
            //     message:"호가 및 수량이 부적절합니다. (ex. '0') 😱"
            // })
            props.socket.once('buyDone_Room', (bbid) => {
                if (bbid.type === '실패') {
                    return {
                        status: 'invalid',
                        val: bid,
                        vol: volume,
                    };
                }
                SetNewBid(bbid.price);
            });
            return {
                status: 'lack',
                val: bid,
                vol: volume,
            };
        }
        status = {
            status: 'request',
            val: bid,
            vol: volume,
        };
        props.socket.emit('buy_Req', {
            //@ reqJson.json 형식확인
            roomID: props.roomID,
            socketID: props.socket.id,
            currentBid: bid,
            currentVolume: volume,
        });

        props.socket.on('bidDone_Room', (data) => {
            // if(this.props.socket.id !== data.socketID) return;
            // console.log('bidDone_Room');
            setPrevStatus({
                status: 'buy_bid',
            });
        });
        
        SetBind(true);
        return status;
    }
    props.socket.off('buyDone_Room').once('buyDone_Room', (bbid) => {
        console.log('buyDone_Room');
        // if (bbid.type === '실패') {
        //     return {
        //         status: 'invalid',
        //         val: bid,
        //         vol: volume,
        //     };
        // }
        SetNewBid(bbid.price);
        setBuyStatus({
            status: 'done',
            val: bbid.price,
            vol: bbid.vol,
        });
    });

    function Sell(bid, volume) {
        let status = '';
        if (bid <= 0 || volume <= 0) {
            return {
                status: 'invalid',
                val: bid,
                vol: volume,
            };
        }
        if (myWallet.myCoin < volume) {
            props.socket.once('sellDone_Room', (bbid) => {
                if (bbid.type === '실패') {
                    return {
                        status: 'invalid',
                        val: bid,
                        vol: volume,
                    };
                }
                SetNewBid(bbid.price);
            });
            return {
                status: 'lack',
                val: bid,
                vol: volume,
            };
        };
        status = {
            status: 'request',
            val: bid,
            vol: volume,
        };
        props.socket.emit('sell_Req', {
            roomID: props.roomID,
            socketID: props.socket.id,
            currentBid: bid,
            currentVolume: volume,
        });
        //@ 중복 문제가 발생한다.
        props.socket.on('askDone_Room', (data) => {
            setPrevStatus({
                status: 'sell_bid',
            });
        });

        SetBind(true);
        return status;
    }

    props.socket.off('sellDone_Room').once('sellDone_Room', (sbid) => {
        console.log('sellDone_Room');
        // if (sbid.type === '실패') {
        //     return {
        //         status: 'invalid',
        //         val: bid,
        //         vol: volume,
        //     };
        // }
        SetNewBid(sbid.price);
        setSellStatus({
            status: 'done',
            val: sbid.price,
            vol: sbid.vol,
        });
    });

    const changeEffect = (id) => {
        if (id === 'ArrowDown' || id === 'ArrowUp') {
            const target_class = document.getElementById('bidInput');
            if (id === 'ArrowUp') target_class.classList.add('plus');
            else target_class.classList.add('minus');
            target_class.classList.add('font_blinking');

            setTimeout(function () {
                if (id === 'ArrowUp') target_class.classList.remove('plus');
                else target_class.classList.remove('minus');
                target_class.classList.remove('font_blinking');
            }, 100);
        } else if (id === 'ArrowLeft' || id === 'ArrowRight') {
            const target_class = document.getElementById('countInput');
            if (id === 'ArrowRight') target_class.classList.add('plus');
            else target_class.classList.add('minus');
            target_class.classList.add('font_blinking');

            setTimeout(function () {
                if (id === 'ArrowRight') target_class.classList.remove('plus');
                else target_class.classList.remove('minus');
                target_class.classList.remove('font_blinking');
            }, 100);
        }
    };

    function HandleKeyUp(e) {
        if (props.inputCtrl) return;
        if (e.keyCode === 123 || e.keyCode === 27 || e.keyCode === 13) return; //_ 'F12' || 'esc' || 'enter'
        e.preventDefault();
        if (props.socket == null || isBind === false) {
            props.requestSocket('TradeStock', props.socket);
            return;
        }
        if (e.keyCode === 32) {
            let tmpAudio = new Audio(CurPrice);
            tmpAudio.play();
            tmpAudio.remove();
            RefreshBid_Req();
        } else if (e.keyCode === 38) {
            //_ UP ARROW
            changeEffect('ArrowUp');
            let tmpAudio = new Audio(PriceUp);
            tmpAudio.play();
            tmpAudio.remove();
            BidUp();
        } else if (e.keyCode === 40) {
            //_ DOWN ARROW
            changeEffect('ArrowDown');
            let tmpAudio = new Audio(PriceDown);
            tmpAudio.play();
            tmpAudio.remove();
            BidDown();
        } else if (e.keyCode === 90) {
            //_ 'Z'
            let tmpAudio = new Audio(BuyConfirm);
            tmpAudio.play();
            tmpAudio.remove();
            setBuyStatus(Buy(currentBid, Math.floor(myWallet.myCash / currentBid)));
        } else if (e.keyCode === 88) {
            //_ 'X'
            let tmpAudio = new Audio(SellConfirm);
            tmpAudio.play();
            tmpAudio.remove();
            setSellStatus(Sell(currentBid, myWallet.myCoin));
        } else if (e.keyCode === 67) {
            //_ 'C' 
            let tmpAudio = new Audio(SellConfirm);
            tmpAudio.play();
            tmpAudio.remove();

            // 거래 취소
            // 직전 거래가 buy면 buydone 신호가 왔는지 확인, 안왔으면 취소
            // 직전 거래가 sell이면 selldone 신호가 왔는지 확인, 안왔으면 취소
            console.log('prevStatus.status', prevStatus.status);
            const reqJson = 
            {
                socketID: props.socket.id,
                roomID: props.roomID,
            }
            if (prevStatus.status === 'buy_bid') {      // 직전거래 buy 
                props.socket.emit('cancelBid_Req',reqJson);
            }
            else if (prevStatus.status === 'sell_bid') {     // 직전거래 sell
                props.socket.emit('cancelAsk_Req',reqJson);
            }
        }
        const key = document.getElementById(e.key);
        if (key) key.classList.add('pressed');
        setTimeout(function () {
            if (key) key.classList.remove('pressed');
        }, eventTime);
    }

    useEffect(() => {
        props.socket.once('chart', (data) => {
            // coinName 추가
            SetUnit(data.priceUnit);
            SetUnitVolume(data.volUnit);
            SetBid(data.curPrice);
        });
    }, []);

    useEffect(() => {
        if (isFocus === true) {
            return;
        }
        document.addEventListener('keyup', HandleKeyUp);
        return () => {
            document.removeEventListener('keyup', HandleKeyUp);
        };
    });

    //@ socket을 통해 정보가 변했음을 알고 render이전에 호가를 갱신해야할 필요가 있다.
    useEffect(() => {
        const responseBid = newBid;
        SetBid(responseBid);
    }, [newBid]); //@ 호가가 변할때이다.

    useEffect(() => {
        const responseVolume = newVolume;
        SetVolume(responseVolume);
        return () => {};
    }, [newVolume]);

    useEffect(() => {
        // console.log(sellStatus, 'sellStatus');
        if (sellStatus !== null) setSellStatus(null);
    }, [sellStatus]);

    useEffect(() => {
        // console.log(buyStatus, 'buy');
        if (buyStatus !== null) setBuyStatus(null);
    }, [buyStatus]);

    function handleVolumeChange(e) {
        if (e.target.id === 'countInput') {
            SetVolume(e.target.value);
            SetFocus(true);
        }
    }

    function handleBidChange(e) {
        if (e.target.id === 'bidInput') {
            SetBid(e.target.value);
            SetFocus(true);
        }
    }

    let costColor = {
        color:
            myWallet.myCash >= currentBid * currentVolume
                ? grey[700]
                : red[200],
    };

    function SetSellMaxCount() {
        SetVolume(myWallet.myCoin);
    }

    function SetBuyMaxCount() {
        SetVolume(Math.floor(myWallet.myCash / currentBid));
    }

    const parseWonToStr = (won) => {
        if (typeof won == 'number') won = won.toString();
        return won;
    };

    function ExpBySymbol(value) {
        // console.log(value);
        if (!value) return 'Something wrong.';
        let ret = '';
        if (value.length >= 9) {
            // 199489230 -> 1억 9948만 9230
            ret += value.substring(0, value.length - 9 + 1) + '억 '; // 1억
            value = value.substring(value.length - 9 + 1);
        }
        if (value.length >= 5) {
            // value 99489230
            ret += value.substring(0, value.length - 5 + 1) + '만 '; // 9948만
            value = value.substring(value.length - 5 + 1);
        }
        ret += value;
        return ret + '원';
    }
    
    let dateString = new Date();
    dateString =
        '(' +
        dateString.getMinutes() +
        ':' +
        dateString.getSeconds() +
        '.' +
        dateString.getMilliseconds() +
        ') ';

    const clickButton = (e) => {
        if (e.target) e.target.classList.add('clicked');

        setTimeout(function () {
            if (e.target) e.target.classList.remove('clicked');
        }, eventTime);
    };


    return (
        <>
            <SnackbarProvider maxSnack={15}>
                {buyStatus && buyStatus.status === 'lack' && (
                    <SnackAlertFunc
                        severity="warning"
                        message={dateString + ' 보유 금액이 부족해요 😨'}
                    />
                )}
                {buyStatus && buyStatus.status === 'invalid' && (
                    <SnackAlertFunc
                        severity="error"
                        message={dateString + ' 유효하지 않은 값입니다.'}
                    />
                )}
                {buyStatus && buyStatus.status === 'request' && (
                    <SnackAlertFunc
                        severity="info"
                        message={
                            dateString +
                            buyStatus.val +
                            ' 호가에 ' +
                            buyStatus.vol +
                            '개 [매수] 주문했어요! 📈'
                        }
                    />
                )}
                {buyStatus && buyStatus.status === 'done' && (
                    <SnackAlertFunc
                        severity="success"
                        message={
                            dateString +
                            buyStatus.val +
                            ',' +
                            buyStatus.vol +
                            ' [매수] 주문이 체결되었어요! 🎁'
                        }
                    />
                )}
                {sellStatus && sellStatus.status === 'lack' && (
                    <SnackAlertFunc
                        severity="warning"
                        message={dateString + '코인이 없는걸요? 😨'}
                    />
                )}
                {sellStatus && sellStatus.status === 'invalid' && (
                    <SnackAlertFunc
                        severity="error"
                        message={dateString + '유효하지 않은 값입니다.'}
                    />
                )}
                {sellStatus && sellStatus.status === 'request' && (
                    <SnackAlertFunc
                        severity="info"
                        message={
                            dateString +
                            sellStatus.val +
                            ' 호가에 ' +
                            sellStatus.vol +
                            '개 [매도] 주문했어요! 📉'
                        }
                    />
                )}
                {sellStatus && sellStatus.status === 'done' && (
                    <SnackAlertFunc
                        severity="success"
                        message={
                            dateString +
                            sellStatus.val +
                            ',' +
                            sellStatus.vol +
                            ' [매도] 주문이 체결되었어요! 💸'
                        }
                    />
                )}
            </SnackbarProvider>
            <Grid
                wrap="wrap"
                className={classes.paper}
                alignItems="stretch"
                container
                direction="column"
                alignItems="flex-start"
                style={{height: '100%', fontSize: '1rem', margin: '0' }}
            >
                <Grid container item direction="row" justify="space-between" style={{ height: '20%'}}>
                    <span className={classes.small_text}>매매호가</span>
                    <span className={classes.small_text}>[C]:취소</span>
                </Grid>
                <Grid
                    container
                    item
                    className={classes.button_layer}
                    direction="row"
                    justify="space-between"
                    // alignItems="flex-end"
                    style={{ height: '30%'}}
                >
                    <Grid style={{ width: '20%'}}>
                        <Button
                            class="arrow"
                            className={classes.arrow}
                            onClick={(e) => {
                                clickButton(e);
                                changeEffect(e.target.id);
                                let tmpAudio = new Audio(PriceDown);
                                tmpAudio.play();
                                tmpAudio.remove();
                                BidDown();
                            }}
                            id="ArrowDown"
                        >
                            ▼
                        </Button>
                    </Grid>
                    <Grid
                    style={{ width: '60%'}}
                    align='left'>
                        <h5
                            id="bidInput"
                            style={{fontSize: '2.5vw' }}
                            onChange={handleBidChange}
                        >
                            {SplitByThree(String(currentBid))}
                        </h5>
                    </Grid>
                    <Grid style={{ width: '20%',}} align='right'>
                    <Button
                        class="arrow"
                        onClick={(e) => {
                            clickButton(e);
                            changeEffect(e.target.id);
                            let tmpAudio = new Audio(PriceUp);
                            tmpAudio.play();
                            tmpAudio.remove();
                            BidUp();
                        }}
                        id="ArrowUp"
                    >
                        ▲
                    </Button>
                    </Grid>
                </Grid>
                <Grid container item direction={'column'} justify="center" alignItems="stretch" style={{ height: '50%'}}>
                    <Grid
                        container
                        direction={'row'}
                        justify="space-between"
                        style={{ width: '100%' ,height: '100%', }}
                    >
                    <Grid style={{ width: '50%' ,height: '100%', }}>
                        <button
                            style={{ width: '95%' , height: '95%',fontSize:'2.3vw' }}
                            class="buy"
                            onClick={(e) => {
                                clickButton(e);
                                let tmpAudio = new Audio(BuyConfirm);
                                tmpAudio.play();
                                tmpAudio.remove();
                                setBuyStatus(Buy(currentBid, Math.floor(myWallet.myCash / currentBid)));
                            }}
                            id="z"
                        >
                            [Z] 매수
                        </button>
                    </Grid>
                    <Grid style={{ width: '50%',  height: '100%',}} align="right">
                        <button
                            style={{ width: '95%', height: '95%', fontSize:'2.3vw'}}
                            class="sell"
                            onClick={(e) => {
                                clickButton(e);
                                let tmpAudio = new Audio(SellConfirm);
                                tmpAudio.play();
                                tmpAudio.remove();
                                setSellStatus(Sell(currentBid, myWallet.myCoin));
                            }}
                            id="x"
                        >
                            [X] 매도
                        </button>
                    </Grid>
                        {/* <Grid style={{ width: '100%',}}>
                            <button
                                style={{ width: '100%',height:'20%',fontSize:'2.3vw'}}
                                class="sell"
                                onClick={(e) => {
                                    clickButton(e);
                                    let tmpAudio = new Audio(SellConfirm);
                                    tmpAudio.play();
                                    tmpAudio.remove();
                                    setSellStatus(Sell(currentBid, myWallet.myCoin));
                                }}
                                id="x"
                            >
                                [SPACE]
                            </button>
                        </Grid> */}
                    </Grid>
                    {/* <Grid
                        container
                        direction={'row'}
                        justify="space-between"
                        style={{ width: '100%', margin: '0 10 0 1' }}
                    >
                        <button
                            style={{ width: '100%' }}
                            class="space"
                            onClick={(e) => {
                                clickButton(e);
                                let tmpAudio = new Audio(CurPrice);
                                tmpAudio.play();
                                tmpAudio.remove();
                                RefreshBid_Req();
                            }}
                            id=" "
                        >
                            [Space] 현재가로 갱신
                        </button>
                    </Grid> */}
                </Grid>
            </Grid>
        </>
    );
}