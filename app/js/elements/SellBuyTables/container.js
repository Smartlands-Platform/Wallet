import { connect } from 'react-redux';
import Component from './component';

import {getOrderbook, getPrice, getOrderbookIsChanged, getSellingBuying} from '../../selectors/stellarData';
import {setPrice, setSellBuy} from '../../actions-creators/stellar';

const mapStateToProps = state => ({
    priceData: getPrice(state),
    orderbook: getOrderbook(state),
    orderbookIsChanged: getOrderbookIsChanged(state),
    sellBuyData: getSellingBuying(state),
});

const mapDispatchToProps = { setPrice, setSellBuy };

export default connect(mapStateToProps, mapDispatchToProps)(Component);

