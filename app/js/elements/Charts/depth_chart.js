import React, {Component} from 'react';
import AmCharts from '@amcharts/amcharts3-react';
import {get, map, sortBy, isEqual} from 'lodash';
import { ClipLoader } from 'react-spinners';
import Stellar from '../../../../libs/stellar-sdk';

// TODO implement common chart component! Move it there!
import AssetSlug from '../../helpers/DataServer/Assets/Assets';
import Handlers from '../../helpers/DataServer/Handlers';
import Orderbook from '../../helpers/DataServer/OrderBook';

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

Stellar.Network.useTestNetwork();

function Driver(driverOpts) {
    this.Server = new Stellar.Server(driverOpts.network.horizonUrl);
    this.Server.serverUrl = driverOpts.network.horizonUrl;
    this.session = new Handlers(this);
    this.orderbook = new Orderbook(this);
}

let driver = new Driver({
    network,
});

const DataNew = [];

export default class AmChart extends Component {

    constructor(props) {
        super(props);
        this._res = [];
        this.rendered = false;
        this.state = {
            loading: true
        };
        this.base = {
            code: get(this.props.d.orderbook, 'base.asset_code', 'not'),
            issuer: get(this.props.d.orderbook, 'base.asset_issuer', 'not')
        };
        this._config = {
            "type": "serial",
            "theme": "light",
            "dataProvider": [],
            "graphs": [{
                "id": "bids",
                "fillAlphas": 0.1,
                "lineAlpha": 1,
                "lineThickness": 2,
                "lineColor": "#42b36f",
                "type": "step",
                "valueField": "bidstotalvolume",
                "balloonFunction": this.balloon.bind(this),
            }, {
                "id": "asks",
                "fillAlphas": 0.1,
                "lineAlpha": 1,
                "lineThickness": 2,
                "lineColor": "#f00",
                "type": "step",
                "valueField": "askstotalvolume",
                "balloonFunction": this.balloon.bind(this),
            }, {
                "lineAlpha": 0,
                "fillAlphas": 0.2,
                "lineColor": "#000",
                "type": "column",
                "clustered": false,
                "valueField": "bidsvolume",
                "showBalloon": false
            }, {
                "lineAlpha": 0,
                "fillAlphas": 0.2,
                "lineColor": "#000",
                "type": "column",
                "clustered": false,
                "valueField": "asksvolume",
                "showBalloon": false
            }],
            "categoryField": "value",
            "chartCursor": {},
            "balloon": {
                "textAlign": "left"
            },
            "valueAxes": [{
                "title": "Volume"
            }],
            "categoryAxis": {
                "minHorizontalGap": 100,
                "startOnAxis": true,
                "showFirstLabel": false,
                "showLastLabel": false
            },
            "export": {
                "enabled": false
            }
        }

        this.defBidsAsksData = this.setDefaultData;
        this.updateTrustlineData();
    }

    componentDidMount() {
        // setTimeout(() => this.setState({ loading: false }), 2500);
        if (driver.orderbook.data.asks && driver.orderbook.data.bids) {
            this.processData(driver.orderbook.data);
        } else {
            this.unsub = driver.orderbook.event.sub(() => {
                this.setState({ loading: false });
                if (this.isDataReady) {
                    this.base = {
                        code: get(driver.orderbook.data, 'baseBuying.code', 'not'),
                        issuer: get(driver.orderbook.data, 'baseBuying.issuer', 'not')
                    };
                    this.processData(driver.orderbook.data);
                }
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        const code = get(nextProps.d.orderbook, 'base.asset_code', 'not');
        const issuer = get(nextProps.d.orderbook, 'base.asset_issuer', 'not');
        if (!isEqual(code, this.base.code) && !isEqual(issuer, this.base.issuer)) {
            setTimeout(() =>this.setState({loading: true}), 0);
            setTimeout(() => this.setState({ loading: false }), 2500);
            this.base.code = code;
            this.base.issuer = issuer;
            this.rendered = false;
            this._config.dataProvider = [];
            this.updateTrustlineData(this.base, true);
        }
    }

    componentWillUnmount() {
        if (this.unsub) this.unsub();
    }

    get setDefaultData() {
        let arr = [];
        for (let i = 0; i < 10; i++) {
            arr.push({
                price: '1',
                amount: '0.1'
            });
        }
        return arr;
    }

    updateTrustlineData(params, withReCall) {
        const baseBuying = params ? new Stellar.Asset(params.code, params.issuer) : AssetSlug.parseAssetSlug(urlParts1);
        const counterSelling = AssetSlug.parseAssetSlug(urlParts2);
        // TODO
        driver.orderbook.handlers.setOrderbook(baseBuying, counterSelling, 200);

        this.unsub = driver.orderbook.event.sub(() => {
            if (!this.rendered && this.isDataReady) this.dataProcessing(withReCall);
        });

        // setTimeout(() => {
        //     this.dataProcessing(withReCall);
        // }, 5000);
    }

    dataProcessing(withReCall) {
        this.rendered = true;
        const dataForChart = driver.orderbook.data;
        const dataForChart2 = dataForChart.trades;
        DataNew.push(...dataForChart2);
        // let zeroPoint=((Number(driver.orderbook.data.asks[0].price)+Number(driver.orderbook.data.bids[0].price))/2).toFixed(7)
        // console.log("zeroPoint", driver.orderbook.data.asks[0]);
        // console.log("dataForChart2", dataForChart2);
        // DataNew.push([dataForChart2[0,0],zeroPoint]);
        // driver.orderbook.data.asks.push({amount:0,price:zeroPoint})
        // driver.orderbook.data.bids.push({amount:0,price:zeroPoint})
        if (withReCall) this.processData(driver.orderbook.data)
    }

    get isDataReady() {
        return !!(driver.orderbook.data.asks && driver.orderbook.data.bids);
    }

    dataFormatter(list, type, desc) {
        // Convert to data points
        list = sortBy(map(list, (item) => {
            return {
                value: Number(item.price),
                volume: Number(item.amount)

            }
        }), ['value']);

        // Calculate cummulative volume
        if (desc) {
            for(let i = list.length - 1; i >= 0; i--) {
                if (i < (list.length - 1)) {
                    list[i].totalvolume = list[i+1].totalvolume + list[i].volume;
                    // console.log("total volime", list[i].totalvolume)
                } else {
                    list[i].totalvolume = list[i].volume;

                }
                const dp = {};
                dp['value'] = list[i].value;
                dp[type + 'volume'] = list[i].volume / list[i].value;
                dp[type + 'totalvolume'] = list[i].totalvolume / list[i].value;
                this._res.unshift(dp);
            }
        }
        else {
            for(let i = 0; i < list.length; i++) {
                if (i > 0) {
                    list[i].totalvolume = list[i-1].totalvolume + list[i].volume;
                } else {
                    list[i].totalvolume = list[i].volume;
                }
                const dp = {};
                dp['value'] = list[i].value;
                dp[type + 'volume'] = list[i].volume;
                dp[type + 'totalvolume'] = list[i].totalvolume;
                this._res.push(dp);
            }
        }
    }

    processData(orderbooks) {
        // console.log('orderbooks', orderbooks);
        let {asks, bids} = orderbooks;
        this._res.length = 0;
        // if (!bids.length && !asks.length) {
        //     bids = this.defBidsAsksData;
        //     asks = this.defBidsAsksData
        // }
        this.dataFormatter(bids, 'bids', true);
        this.dataFormatter(asks, 'asks', false);

        this.config = this._res;
    }

    get config() {
        return this._config;
    }

    set config(value) {
        this._config.dataProvider = value;
    }

    balloon(item, graph) {
        console.log("item", item)
        let txt;
        if (graph.id === "asks") {
            txt = "Ask: <strong>" + this.formatNumber(item.dataContext.value, graph.chart, 4) + "</strong><br />"
                + "Total volume: <strong>" + this.formatNumber(item.dataContext.askstotalvolume, graph.chart, 4) + "</strong><br />"
                + "Volume: <strong>" + this.formatNumber(item.dataContext.asksvolume, graph.chart, 4) + "</strong>";
        } else {
            txt = "Bid: <strong>" + this.formatNumber(item.dataContext.value, graph.chart, 4) + "</strong><br />"
                + "Total volume: <strong>" + this.formatNumber(item.dataContext.bidstotalvolume, graph.chart, 4) + "</strong><br />"
                + "Volume: <strong>" + this.formatNumber(item.dataContext.bidsvolume, graph.chart, 4) + "</strong>";
        }
        return txt;
    }

    formatNumber(val, chart, precision) {
        return AmCharts.formatNumber(
            val,
            {
                precision: precision ? precision : chart.precision,
                decimalSeparator: chart.decimalSeparator,
                thousandsSeparator: chart.thousandsSeparator
            });
    }

    render() {
        return <div>
            {!!this.config.dataProvider.length ? <AmCharts.React className="depth-chart" options={this.config} /> : <div className='sweet-loading'> <ClipLoader
                color={'#000000'}
                loading={this.state.loading}
            /> </div> }
        </div>;
    }
}
