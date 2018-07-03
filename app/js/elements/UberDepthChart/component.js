import React, {Component} from 'react';
import AmCharts from '@amcharts/amcharts3-react';
import {get, map, sortBy, isEqual, uniq} from 'lodash';
import {Loading} from "../../helpers/Loading/Loading";
import {XYPlot, XAxis, YAxis, HorizontalGridLines, VerticalGridLines, VerticalRectSeries, LineSeries} from 'react-vis';

export default class AmChart extends Component {

    constructor(props) {
        super(props);
        this._res = [];
        this.rendered = false;
        this.state = {
            loading: true,
            dataBids: [],
            dataAsks: [],
            codeActive: null,
            plotAsksData: [],
            plotBidsData: [],
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


        // console.log("plotData", this.props.orderbook);
        if(this.props.orderbook != null){
            let currentAmount = 0;
            const asksData = this.props.orderbook.asks.map((e, index) => {
                let nextElement = e;
                if (this.props.orderbook.asks.length > index + 1) {
                    nextElement = this.props.orderbook.asks[index + 1];
                }
                currentAmount += Number(e.amount);
                return {
                    x0: Number(e.price),
                    x: Number(nextElement.price),
                    y: currentAmount,
                }
            });
            const bidsData = this.props.orderbook.bids.map((e, index) => {
                let nextElement = e;
                if (this.props.orderbook.bids.length > index + 1) {
                    nextElement = this.props.orderbook.bids[index + 1];
                }
                currentAmount += Number(e.amount);
                console.log("-Number(e.price)", -Number(e.price));
                console.log("-Number(nextElement.price)", -Number(nextElement.price));
                return {
                    x0: -Number(e.price),
                    x: -Number(nextElement.price),
                    y: currentAmount,
                }
            });
            this.setState({plotAsksData: asksData, plotBidsData: bidsData});
        }


        // this.setState({codeActive: code});
        // if (this.props.orderbookIsChanged && !this.props.sellBuyIsChanged){
        //     this.setState({loading: true, codeActive: code});
        // }else if(this.props.sellBuyIsChanged && !!this.config.dataProvider.length){
        //     this.setState({loading: false});
        // }
        //
        // if (this.props.orderbookIsChanged && code != this.props.orderbook.base.asset_code && code != this.base.code) {
        //     this.setState({dataBids: [], dataAsks: []});
        //     // console.log("orderbookIsChanged", this.props.orderbook.base.asset_code , this.base.code , code , this.state.dataBids);
        // }else{
        //     if(this.props.orderbook != null && code === this.props.orderbook.base.asset_code && code === this.base.code && this.state.dataBids != 0){
        //         this.setState({loading: false});
        //     }
        //     if(this.props.orderbook != null && code === this.props.orderbook.base.asset_code && code === this.base.code){
        //         this.setState({dataBids: this.props.orderbook.bids, dataAsks: this.props.orderbook.asks});
        //         // console.log("orderbookIsChanged != null", this.props.orderbook.base.asset_code , this.base.code , code , this.state.dataBids);
        //     }else{
        //         this.setState({dataBids: [], dataAsks: []});
        //     }
        // }


        if (!isEqual(code, this.base.code) && !isEqual(issuer, this.base.issuer)) {
            this.base.code = code;
            this.base.issuer = issuer;
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

        // console.log("this.bids", this.state.plotBidsData);
        // const bids = this.state.dataBids;
        // const asks = this.state.dataAsks;
        // this.processData({bids, asks});

        return <div>
                 <XYPlot
                     className="sweet-loading"
                     xDomain={[-8,8]}
                     width={300}
                     height={300}
                     stackBy="x">
                     <VerticalGridLines />
                     <HorizontalGridLines />
                     <XAxis />
                     <YAxis />
                     <VerticalRectSeries
                         data={this.state.plotBidsData}
                     />
                     <VerticalRectSeries
                         data={this.state.plotAsksData}
                     />
                 </XYPlot>
         </div>;

    }
}
