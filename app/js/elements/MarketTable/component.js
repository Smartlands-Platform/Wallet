import React, {Component} from 'react';
import {get, map, sortBy, isEqual, uniq} from 'lodash';
import {Loading} from "../../helpers/Loading/Loading";

export default class MarketTable extends Component {

    constructor(props) {
        super(props);
        this.rendered = false;
        this.state = {
            loading: true,
            volume24h_USD: null,
            price_USD: null,
            price_XLM: null,
            listing: [],
            coinId: null,
            marketKapData: null,
            market_cap: '-',
            low: null,
            high: null

        };
        this.base = {
            code: 'not',
            issuer:'not'
        };
    }

    componentDidMount() {
        if(this.base.code != "not"){
            setTimeout(() => this.setState({ loading: false }), 1000);
        }
    }

    fetchDataListing(){
        let self = this;
        fetch('https://api.coinmarketcap.com/v2/listings/')
            .then(function(response) {
                return response.json();
            }).then(function(json) {
                function getValues(array, buyingCode) {
                    return array
                        .filter(function(values, item){
                            return (values.symbol === buyingCode)
                        })
                        .map(function (item) {
                            return item;
                        });
                }
                if(self.base.code === "SLT" || self.base.code === "MOBI" || self.base.code === "RMT"){
                    let listingArray = getValues(json.data, self.base.code);
                    const listingObjectId = Object.assign({}, ...listingArray);
                    // console.log("listingObjectId", listingObjectId.id);
                    self.fetchDataCoinCap(listingObjectId.id);
                }else{
                    self.setState({market_cap: '-'});
                }
        }).catch(function(ex) {
            console.log('parsing failed', ex)
        })
    }

    toMillion(labelValue) {

        // Nine Zeroes for Billions
        return Math.abs(Number(labelValue)) >= 1.0e+9

            ? Math.abs(Number(labelValue)) / 1.0e+9 + "B"
            // Six Zeroes for Millions
            : Math.abs(Number(labelValue)) >= 1.0e+6

                ? Math.abs(Number(labelValue)) / 1.0e+6
                // Three Zeroes for Thousands
                : Math.abs(Number(labelValue)) >= 1.0e+3

                    ? Math.abs(Number(labelValue)) / 1.0e+3 + "K"

                    : Math.abs(Number(labelValue));


    }

    toThouthend(labelValue){
        return Math.abs(Number(labelValue)) >= 1.0e+9

            ? Math.abs(Number(labelValue)) / 1.0e+9 + "B"
            // Six Zeroes for Millions
            : Math.abs(Number(labelValue)) >= 1.0e+6

                ? Math.abs(Number(labelValue)) / 1.0e+6
                // Three Zeroes for Thousands
                : Math.abs(Number(labelValue)) >= 1.0e+3

                    ? Math.abs(Number(labelValue)) / 1.0e+3

                    : Math.abs(Number(labelValue));
    }

    fetchDataCoinCap(activeID){
        const self = this;
        fetch(`https://api.coinmarketcap.com/v2/ticker/${activeID}/`)
            .then(function(response) {
                return response.json();
            }).then(function(json) {
                const marketKapUSD = json.data.quotes.USD;
                let marketNumber = get(marketKapUSD, 'market_cap', 'not');
                marketNumber = self.toMillion(marketNumber);
                // console.log("marketNumber", marketNumber.toFixed(1) + "M");

               self.setState({market_cap:  marketNumber.toFixed(1) + "M" , loading: false});
        }).catch(function(ex) {
            console.log('parsing failed', ex)
        })
    }

    componentWillReceiveProps(nextProps) {
        const code = get(nextProps.orderbook, 'base.asset_code', null) || 'not';
        const issuer = get(nextProps.orderbook, 'base.asset_issuer', null) || 'not';
        const tickerData = this.props.tickerData;

        if(this.props.tradeHightLow != null){
            const traidingRecords = this.props.tradeHightLow.records.slice(0, 10);

            var resultHigh = traidingRecords.map(a => Number(a.high));
            var resultLow = traidingRecords.map(a => Number(a.low));

            const max = Math.max(...resultHigh);
            const min = Math.min(...resultLow);
            this.setState({low: min.toFixed(1), high: max.toFixed(1)})
        }


        function getValues(array, buyingCode) {
            return array
                .filter(function(values, item){
                    return (values.code === buyingCode)
                })
                .map(function (item) {
                    return item;
                });
        }
        if(tickerData != null){
            let tickerArray = getValues(tickerData, this.base.code);
            const tickerObject = Object.assign({}, ...tickerArray);
            let volume24h_USD = tickerObject.volume24h_USD;
            let price_USD = tickerObject.price_USD;
            let price_XLM = tickerObject.price_XLM;
            volume24h_USD = this.toThouthend(volume24h_USD);
            this.setState({volume24h_USD: volume24h_USD.toFixed(1) + "K", price_USD: Number(price_USD).toFixed(1),
                                                                              price_XLM: Number(price_XLM).toFixed(1)});
        }
        if (!isEqual(code, this.base.code) && !isEqual(issuer, this.base.issuer)) {
            this.fetchDataListing();
            this.base.code = code;
            this.base.issuer = issuer;
        }

    }


    render() {

        let marketTable;
        if(this.state.loading){
            marketTable = <Loading loading={this.state.loading}/>
        }else{
            marketTable = <table className="MarketTable-style" style={{width: "100%"}}>
                <tbody>
                <tr>
                    <td>Last price: {`${this.state.price_XLM} XLM`}</td>
                    <td>24 high: {`${this.state.high} XLM`}</td>
                    <td>24 volume: {`${this.state.volume24h_USD} USD`}</td>
                </tr>
                <tr>
                    <td>Last price: {`${this.state.price_USD} USD`}</td>
                    <td>24 low: {`${this.state.low} XLM`}</td>
                    <td>Market cap: {`${this.state.market_cap} USD`}</td>
                </tr>
                </tbody>
            </table>
        }
        return <div className="MarketTable-wrap">
            {marketTable}
         </div>;

    }
}


