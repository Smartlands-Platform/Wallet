import React, {Component} from 'react';
import AmCharts from '@amcharts/amcharts3-react';
import {get, map, sortBy, isEqual, uniq} from 'lodash';
import {Loading} from "../../helpers/Loading/Loading";

export default class AmChart extends Component {

    constructor(props) {
        super(props);
        this._res = [];
        this.rendered = false;
        this.state = {
            loading: true,
            dataBids: [],
            dataAsks: [],
            codeActive: null
        };
        this.base = {
            code: get(this.props.orderbook, 'base.asset_code', 'not'),
            issuer: get(this.props.orderbook, 'base.asset_issuer', 'not')
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
            },
                {
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
            "columnSpacing": 10,
            "columnWidth": 0.1,
            "balloon": {
                "textAlign": "left"
            },
            "valueAxes": [{
                "title": null,
                "autoGridCount": true,
            }],
            "categoryAxis": {
                "minHorizontalGap": 100,
                "startOnAxis": false,
                "showFirstLabel": false,
                "showLastLabel": false
            },
            "export": {
                "enabled": false
            }
        }
    }

    componentDidMount() {
        if(this.base.code != "not"){
            setTimeout(() => this.setState({ loading: false }), 1000);
        }
    }

    componentWillReceiveProps(nextProps) {
        const code = get(nextProps.orderbook, 'base.asset_code', null) || 'not';
        const issuer = get(nextProps.orderbook, 'base.asset_issuer', null) || 'not';

        this.setState({codeActive: code});
        if (this.props.orderbookIsChanged && !this.props.sellBuyIsChanged){
            this.setState({loading: true, codeActive: code});
        }else if(this.props.sellBuyIsChanged && !!this.config.dataProvider.length){
            this.setState({loading: false});
        }

        if (this.props.orderbookIsChanged && code != this.props.orderbook.base.asset_code && code != this.base.code) {
            this.setState({dataBids: [], dataAsks: []});
            // console.log("orderbookIsChanged", this.props.orderbook.base.asset_code , this.base.code , code , this.state.dataBids);
        }else{
            if(this.props.orderbook != null && code === this.props.orderbook.base.asset_code && code === this.base.code && this.state.dataBids != 0){
                this.setState({loading: false});
            }
            if(this.props.orderbook != null && code === this.props.orderbook.base.asset_code && code === this.base.code){
                this.setState({dataBids: this.props.orderbook.bids, dataAsks: this.props.orderbook.asks});
                // console.log("orderbookIsChanged != null", this.props.orderbook.base.asset_code , this.base.code , code , this.state.dataBids);
            }else{
                this.setState({dataBids: [], dataAsks: []});
            }
        }
        //
        // if (!this.props.orderbookIsChanged && !!this.config.dataProvider.length){
        //     this.setState({loading: false});
        // }

        if (!isEqual(code, this.base.code) && !isEqual(issuer, this.base.issuer)) {

            // console.log("fsdfsdfsdf");
            this.base.code = code;
            this.base.issuer = issuer;
        }

        if (!isEqual(code, this.base.code) && !isEqual(issuer, this.base.issuer) && this.state.dataBids != 0) {

            // setTimeout(() => this.setState({loading: false}), 1000);
            // console.log("fsdfsdfsdf");
            // this.base.code = code;
            // this.base.issuer = issuer;
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

    /* SPREAD REALISATION
       ******************
    // dataProcessing(withReCall) {
    //     this.rendered = true;
    //     const dataForChart = this.props.orderbook.data;
        // const dataForChart2 = dataForChart.trades;

        // DataNew.push(...dataForChart2);
        // let zeroPoint=((Number(this.props.orderbook.data.asks[0].price)+Number(this.props.orderbook.data.bids[0].price))/2).toFixed(7)
        // console.log("zeroPoint", this.props.orderbook.data.asks[0]);
        // console.log("dataForChart2", dataForChart2);
        // DataNew.push([dataForChart2[0,0],zeroPoint]);
        // this.props.orderbook.data.asks.push({amount:0,price:zeroPoint});
        // this.props.orderbook.data.bids.push({amount:0,price:zeroPoint});
        // if (withReCall) this.processData(this.props.orderbook.data)
    // }
       ****************** */

    dataFormatter(list, type, desc) {
        // Convert to data points
        list = sortBy(map(list, (item) => {
            return {
                value: Number(item.price),
                volume: Number(item.amount)

            }
        }), ['value']);
        const intList = uniq(list.reduce((newList, item) => {
            newList.push(parseInt(item.value, 10));
            return newList;
        }, []));
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
                dp['axis'] = Math.floor(list[i].value);
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
                dp['axis'] = Math.floor(list[i].value);
                dp['value'] = list[i].value;
                dp[type + 'volume'] = list[i].volume;
                dp[type + 'totalvolume'] = list[i].totalvolume;
                this._res.push(dp);
            }
        }
    }

    processData({bids, asks}) {
        this._res.length = 0;
        this.dataFormatter(bids, 'bids', true);
        this.dataFormatter(asks, 'asks', false);

        this.config = this._res;
    }

    get config() {
        return this._config;
    }

    set config(value) {
        this._config.valueAxes = [{
            "title": `Depth ${this.state.codeActive}`,
            "autoGridCount": true,
        }];
        this._config.dataProvider = value;
    }

    balloon(item, graph) {
        // console.log("item", item)
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
        const bids = this.state.dataBids;
        const asks = this.state.dataAsks;
        this.processData({bids, asks});
        // console.log("this.tradesOrderbook", this.props.sellBuyIsChanged);
        // console.log("orderbook", this.props.orderbook);

        var chartData;
        if(!!this.config.dataProvider.length){
            // console.log("true");
            var chartData = <AmCharts.React className="depth-chart" options={this.config} />
        }else{
            return null;
            // console.log("false");
        }
        return <div>
             {chartData}
         </div>;

    }
}

// import React, {Component} from 'react';
// import AmCharts from '@amcharts/amcharts3-react';
// import {get, map, sortBy, isEqual, uniq} from 'lodash';
// import { ClipLoader } from 'react-spinners';
// import Stellar from '../../../../libs/stellar-sdk';
//
// // TODO implement common chart component! Move it there!
// import AssetSlug from '../../helpers/DataServer/Assets/Assets';
// import Handlers from '../../helpers/DataServer/Handlers';
// import Orderbook from '../../helpers/DataServer/OrderBook';
//
// const SERVER_URL = 'https://horizon.stellar.org';
// let STLKey = 'GPublic Global Stellar Network ; September 2015';
// let ServerNew = new Stellar.Server(SERVER_URL);
// let urlParts1 = 'SLT-smartlands.io';
// let urlParts2 = 'XLM-native';
// ServerNew.serverUrl = SERVER_URL;
//
// let network = {
//     horizonUrl: SERVER_URL,
//     networkPassphrase: STLKey,
//     isDefault: true,
//     isTestnet: false,
//     isCustom: false,
// };
//
// Stellar.Network.useTestNetwork();
//
// function Driver(driverOpts) {
//     this.Server = new Stellar.Server(driverOpts.network.horizonUrl);
//     this.Server.serverUrl = driverOpts.network.horizonUrl;
//     this.session = new Handlers(this);
//     this.orderbook = new Orderbook(this);
// }
//
// let driver = new Driver({
//     network,
// });
//
// const DataNew = [];
//
// export default class AmChart extends Component {
//
//     constructor(props) {
//         super(props);
//         this._res = [];
//         this.rendered = false;
//         this.state = {
//             loading: true,
//             dataForChart: []
//         };
//         this.base = {
//             code: get(this.props.orderbook, 'base.asset_code', 'not'),
//             issuer: get(this.props.orderbook, 'base.asset_issuer', 'not')
//         };
//         this._config = {
//             "type": "serial",
//             "theme": "light",
//             "dataProvider": [],
//             "graphs": [{
//                 "id": "bids",
//                 "fillAlphas": 0.1,
//                 "lineAlpha": 1,
//                 "lineThickness": 2,
//                 "lineColor": "#42b36f",
//                 "type": "step",
//                 "valueField": "bidstotalvolume",
//                 "balloonFunction": this.balloon.bind(this),
//             }, {
//                 "id": "asks",
//                 "fillAlphas": 0.1,
//                 "lineAlpha": 1,
//                 "lineThickness": 2,
//                 "lineColor": "#f00",
//                 "type": "step",
//                 "valueField": "askstotalvolume",
//                 "balloonFunction": this.balloon.bind(this),
//             }, {
//                 "lineAlpha": 0,
//                 "fillAlphas": 0.2,
//                 "lineColor": "#000",
//                 "type": "column",
//                 "clustered": false,
//                 "valueField": "bidsvolume",
//                 "showBalloon": false
//             }, {
//                 "lineAlpha": 0,
//                 "fillAlphas": 0.2,
//                 "lineColor": "#000",
//                 "type": "column",
//                 "clustered": false,
//                 "valueField": "asksvolume",
//                 "showBalloon": false
//             }],
//             "categoryField": "value",
//             "chartCursor": {},
//             "columnSpacing": 10,
//             "columnWidth": 0.1,
//             "balloon": {
//                 "textAlign": "left"
//             },
//             "valueAxes": [{
//                 "autoGridCount": true,
//                 // "title": "Volume"
//             }],
//             "categoryAxis": {
//                 "minHorizontalGap": 100,
//                 "startOnAxis": false,
//                 "showFirstLabel": false,
//                 "showLastLabel": false
//             },
//             "export": {
//                 "enabled": false
//             }
//         };
//
//         this.defBidsAsksData = this.setDefaultData;
//         this.updateTrustlineData();
//     }
//
//     componentDidMount() {
//         if (driver.orderbook.data.asks && driver.orderbook.data.bids) {
//             this.processData(driver.orderbook.data);
//             // console.log("driver.orderbook.data", driver.orderbook.data);
//         } else {
//             this.unsub = driver.orderbook.event.sub(() => {
//                 this.setState({ loading: false });
//                 if (this.isDataReady) {
//                     this.base = {
//                         code: get(driver.orderbook.data, 'baseBuying.code', 'not'),
//                         issuer: get(driver.orderbook.data, 'baseBuying.issuer', 'not')
//                     };
//                     console.log("driver.orderbook.data else", driver.orderbook.data);
//                     // this.setState({datForChart: this._res});
//                     this.processData(driver.orderbook.data);
//                 }
//             });
//         }
//     }
//
//     componentWillReceiveProps(nextProps) {
//
//         if (this.props.orderbookIsChanged && !this.props.sellBuyIsChanged){
//             this.setState({loading: true});
//         }else if(this.props.sellBuyIsChanged && !!this.config.dataProvider.length){
//             this.setState({loading: false});
//         }
//
//         const code = get(nextProps.orderbook, 'base.asset_code', 'not');
//         const issuer = get(nextProps.orderbook, 'base.asset_issuer', 'not');
//
//         if (!isEqual(code, this.base.code) && !isEqual(issuer, this.base.issuer)) {
//
//             this.base.code = code;
//             this.base.issuer = issuer;
//             this.rendered = false;
//             this._config.dataProvider.length = 0;
//             this.updateTrustlineData(this.base, true);
//         }
//     }
//
//     componentWillUnmount() {
//         if (this.unsub) this.unsub();
//     }
//
//     get setDefaultData() {
//         let arr = [];
//         for (let i = 0; i < 10; i++) {
//             arr.push({
//                 price: '1',
//                 amount: '0.1'
//             });
//         }
//         return arr;
//     }
//
//     updateTrustlineData(params, withReCall) {
//
//         // console.log("this.props.sellBuyData[0] ", this.props.sellBuyData );
//         const baseBuying = params ? this.props.sellBuyData[0] : AssetSlug.parseAssetSlug(urlParts1);
//         const counterSelling = AssetSlug.parseAssetSlug(urlParts2);
//         // TODO
//
//         // console.log(baseBuying, counterSelling);
//         driver.orderbook.handlers.setOrderbook(baseBuying, counterSelling);
//
//         this.unsub = driver.orderbook.event.sub(() => {
//             if (!this.rendered && this.isDataReady) this.dataProcessing(withReCall);
//         });
//     }
//
//     dataProcessing(withReCall) {
//         this.rendered = true;
//         const dataForChart = driver.orderbook.data;
//         const dataForChart2 = dataForChart.trades;
//         DataNew.push(...dataForChart2);
//         // let zeroPoint=((Number(driver.orderbook.data.asks[0].price)+Number(driver.orderbook.data.bids[0].price))/2).toFixed(7)
//         // console.log("zeroPoint", driver.orderbook.data.asks[0]);
//         // console.log("dataForChart2", dataForChart2);
//         // DataNew.push([dataForChart2[0,0],zeroPoint]);
//         // driver.orderbook.data.asks.push({amount:0,price:zeroPoint})
//         // driver.orderbook.data.bids.push({amount:0,price:zeroPoint})
//         if (withReCall) this.processData(driver.orderbook.data);
//
//     }
//
//     get isDataReady() {
//         return !!(driver.orderbook.data.asks && driver.orderbook.data.bids);
//     }
//
//     dataFormatter(list, type, desc) {
//         // Convert to data points
//         list = sortBy(map(list, (item) => {
//             return {
//                 value: Number(item.price),
//                 volume: Number(item.amount)
//
//             }
//         }), ['value']);
//         const intList = uniq(list.reduce((newList, item) => {
//             newList.push(parseInt(item.value, 10));
//             return newList;
//         }, []));
//
//         // Calculate cummulative volume
//         if (desc) {
//             for(let i = list.length - 1; i >= 0; i--) {
//                 if (i < (list.length - 1)) {
//                     list[i].totalvolume = list[i+1].totalvolume + list[i].volume;
//                     // console.log("total volime", list[i].totalvolume)
//                 } else {
//                     list[i].totalvolume = list[i].volume;
//
//                 }
//                 const dp = {};
//                 dp['axis'] = Math.floor(list[i].value);
//                 dp['value'] = list[i].value;
//                 dp[type + 'volume'] = list[i].volume / list[i].value;
//                 dp[type + 'totalvolume'] = list[i].totalvolume / list[i].value;
//                 this._res.unshift(dp);
//             }
//         }
//         else {
//             for(let i = 0; i < list.length; i++) {
//                 if (i > 0) {
//                     list[i].totalvolume = list[i-1].totalvolume + list[i].volume;
//                 } else {
//                     list[i].totalvolume = list[i].volume;
//                 }
//                 const dp = {};
//                 dp['axis'] = Math.floor(list[i].value);
//                 dp['value'] = list[i].value;
//                 dp[type + 'volume'] = list[i].volume;
//                 dp[type + 'totalvolume'] = list[i].totalvolume;
//                 this._res.push(dp);
//             }
//         }
//     }
//
//     processData(orderbooks) {
//         let {asks, bids} = orderbooks;
//         this._res.length = 0;
//         this.dataFormatter(bids, 'bids', true);
//         this.dataFormatter(asks, 'asks', false);
//
//         if (this.base.code === "not" || this.base.code === "SLT" && !!this.config.dataProvider.length === false && this.config.dataProvider.length === 0 && this.props.amChartData != null) {
//             this._res =  this.props.amChartData;
//             this.config = this._res;
//
//         }else{
//             this.config = this._res;
//
//         }
//
//         if(this.base.code === "SLT" && !!this.config.dataProvider.length && this.config.dataProvider.length === 120){
//             const amData = this._res;
//             this.props.setAmcharData({amData});
//             this._res =  this.props.amChartData;
//             this.config = this._res;
//
//         }
//     }
//
//     get config() {
//         return this._config;
//     }
//
//     set config(value) {
//             this._config.dataProvider = value;
//     }
//
//     balloon(item, graph) {
//         let txt;
//         if (graph.id === "asks") {
//             txt = "Ask: <strong>" + this.formatNumber(item.dataContext.value, graph.chart, 4) + "</strong><br />"
//                 + "Total volume: <strong>" + this.formatNumber(item.dataContext.askstotalvolume, graph.chart, 4) + "</strong><br />"
//                 + "Volume: <strong>" + this.formatNumber(item.dataContext.asksvolume, graph.chart, 4) + "</strong>";
//         } else {
//             txt = "Bid: <strong>" + this.formatNumber(item.dataContext.value, graph.chart, 4) + "</strong><br />"
//                 + "Total volume: <strong>" + this.formatNumber(item.dataContext.bidstotalvolume, graph.chart, 4) + "</strong><br />"
//                 + "Volume: <strong>" + this.formatNumber(item.dataContext.bidsvolume, graph.chart, 4) + "</strong>";
//         }
//         return txt;
//     }
//
//     formatNumber(val, chart, precision) {
//         return AmCharts.formatNumber(
//             val,
//             {
//                 precision: precision ? precision : chart.precision,
//                 decimalSeparator: chart.decimalSeparator,
//                 thousandsSeparator: chart.thousandsSeparator
//             });
//     }
//
//     render() {
//         var chartData;
//         if(!!this.config.dataProvider.length){
//             // console.log("true");
//             var chartData = <AmCharts.React className="depth-chart" options={this.config} />
//         }else{
//             return null;
//             // console.log("false");
//         }
//         return <div>
//             {chartData}
//         </div>;
//     }
// }

