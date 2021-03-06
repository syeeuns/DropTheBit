import React from 'react';
import StockChart from './StockChart';
import ChartTitle from './ChartTitle';
import { CircularProgress, Grid } from '@material-ui/core';
import testImg from './images/tutorial/legend.png'


class ChartComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            coinName: '',
        };
        this.currentBuy = 0;
        this.currentSell = 0;
        this.doneBuy = 0;
        this.doneSell = 0;
        this.bid = 0;
    }
    componentDidUpdate() {
        // console.log('props', this.props.bid);
        // console.log('props_', this.bid);
    }
    componentWillMount() {
        if (this.props.socket === null) {
            this.props.requestSocket('ChartComponent');
        }
    }
    componentDidMount() {
        //@ 소켓 통신 대기
    }
    setup = true;
    setAPI = false;
    addCandleData = (data) => {
        if (data === null) {
            // console.log('하늘소....하늘소.. 응답하라....');
            return;
        }
        const coinName = data.coinName;
        // const date = data.date.split('.')[0];

        // let date = data.date;
        // console.log(date);
        // if (typeof(date)==='object') {
        //     JSON.stringify(data);
        //     // date = data.date.split('.');
        //     console.log(date);
        // }
        data.date = new Date(data.date);
        const tmp_date = JSON.stringify(data.date).split('"');
        // console.log(typeof(date));
        if (!this.setAPI) {
            this.props.setAPIData(data);
            this.setAPI = true;
        }
        if (this.state.data.length >= 150) this.state.data.shift();
        this.setState({
            data: [...this.state.data, data],
            coinName: coinName,
            date: tmp_date[1],
            // bid: this.props.bid
        });
        // console.log(this.state.datas);
        // getData(this.state.datas).then(data => {
        // })
    };
    render() {
        const dataLength = this.state.data.length;

        if (this.setup) {
            //@ candle data callback
            if (this.props.socket == null) {
                // this.props.requestSocket('ChartComponent');
            }
            if (this.props.requestSocket == null) {
                // console.log('requestSocket is null');
            } else if (this.props.socket != null) {
                this.props.socket.emit('chartData_Req');
                this.props.socket.once('chartData_Res', (datas) => {
                    // console.log('게임 시작 이전의 차트 데이터(최대 100tick)가 로드되었습니다.');
                    datas.chartData.map((data) => {
                        this.addCandleData(data);
                    });
                    this.props.socket.on('chart', (data) => {
                        this.addCandleData(data);
                    });
                    this.props.socket.on('bidDone_Room', (data) => {
                        if (this.props.socket.id !== data.socketID) return;
                        this.currentBuy = data.price;
                        this.doneBuy = 0;
                    });
                    this.props.socket.on('buyDone_Room', (data) => {
                        if (this.props.socket.id !== data.socketID) return;

                        this.doneBuy = data.price;
                        this.doneSell = 0;
                        this.currentBuy = 0;
                    });
                    this.props.socket.on('askDone_Room', (data) => {
                        if (this.props.socket.id !== data.socketID) return;
                        this.currentSell = data.price;
                        this.doneSell = 0;
                    });
                    this.props.socket.on('sellDone_Room', (data) => {
                        if (this.props.socket.id !== data.socketID) return;
                        this.doneSell = data.price;
                        this.doneBuy = 0;
                        this.currentSell = 0;
                    });
                    this.props.socket.on('cancelBid_Res', (data) => {
                        // if(this.props.socket.id !== data.socketID) return;
                        this.currentBuy = 0;
                    });
                    this.props.socket.on('cancelAsk_Res', (data) => {
                        // if(this.props.socket.id !== data.socketID) return;
                        this.currentSell = 0;
                    });
                    this.props.socket.on('chartMyPrice_Res', (data) => {
                        // console.log('props__', data);
                        this.bid = data;
                        this.setState({
                            data: this.state.data,
                            coinName: this.state.coinName,
                            date: this.state.date,
                            bid: data,
                        });
                    });
                });
                this.setup = false;
            }
        }

        if (this.props.socket == null || dataLength < 2) {
            return (
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '30vh',
                    }}
                >
                    <CircularProgress />
                </div>
            );
        }
        // console.log(this.props.time);
        return (
            <>
                <Grid
                    container
                    // justify={'space-between'}
                    style={{ padding: '1vh', width: '100%' }}
                >
                    <ChartTitle
                        data={this.state.data}
                        coinName={this.state.coinName}
                        date={this.state.date}
                        time={this.props.time}
                        isStart={this.props.isStart}
                        socket={this.props.socket}
                    />

                    {/* {this.props.isStart && <Timer socket={this.props.socket} />} */}
                    {/* <h2>출처</h2> */}
                </Grid>
                <StockChart
                    type={'hybrid'}
                    data={this.state.data}
                    bid={this.bid}
                    doneBuy={this.doneBuy}
                    doneSell={this.doneSell}
                    currentBuy={this.currentBuy}
                    currentSell={this.currentSell}
                />
                <Grid 
                style={{width:'37vw', height:'0'}}
                >
                <img src={testImg} style={{position: 'relative',width:'100%', height:'4.5vh', top: '-9vh', left:'10vw', minWidth:'30vw',  objectFit:'contain'}}>
                </img>
                </Grid>
            </>
        );
    }
}

export default ChartComponent;
