const React = window.React = require('react');
import OfferTable from './OfferTable.jsx';
import BigNumber from 'bignumber.js';
import {get, map, sortBy, isEqual} from 'lodash';
import { ClipLoader } from 'react-spinners';

export default class OfferTables extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
          loading: true
      };
      this.base = {
          code: get(this.props.orderbook, 'base.asset_code', 'not'),
          issuer: get(this.props.orderbook, 'base.asset_issuer', 'not')
      };

  }
    componentDidMount() {
        // if(this.base.code != "not"){
        //     setTimeout(() => this.setState({ loading: false }), 1000);
        // }

    }

    componentWillReceiveProps() {
      // console.log("this.props.orderbookIsChanged", this.props.orderbookIsChanged);
        if (this.props.orderbookIsChanged){
            const sellBuy = false;
            this.props.setSellBuy({sellBuy});

            this.setState({loading: true});
        }else{
            const sellBuy = true;
            this.props.setSellBuy({sellBuy});
            this.setState({ loading: false })
        }
    }

  render() {


      const data = get(this.props, 'orderbook');
      const asks = get(this.props.orderbook, 'asks');
      const bids = get(this.props.orderbook, 'bids');



      //TODO SELL/BUY add data to table from orderbook props - Chapter 2
      let counterLabelDefault = "XLM";
      let baseLabelDefault = "SLT";
      let baseLabel = get(data, 'base.asset_code', null);
      let counterLabel = get(data, 'counter.asset_type', null);

      if (!baseLabel){
          baseLabel = baseLabelDefault;
      }
      if (counterLabel === 'native' || counterLabel === undefined || counterLabel === null){
          counterLabel = counterLabelDefault;
      }

    //TODO wrong value for depth!
    let buyDepth = 0;
    let cappedBuyDepth = 0;
    let buyBestPrice;
    let buys = map(bids, (bid) => {
      if (!buyBestPrice) {
        buyBestPrice = Number(bid.price);
      }
      if (buyBestPrice/Number(bid.price) < 2) { //old value for "<2" is 1.2
        cappedBuyDepth += Number(bid.amount);
      }
      buyDepth += Number(bid.amount);

      return {
        key: `${bid.price}-${bid.amount}`,
        price: Number(bid.price).toFixed(7),
        base: Number(bid.amount/bid.price).toFixed(2),
        counter: Number(bid.amount).toFixed(2),
        depth: buyDepth.toFixed(4),
      }
    });
    // }).splice(-1, 5);

    let sellDepth = 0;
    let cappedSellDepth = 0;
    let sellBestPrice;
    let sells = map(asks, (ask) => {
      if (!sellBestPrice) {
        sellBestPrice = Number(ask.price);
      }
      if (Number(ask.price)/sellBestPrice < 2) { //old value for "<2" is 1.2
        cappedSellDepth += Number(ask.amount) * Number(ask.price);
      }
      sellDepth += Number(ask.amount) * Number(ask.price);

      return {
        key: `${ask.price}-${ask.amount}`,
        price: Number(ask.price).toFixed(7),
        base: Number(ask.amount).toFixed(2),
        counter: (Number(ask.amount) * Number(ask.price)).toFixed(2),
        depth: sellDepth.toFixed(4),
      }
    });

    let maxDepth = BigNumber.max(cappedBuyDepth.toFixed(7), cappedSellDepth.toFixed(7));

    let offerTable = null;
    if(window.innerWidth < 640){
        buys = buys.slice(0, 10);
        sells = sells.slice(0, 10);
    }
    if(this.state.loading ){
        offerTable = <div className='sweet-loading'>
            <ClipLoader
                color={'#000000'}
                loading={this.state.loading}
            />
        </div>
    }else{
        // const sellBuy = true;
        // this.props.setSellBuy({sellBuy})
        offerTable = <div className="OfferTables island__sub">
            <div className="island__sub__division">
                <h3 className="island__sub__division__title">Buy offers</h3>
                {OfferTable({
                    side: 'buy',
                    offers: buys,
                    counterCurrency: counterLabel,
                    baseCurrency: baseLabel,
                    maxDepth,
                    d: this.props,
                })}
            </div>
            <div className="island__sub__division">
                <h3 className="island__sub__division__title">Sell offers</h3>
                {OfferTable({
                    side: 'sell',
                    offers: sells,
                    counterCurrency: counterLabel,
                    baseCurrency: baseLabel,
                    maxDepth,
                    d: this.props,
                })}
            </div>
        </div>
    }

      return <div>{offerTable}</div>
  }
};

