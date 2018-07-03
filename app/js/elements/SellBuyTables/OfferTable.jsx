const React = window.React = require('react');
const _ = require('lodash');
import Printify from './lib/Printify';
import Format from './lib/Format';
import PropTypes from 'prop-types';

const oddBackground = '#f7f7f7';
const buyBackground = '#E2F9ED';
const sellBackground = '#FEE5E7';
const buyHover = '#3cb46d';
const sellHover ='#d43d3d';

// Dumb component that mainly renders the UI
export default function OfferTable(props) {
  let depthNumDecimals = 7;
  let priceNumDecimals = 7;
  if (props.offers.length > 0) {
    depthNumDecimals = Math.max(0, Format.niceNumDecimals(props.offers[props.offers.length - 1].depth));
    if (props.side === 'buy') {
      priceNumDecimals = Math.max(4, Format.niceNumDecimals(props.offers[props.offers.length - 1].price))
    } else {
      priceNumDecimals = Math.max(4, Format.niceNumDecimals(props.offers[0].price))
    }
  }

  let header;
  if (props.side === 'buy') {
    header = <div className="OfferTable__header">
      { window.innerWidth > 640 ? <div className="OfferTable__header__item OfferTable__cell--depth">Sum {props.counterCurrency}</div>: null}
      { window.innerWidth > 640 ? <div className="OfferTable__header__item OfferTable__cell--amount">{props.counterCurrency}</div>: null}
      <div className="OfferTable__header__item OfferTable__cell--amount">{props.baseCurrency}</div>
      <div className="OfferTable__header__item OfferTable__cell--price">Price</div>
    </div>
  } else {
    header = <div className="OfferTable__header">
      <div className="OfferTable__header__item OfferTable__cell--price">Price</div>
      <div className="OfferTable__header__item OfferTable__cell--amount">{props.baseCurrency}</div>
        { window.innerWidth > 640 ? <div className="OfferTable__header__item OfferTable__cell--amount">{props.counterCurrency}</div>: null}
        { window.innerWidth > 640 ? <div className="OfferTable__header__item OfferTable__cell--depth">Sum {props.counterCurrency}</div>: null}
    </div>
  }
  return <div className="OfferTable">
    {header}
    <div className="OfferTable__table">
      {
        _.map(props.offers, (offer, index, indexCount) => {

          let altColor = '#fff' ; // #f4f4f5 is $s-color-neutral8
          let depthPercentage = Math.min(100, Number(offer.depth / props.maxDepth * 100 ).toFixed(1));
          // console.log(props.maxDepth + '+' + depthPercentage)
          let rowStyle = {};
          if (props.side === 'buy') {
            // if (window.innerWidth < 767){
            //   rowStyle.background = `linear-gradient(to right, ${buyBackground} ${depthPercentage}%, ${altColor} ${depthPercentage}%)`;
            // }else {
              rowStyle.background = `linear-gradient(to left, ${buyBackground} ${depthPercentage}%, ${altColor} ${depthPercentage}%)`;
            // }
          } else {
            rowStyle.background = `linear-gradient(to right, ${sellBackground} ${depthPercentage}%, ${altColor} ${depthPercentage}%)`;
          }

            // Number(offer.price).toPrecision(8);
            let priceData = Number(offer.price).toPrecision(8);

            // console.log("offer.price", priceData);
            // console.log("offer.price", typeof priceData);
            var priceFirstData = priceData.split(".").pop();
            var priceLastData = priceData.substring(0, priceData.indexOf('.'));

            var priceZero = Printify.lightenZeros(Number(offer.price).toPrecision(8), 8 - priceData.indexOf('.'));


            const offerDepth = Number(offer.depth).toLocaleString('en-US', {minimumFractionDigits: depthNumDecimals, maximumFractionDigits: depthNumDecimals});
            var depthLastData = offerDepth.split(",")[1];
            var depthFirstData = <strong>{offerDepth.split(',')[0]}</strong>;
            var spread;
            if(depthLastData != undefined){
              spread = ",";
            }

          let cellPrice = <div key={'price'} className="OfferTable__row__item OfferTable__cell--price">{priceZero}</div>;
          let cellBase = <div key={'base'} className="OfferTable__row__item OfferTable__cell--amount">{Printify.lightenZeros(offer.base)}</div>;
          let cellCounter = <div key={'counter'} className="OfferTable__row__item OfferTable__cell--amount">{Printify.lightenZeros(String(offer.counter))}</div>;
          let cellDepth = <div key={'depth'} className="OfferTable__row__item OfferTable__cell--depth">{depthFirstData}{spread}{depthLastData}</div>;


            let prData = offer.price;

          if (props.side === 'buy') {
            return <div
              className="OfferTable__row"
              key={offer.key}
              style={rowStyle}
              onClick={() => props.d.setPrice({prData})}>
              {window.innerWidth > 640 ? cellDepth: null}
              {window.innerWidth > 640 ? cellCounter: null}
              {cellBase}
              {cellPrice}
            </div>
          } else {
            return <div
              className="OfferTable__row-sell"
              key={offer.key}
              style={rowStyle}
              onClick={() => props.d.setPrice({prData})}>
              {cellPrice}
              {cellBase}
              {window.innerWidth > 640 ? cellCounter: null}
              {window.innerWidth > 640 ? cellDepth: null}
            </div>
          }
        })
      }
    </div>
  </div>
}
OfferTable.propTypes = {
  offers: PropTypes.arrayOf(PropTypes.object).isRequired,
  side: PropTypes.oneOf(['buy', 'sell']).isRequired,
};
