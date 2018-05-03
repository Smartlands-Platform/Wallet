import React, {PropTypes} from 'react';

import CurrentAccount from '../../../elements/StellarContainers/CurrentAccount';
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
        };
    }

    componentDidMount() {
        this.windowWidth = window.innerWidth;
    }

    onSelect(tabIndex, code) {
        this.props.closeNavigation();
        this.setState({ tabIndex, code });
    }

    //TODO Active offers comments, changed order tabs

    get navigation() {
        const tabs = ['Wallet', 'Payments', 'Exchange', /*'Active offers',*/ /*'Payment history',*/ 'Token issue', 'Create account'];
        const slides = tabs.map((tab, index) =>
            <li key={index}
                className={this.state.tabIndex === index ? 'active' : ''}
                onClick={this.onSelect.bind(this, index, 'code')}>{tab}</li>
        );

        return <ul className="tabs-list">
            {slides}
        </ul>;
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
                    <OffersViewer canCreate={true} />
                </div>;
                break;
            /*case 3:
                tabPanel = <div className="tab-panel">
                    {this.headerPanel('Active offers')}
                    <OffersViewer />
                </div>;
                break;*/
           /* case 3:
                tabPanel = <div className="tab-panel">
                    {this.headerPanel('Payment history')}
                    <PaymentsViewer />
                </div>;
                break;*/
            case 3:
                tabPanel = <div className="tab-panel">
                    {this.headerPanel('Token issue')}
                    <Payment selectedIndex={this.state.tabIndex} curTab={::this.onSelect}/>
                </div>;
                break;
            case 4:
                tabPanel = <div className="tab-panel">
                    {this.headerPanel('Create account')}
                    <Payment selectedIndex={this.state.tabIndex} />
                </div>;
                break;
            default:
                tabPanel = <div className="tab-panel">
                    {this.headerPanel('Wallet balances and trustlines')}
                    <CurrentAccount/>
                    <BalancesContainer curTab={::this.onSelect} />
                </div>;
        }

        return tabPanel;
    }

    render() {
        const { toggle } = this.props;
        return (
            <div className="panel-tabs">
                {window.innerWidth < 768 ?  toggle && this.navigation :  this.navigation }
                {window.innerWidth < 768 ? !toggle && this.tabPanel : this.tabPanel}
            </div>
        );
    }
}

TabsPanel.propTypes = {
  toggle: React.PropTypes.bool,
  closeNavigation: PropTypes.func.isRequired,
};

export default TabsPanel;
