import { connect } from 'react-redux';
import Component from './component';

import { getOrderbook, getOrderbookIsChanged, getSellBuyIsChanged, getSellingBuying, getAmChartData} from '../../selectors/stellarData';
import { setAmcharData} from '../../actions-creators/stellar';

const mapStateToProps = state => ({
  orderbook: getOrderbook(state),
  orderbookIsChanged: getOrderbookIsChanged(state),
  sellBuyIsChanged: getSellBuyIsChanged(state),
  sellBuyData: getSellingBuying(state),
    amChartData: getAmChartData(state)

});



const mapDispatchToProps = { setAmcharData };

export default connect(mapStateToProps, mapDispatchToProps)(Component);
