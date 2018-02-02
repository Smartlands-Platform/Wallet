import React from 'react';
import { Container } from 'semantic-ui-react';

import Slider from 'react-slick';

import BalancesContainer from '../../../elements/StellarContainers/Balances';
import Payment from '../../../elements/StellarContainers/Payment';
import PaymentsViewer from '../../../elements/StellarContainers/PaymentsViewer';
import OffersViewer from '../../../elements/StellarContainers/OffersViewer';
import '../../../../styles/panel_tabs.scss';

class TabsPanel extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      tabIndex: 0,
      code: '',
      settings: {
        arrows: false,
        dots: false,
        infinite: true,
        speed: 600,
        slidesToScroll: 1,
        touchMove: false,
        swipe: false,
        slidesToShow: 7,
      }
    };
  }

  componentDidMount() {
    this.checkPageSize();
    this.windowWidth = window.innerWidth;
    window.addEventListener('resize', ::this.checkPageSize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', ::this.checkPageSize);
  }

  setSlideSettings(slidesToShow) {
    this.setState({
      ...this.state,
      settings: {
        ...this.state.settings,
        slidesToShow,
        arrows: slidesToShow !== 7,
      }
    });
  }

  checkPageSize() {
    let tabsLength = 7;
    if (window.innerWidth < 1026 && window.innerWidth > 767) tabsLength = 4;
    if (window.innerWidth < 768 && window.innerWidth > 600) tabsLength = 3;
    if (window.innerWidth < 601) tabsLength = 2;

    this.setSlideSettings(tabsLength);
  }

  onSelect(tabIndex, code) {
    this.setState({ tabIndex, code });
  }

  get slider() {
    const tabs = ['Wallet', 'Payments', 'Exchange', 'Active offers', 'Payment history', 'Token issue', 'Create account'];
    const slides = tabs.map((tab, index) =>
      <div key={index}
           className={this.state.tabIndex === index ? 'active' : ''}
           onClick={this.onSelect.bind(this, index, 'code')}>{tab}</div>
    );

    return <Slider className="tabs-list" {...this.state.settings}>{slides}</Slider>;
  }

  headerPanel(title) {
    return <h2 className="panel-title">{title}</h2>
  }

  get tabPanel() {
    let tabPanel;
    switch(this.state.tabIndex) {
      case 1:
        tabPanel = <div className="tab-panel">
          {this.headerPanel('Payments')}
          <Payment curCode={this.state.code} selectedIndex={this.state.tabIndex} />
        </div>;
        break;
      case 2:
        tabPanel = <div className="tab-panel">
          {this.headerPanel('Exchange')}
          <OffersViewer canCreate={true} />
        </div>;
        break;
      case 3:
        tabPanel = <div className="tab-panel">
          {this.headerPanel('Active offers')}
          <OffersViewer />
        </div>;
        break;
      case 4:
        tabPanel = <div className="tab-panel">
          {this.headerPanel('Payment history')}
          <PaymentsViewer />
        </div>;
        break;
      case 5:
        tabPanel = <div className="tab-panel">
          {this.headerPanel('Token issue')}
          <Payment selectedIndex={this.state.tabIndex} curTab={::this.onSelect}/>
        </div>;
        break;
      case 6:
        tabPanel = <div className="tab-panel">
          {this.headerPanel('Create account')}
          <Payment selectedIndex={this.state.tabIndex} />
        </div>;
        break;
      default:
        tabPanel = <div className="tab-panel">
          {this.headerPanel('Wallet balances and trustlines')}
          <BalancesContainer curTab={::this.onSelect} />
        </div>;
    }

    return tabPanel;
  }

  render() {
    return (
      <Container>
        <div className='panel-tabs'>
          {this.slider}
          {this.tabPanel}
        </div>
      </Container>
    );
  }
}

export default TabsPanel;
