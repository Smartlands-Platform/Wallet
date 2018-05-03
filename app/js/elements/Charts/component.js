import React, {Component} from 'react';

import Highcharts from 'highcharts/highstock';
import {get, isEqual} from 'lodash';
// import Ellipsis from './Ellipsis.jsx';
import Stellar from 'stellar-sdk';
import { ClipLoader } from 'react-spinners';


// TODO implement common chart component! Move it there!
import AssetSlug from '../../helpers/DataServer/Assets/Assets';
import Handlers from '../../helpers/DataServer/Handlers';
import Orderbook from '../../helpers/DataServer/OrderBook';

//TODO initial driver prototype for orderBook
const SERVER_URL = 'https://horizon.stellar.org';
// const SERVER_TESTNET_URL = 'https://horizon-testnet.stellar.org';
let STLKey = 'GPublic Global Stellar Network ; September 2015';
let ServerNew = new Stellar.Server(SERVER_URL);
let urlParts1 = 'SLT-smartlands.io';
// let urlParts1 = 'REPO-repocoin.io';

// let urlParts1 = 'KIN-apay.io';
let urlParts2 = 'XLM-native';
ServerNew.serverUrl = SERVER_URL;

let network = {
    horizonUrl: SERVER_URL,
    networkPassphrase: STLKey,
    isDefault: true,
    isTestnet: false,
    isCustom: false,
};

//TODO check on the prod
// Stellar.Network.use(new Stellar.Network(network.networkPassphrase));

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


const minuteFullDateFormat = '%Y-%m-%d %H:%M';
const minutePartDateFormat = '%m-%d %H:%M';
const dayPartDateFormat = '%m-%d';
const dayFullDateFormat = '%Y-%m-%d';
const monthFullDateFormat = '%Y-%m';

const axisDTLF = {
    millisecond: minutePartDateFormat,
    second: minutePartDateFormat,
    minute: minutePartDateFormat,
    hour: minutePartDateFormat,
    day: minutePartDateFormat,
    week: minuteFullDateFormat,
    month: dayFullDateFormat,
    year: dayFullDateFormat,
};

const dateTimeLabelFormats = {
    // We also dont care to show seconds or milliseconds since it is not very relevant in the
    // context of Stellar
    millisecond: minuteFullDateFormat,
    second: minuteFullDateFormat,
    minute: minuteFullDateFormat,
    hour: minuteFullDateFormat,
    day: minuteFullDateFormat,
    week: minuteFullDateFormat,
    month: monthFullDateFormat,
    year: '%Y',
};
const dataGroupingDateTimeLabelFormats = {
    millisecond: [minuteFullDateFormat, minuteFullDateFormat, ''],
    second: [minuteFullDateFormat, minuteFullDateFormat, ''],
    minute: [minuteFullDateFormat, minuteFullDateFormat, ''],
    hour: [minuteFullDateFormat, minuteFullDateFormat, ''],
    day: [minuteFullDateFormat, minuteFullDateFormat, ''],
    week: [minuteFullDateFormat, minuteFullDateFormat, ''],
    month: [monthFullDateFormat, monthFullDateFormat, ''],
    year: ['%Y', '%Y', '-%Y'],
};

export default class PriceChart extends Component {
    constructor(props) {
        super(props);
        this.rendered = false;
        this.state = {
            loading: true
        };
        this.base = {
            code: get(this.props.d.orderbook, 'base.asset_code', 'not'),
            issuer: get(this.props.d.orderbook, 'base.asset_issuer', 'not')
        };

        this.getDataForChart();
    }


    componentDidMount() {
        if (driver.orderbook.data.trades !== undefined) {
            // this.setState({ loading: false });
            this.renderChart(driver.orderbook.data, driver.orderbook.data.trades);

        } else {
            this.unsub = driver.orderbook.event.sub(() => {
                if (!this.rendered && driver.orderbook.data.trades !== undefined) {
                    // this.setState({ loading: false });
                    this.renderChart(driver.orderbook.data, driver.orderbook.data.trades);
                }
            });
        }
        // console.log("this.base.code", this.base.code);
        // if(this.base.code != "not") {
            setTimeout(() => this.setState({loading: false}), 2500);
        // }
    }

    componentWillUnmount() {
        if (this.unsub) this.unsub();
        this.destroyChart();
    }

    componentWillReceiveProps(nextProps) {
        const code = get(nextProps.orderbook, 'base.asset_code', null) || 'not';
        const issuer = get(nextProps.orderbook, 'base.asset_issuer', null) || 'not';
        // if (this.base.code != "not"){
            this.setState({loading: true});
            // setTimeout(() => this.setState({ loading: false }), 2000);
        // }
        if (!isEqual(code, this.base.code) && !isEqual(issuer, this.base.issuer)) {
            this.setState({loading: true});
            setTimeout(() => this.setState({ loading: false }), 2000);
            this.base.code = code;
            this.base.issuer = issuer;
            this.rendered = false;
            this.getDataForChart(this.base, true);
        }
    }

    shouldComponentUpdate() {
        if (this.stockChart) {
            this.stockChart.series[0].setData(this.orderbook.trades);
            return true;
        }

        return false;
    }


    getDataForChart(params, withRender){
        const baseBuying = params ? new Stellar.Asset(params.code, params.issuer) : AssetSlug.parseAssetSlug(urlParts1);
        const counterSelling = AssetSlug.parseAssetSlug(urlParts2);
        driver.orderbook.handlers.setOrderbook(baseBuying, counterSelling);

        if (withRender) this.destroyChart();
        this.unsub = driver.orderbook.event.sub(() => {
            if (!this.rendered && driver.orderbook.data.trades !== undefined) {
                this.dataProcessing(withRender);
            }
        });
    }

    dataProcessing(withRender) {
        const dataForChart = driver.orderbook.data;
        const dataForChart2 = dataForChart.trades;
        DataNew.push(...dataForChart2);
        if (withRender) this.renderChart(driver.orderbook.data, driver.orderbook.data.trades)

    }

    renderChart(orderbook) {
        this.rendered = true;

        const buyingCode = get(orderbook.baseBuying, 'code', '');
        const sellingCode = get(orderbook.counterSelling, 'code', '');
        const pairName = `${buyingCode}/${sellingCode}`;
        const priceChartMessage = document.getElementsByClassName('data__message')[0];
        this.orderbook = orderbook;
        // console.log("buyingCode", buyingCode);


        if (!orderbook.trades.length) {
            priceChartMessage.textContent = `No trade history for ${pairName}`;
            return;
        }

        this.highstockOptions = {
            colors: ['#42B36F'],
            chart: {
                style: {
                    fontFamily: 'Source Sans Pro',
                },
                spacingBottom: 18,
                spacingTop: -12,
                spacingLeft: 18,
                spacingRight: 18,
                borderRadius: 4,
            },
            rangeSelector: {
                // inputPosition: {
                //   y: 0,
                // },
                buttonPosition: {
                    y: 25,
                },
                zIndex: 30,
                inputEnabled: false,
                // inputDateFormat: dayFullDateFormat,
                // inputEditDateFormat: dayFullDateFormat,
                buttons: [
                    {
                        type: 'hour',
                        count: 6,
                        text: '6h',
                    },
                    {
                        type: 'hour',
                        count: 24,
                        text: '24h',
                    },
                    {
                        type: 'day',
                        count: 4,
                        text: '4d',
                    },
                    {
                        type: 'week',
                        count: 1,
                        text: '1w',
                    },
                    {
                        type: 'month',
                        count: 1,
                        text: '1m',
                    }, {
                        type: 'all',
                        text: 'All',
                    }],
                selected: 2,
            },
            series: [{
                name: pairName,
                data: DataNew,
                type: 'areaspline',
                tooltip: {
                    dateTimeLabelFormats,
                    valueDecimals: 7,
                    pointFormat: '{series.name}: <b>{point.y}</b><br />', // Remove the bullet point
                },
                fillColor: 'rgba(66, 179, 111, 0.5)',
                zIndex: -1,
                lineWidth: 1,
                states: {
                    hover: {
                        enabled: false,
                        // lineWidth: 2,
                    },
                },
                threshold: null,
            }],
            tooltip: {
                backgroundColor: '#42b36f',
                borderColor: '#42b36f',
                borderRadius: 3,
                borderWidth: 0,
                crosshairs: [null, null],
                shadow: {
                    // Same as the island stuff in StellarTerm
                    color: 'rgba(0,0,0,0.375)', // 0.3/0.8=0.375 to account for tooltip opacity
                    width: 3,
                    offsetX: 0,
                    offsetY: 1,
                },
                zIndex: 2,
                useHTML: true,
                style: {
                    opacity: '0.8',
                    cursor: 'default',
                    fontSize: '12px',
                    pointerEvents: 'none',
                    whiteSpace: 'nowrap',
                },
            },
            xAxis: {
                dateTimeLabelFormats: axisDTLF,
                ordinal: false,
            },
            yAxis: {
                gridLineColor: 'rgba(0, 0, 0, 0.06)',
                gridZIndex: 30,
                tickPixelInterval: 30,
                minPadding: 0.1,
                maxPadding: 0.1,
                minRange: orderbook.trades[orderbook.trades.length - 1][1]*0.5,
                labels: {
                    formatter: function() {
                        return this.value
                    }
                }
            },
            navigator: {
                maskFill: 'rgba(66, 179, 111, 0.5)',
                series: {
                    // type: 'areaspline',
                    fillOpacity: 0.7,
                    lineWidth: 1,
                    lineColor: '#42B36F',
                    fillColor: 'rgba(66, 179, 111, 0.5)',
                    shadow: false,
                },
                outlineColor: 'rgba(66, 179, 111, 0.5)',
                outlineWidth: 1,
            },
            scrollbar: {
                enabled: false,
            },
            credits: {
                enabled: false,
            },
        };


        // if (this.state.loading || this.render){
        //     this.stockChart = "<div className='sweet-loading' style={{width: 50 + \"px\", height: 50 + \"px\"}}>\n" +
        //         "                        <ClipLoader color={'#000000'} loading={this.state.loading}/>\n" +
        //         "                    </div>"
        // }else{
            this.stockChart = Highcharts.stockChart('PriceChart', this.highstockOptions);
        // }



        priceChartMessage.textContent = '';
    }

    destroyChart() {
        if (!this.stockChart) return;
        this.stockChart.destroy();
        this.stockChart = null;
    }

    render() {
        return <div className="so-back islandBack">
            <div className="island PriceChartChunk">
                {this.state.loading ? <div className='sweet-loading' style={{width: 50 + "px", height: 50 + "px"}}>
                    <ClipLoader color={'#000000'} loading={this.state.loading}/>
                </div> : null}
                <div id="PriceChart">
                    {/*{this.state.loading ? <div className='sweet-loading' style={{width: 50 + "px", height: 50 + "px"}}>*/}
                        {/*<ClipLoader color={'#000000'} loading={this.state.loading}/>*/}
                    {/*</div>: null}*/}
                </div>
                <p className="data__message" />
            </div>
        </div>;
    }
}