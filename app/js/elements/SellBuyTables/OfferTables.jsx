const React = window.React = require('react');
import OfferTable from './OfferTable.jsx';
import BigNumber from 'bignumber.js';
// import {get, map} from 'lodash';
import {get, map, sortBy, isEqual} from 'lodash';
import { ClipLoader } from 'react-spinners';

export default class OfferTables extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
          loading: true
      };
      this.base = {
          code: get(this.props.d.orderbook, 'base.asset_code', 'not'),
          issuer: get(this.props.d.orderbook, 'base.asset_issuer', 'not')
      };

  }
    componentDidMount() {
        if(this.base.code != "not"){
            setTimeout(() => this.setState({ loading: false }), 2500);
        }
    }

    componentWillReceiveProps(nextProps) {
        const code = get(nextProps.d.orderbook, 'base.asset_code', 'not');
        const issuer = get(nextProps.d.orderbook, 'base.asset_issuer', 'not');
        // console.log("nextProps", nextProps);
        if (this.props.change){
            this.setState({loading: true});
        }
        // console.log("this.base.code", code);
        if (!isEqual(code, this.base.code) && !isEqual(issuer, this.base.issuer)) {
            // console.log("data", nextProps.d.orderbook);
            this.setState({loading: true});
            setTimeout(() => this.setState({ loading: false }), 2000);
            this.base.code = code;
            this.base.issuer = issuer;
        }
    }

  render() {
      const data = get(this.props.d, 'orderbook');
      const asks = get(this.props.d.orderbook, 'asks');
      const bids = get(this.props.d.orderbook, 'bids');

      //TODO SELL/BUY add data to table from orderbook props - Chapter 2
      let counterLabelDefault = "XLM";
      let baseLabelDefault = "SLT";
      let baseLabel = get(data, 'base.asset_code', null);
      let counterLabel = get(data, 'counter.asset_type', null);
      // if (baseLabel === null){
          // this.setState({loading: true});
      // }else if(baseLabel != null){
          // setTimeout(() => this.setState({ loading: false }), 2000);
      // }

      // console.log("baseLabel", baseLabel);
      // console.log("counterLabel", counterLabel);

      if (!baseLabel){
          baseLabel = baseLabelDefault;
          // this.setState({loading: true});
      }
      if (counterLabel === 'native' || counterLabel === undefined || counterLabel === null){
          counterLabel = counterLabelDefault;
      }


      // console.log("counterLabel", counterLabel);

    //TODO wrong value for depth!
    let buyDepth = 0;
    let cappedBuyDepth = 0;
    let buyBestPrice;
    let buys = map(bids, (bid) => {
      // Only add to the depth if the offer is within 20% of the best offer (closest to the spread)
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

      // console.log("ask.amount", Number(ask.amount).toFixed(5));

      return {
        key: `${ask.price}-${ask.amount}`,
        price: Number(ask.price).toFixed(7),
        base: Number(ask.amount).toFixed(2),
        counter: (Number(ask.amount) * Number(ask.price)).toFixed(2),
        depth: sellDepth.toFixed(4),
      }
    });

    let maxDepth = BigNumber.max(cappedBuyDepth.toFixed(7), cappedSellDepth.toFixed(7));

    return (
        this.state.loading ? <div className='sweet-loading'>
                <ClipLoader
                    color={'#000000'}
                    loading={this.state.loading}
                />
            </div> :
            <div className="OfferTables island__sub">
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

    );
  }
};

