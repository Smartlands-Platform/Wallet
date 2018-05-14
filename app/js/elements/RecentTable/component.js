import React, {Component} from 'react';
import {get, isEqual} from 'lodash';
import Stellar from 'stellar-sdk';
import { ClipLoader } from 'react-spinners';
import { Table } from 'semantic-ui-react';
import { pageWidth} from '../../helpers/StellarTools';

import TimeAgo from 'javascript-time-ago';
import english from 'javascript-time-ago/locale/en';

english.tiny;

// TODO implement common chart component! Move it there!
import AssetSlug from '../../helpers/DataServer/Assets/Assets';
import Handlers from '../../helpers/DataServer/Handlers';
import Orderbook from '../../helpers/DataServer/OrderBook';

//TODO initial driver prototype for orderBook
const SERVER_URL = 'https://horizon.stellar.org';
let STLKey = 'GPublic Global Stellar Network ; September 2015';
let ServerNew = new Stellar.Server(SERVER_URL);
let urlParts1 = 'SLT-smartlands.io';
let urlParts2 = 'XLM-native';
ServerNew.serverUrl = SERVER_URL;

let network = {
    horizonUrl: SERVER_URL,
    networkPassphrase: STLKey,
    isDefault: true,
    isTestnet: false,
    isCustom: false,
};

//TimeAgo.locale(en)
TimeAgo.locale(english);

const timeAgo = new TimeAgo('en-US');

//TODO check on the prod

Stellar.Network.useTestNetwork();

function Driver(driverOpts) {
    this.Server = new Stellar.Server(driverOpts.network.horizonUrl);
    this.Server.serverUrl = driverOpts.network.horizonUrl;
    this.session = new Handlers(this);
    this.orderbook = new Orderbook(this);
}

const DataNew = [];
let driver = new Driver({
    network,
});

class RecentTable extends Component {

    constructor(props) {
        super(props);
        this.rendered = false;
        this.state = {
            loading: true,
            recentData: [],
            sellCode: 'SLT',
            selectedCell: this.headerTitles.PRICE,
        };
        this.base = {
            code: get(this.props.d.orderbook, 'base.asset_code', 'not'),
            issuer: get(this.props.d.orderbook, 'base.asset_issuer', 'not')
        };

        this.getDataForChart();
    }


    componentDidMount() {
        if (driver.orderbook.data.recentTrades !== undefined) {
            let recentData = DataNew.slice(0, 10);
            // this.setState({ recentData: recentData});
            setTimeout(()=>{
                this.setState({recentData: recentData, loading: false});
            }, 2500);

        } else {
            this.unsub = driver.orderbook.event.sub(() => {
                if (!this.rendered && driver.orderbook.data.recentTrades !== undefined) {
                    let recentData = DataNew.slice(0, 10);
                    if (recentData.length) {
                        this.setState({recentData: recentData, loading: false});
                    }
                }
            });
        }
    }

    componentWillUnmount() {
        if (this.unsub) this.unsub();
        // this.destroyChart();
    }

    componentWillReceiveProps(nextProps) {
        const code = get(nextProps.orderbook, 'base.asset_code', null) || 'not';
        const issuer = get(nextProps.orderbook, 'base.asset_issuer', null) || 'not';
        if (this.props.change){
            this.setState({loading: true});
        }
        if (!isEqual(code, this.base.code) && !isEqual(issuer, this.base.issuer)) {
            // this.setState({loading: true});
            this.base.code = code;
            this.base.issuer = issuer;
            this.rendered = false;
            this.setState({sellCode: code, loading: true});
            // this.setState({loading: true});
            setTimeout(() => this.setState({ loading: false }), 2500);
            this.getDataForChart(this.base, true);
        }
    }

    timeFotRecent(time){
        var timeSinceTrade= new Date()-new Date(time);
        var timeSinceTradeFormat;

        var d = new Date(timeSinceTrade);

        if (d.getMinutes()>0) {
            timeSinceTradeFormat = d.getMinutes() + "m";
        } else {
            timeSinceTradeFormat = d.getSeconds() + "s";
        }
        if (d.getUTCHours()>0) {timeSinceTradeFormat = d.getUTCHours() + "h"}
        if (d>1000*3600*24){timeSinceTradeFormat = ">1 day"}

        return timeSinceTradeFormat;
    }

    getDataForChart(params, withRender){
        const baseBuying = params ? new Stellar.Asset(params.code, params.issuer) : AssetSlug.parseAssetSlug(urlParts1);
        const counterSelling = AssetSlug.parseAssetSlug(urlParts2);
        driver.orderbook.handlers.setOrderbook(baseBuying, counterSelling);
        this.unsub = driver.orderbook.event.sub(() => {
            if (!this.rendered && driver.orderbook.data.recentTrades !== undefined) {
                this.dataProcessing(withRender);
            }
        });
    }

    dataProcessing(withRender) {
        const dataForChart = driver.orderbook.data;
        const dataForChart2 = dataForChart.recentTrades;
        DataNew.length = 0;
        DataNew.push(...dataForChart2);
    }
    get headerTitles() {
        return {
            QUANTITY: "Quantity",
            PRICE: 'Price',
            TIME: 'Time',
        };
    }


    timeToDay(time){

        setInterval(()=>{

            let delta = Math.floor((timeFromServer - new Date()) / 1000);
            let days = Math.floor(delta / 86400);
            delta -= days * 86400;
            let hours = Math.floor(delta / 3600) % 24;
            delta -= hours * 3600;
            let minutes = Math.floor(delta / 60) % 60;
            delta -= minutes * 60;
            let seconds = delta % 60;
            let dateStr = ` ${minutes} m`;
            return dateStr;

        }, 1000);


    };



    getRecentRow(recent, index) {

        return (
            recent.map((data, index)=>(
                <Table.Row key={index}>
                    { this.state.selectedCell === this.headerTitles.QUANTITY || pageWidth() ? <Table.Cell>
                        {data.base_amount}
                        {/*{console.log("data", data)}*/}
                    </Table.Cell> : null }
                    { this.state.selectedCell === this.headerTitles.PRICE || pageWidth() ? <Table.Cell>
                        {Number(data.counter_amount)/Number(data.base_amount).toFixed(7)}
                    </Table.Cell> : null }
                    { this.state.selectedCell === this.headerTitles.TIME || pageWidth() ? <Table.Cell>
                        {this.timeToDay(data.ledger_close_time)}
                    </Table.Cell> : null }
                </Table.Row>
            ))
        );
    }

    getRecentTable(recent) {
        // console.log("this.state.recentData", this.state.recentData);
        return (
            <div className="is-relative">
                <Table className={'recent-table'} singleLine size="small" compact unstackable>
                    <Table.Header>
                        <Table.Row>
                            { this.state.selectedCell === this.headerTitles.QUANTITY || pageWidth() ? <Table.HeaderCell>Quantity({`${this.state.sellCode}`})</Table.HeaderCell> : null }
                            { this.state.selectedCell === this.headerTitles.PRICE || pageWidth() ? <Table.HeaderCell>Price(XLM)</Table.HeaderCell> : null }
                            { this.state.selectedCell === this.headerTitles.TIME || pageWidth() ? <Table.HeaderCell>Time</Table.HeaderCell> : null }
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {this.state.recentData.map((data, index)=>(
                            <Table.Row key={index}>
                                { this.state.selectedCell === this.headerTitles.QUANTITY || pageWidth() ? <Table.Cell style={data.base_is_seller ? {color: "#3cb46d"} : {color: "#d43d3d"}}>
                                    {data.base_amount}1
                                </Table.Cell> : null }
                                { this.state.selectedCell === this.headerTitles.PRICE || pageWidth() ? <Table.Cell>
                                    {(Number(data.counter_amount)/Number(data.base_amount)).toFixed(7)}
                                </Table.Cell> : null }
                                { this.state.selectedCell === this.headerTitles.TIME || pageWidth() ? <Table.Cell style={{"font-weight": "bold"}}>
                                    {this.timeFotRecent(data.ledger_close_time)}
                                </Table.Cell> : null }
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            </div>
        );
    }


    render() {
        return (
            <div style={{width: 100 + "%", "text-align": "center", "padding-top": 17 + "px"}}>
                <h1 className="recent-trades-title">Recent trades</h1>
                {this.state.loading ? <div className='sweet-loading'>
                    <ClipLoader
                        color={'#000000'}
                        loading={this.state.loading}
                    />
                </div> : this.getRecentTable()}
            </div>
        );
    }
}

RecentTable.propTypes = {};

export default RecentTable;
