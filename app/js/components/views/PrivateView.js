import React from 'react';
import {Container, Grid, Divider} from 'semantic-ui-react';

import CurrentAccount from '../../elements/StellarContainers/CurrentAccount';
import TopBar from '../../elements/UiTools/TopBar';
import BottomBar from '../../elements/UiTools/BottomBar';
import BalancesContainer from '../../elements/StellarContainers/Balances';
import Payment from '../../elements/StellarContainers/Payment';
import PaymentsViewer from '../../elements/StellarContainers/PaymentsViewer';
import OffersViewer from '../../elements/StellarContainers/OffersViewer';
import OrderBook from '../../elements/StellarContainers/OrderBook';
// import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import TabsPanel from '../../elements/UiTools/TabsPanel';
import SliderRessponsive from '../../elements/UiTools/SliderTabsPanel';
// import '../../../styles/panel_tabs.scss';

const PrivateView = () => (
    <div className="pages-container">
        <TopBar/>
        <CurrentAccount/>

        <TabsPanel/>
        <BottomBar/>

        {/*<Container>*/}
        {/*<Tabs className='panel-tabs'>*/}
        {/*<TabList>*/}
        {/*<Tab>Wallet</Tab>*/}
        {/*<Tab>Payments</Tab>*/}
        {/*<Tab>Exchange</Tab>*/}
        {/*<Tab>Active offers</Tab>*/}
        {/*<Tab>Payment history</Tab>*/}
        {/*<Tab>Token issue</Tab>*/}
        {/*<Tab>Create account</Tab>*/}
        {/*</TabList>*/}

        {/*<TabPanel>*/}
        {/*<h2 className="panel-title">Wallet balances and trustlines</h2>*/}
        {/*<BalancesContainer />*/}
        {/*</TabPanel>*/}
        {/*<TabPanel>*/}
        {/*<h2 className="panel-title">Payments</h2>*/}
        {/*<Payment />*/}
        {/*</TabPanel>*/}
        {/*<TabPanel>*/}
        {/*<h2 className="panel-title">Exchange</h2>*/}
        {/*<OffersViewer />*/}
        {/*</TabPanel>*/}
        {/*</Tabs>*/}
        {/*</Container>*/}

        {/*<Divider />*/}
        {/*<Grid columns={2} divided doubling>*/}
        {/*<Grid.Row>*/}
        {/*<Grid.Column>*/}
        {/*<BalancesContainer />*/}
        {/*</Grid.Column>*/}
        {/*<Grid.Column>*/}
        {/*<OffersViewer />*/}
        {/*</Grid.Column>*/}
        {/*</Grid.Row>*/}
        {/*<Divider />*/}
        {/*<Grid.Row>*/}
        {/*<Grid.Column>*/}
        {/*<Payment />*/}
        {/*</Grid.Column>*/}
        {/*<Grid.Column>*/}
        {/*<OrderBook />*/}
        {/*</Grid.Column>*/}
        {/*</Grid.Row>*/}
        {/*</Grid>*/}
        {/*<Divider />*/}
        {/*<Container>*/}
        {/*<PaymentsViewer />*/}
        {/*</Container>*/}
    </div>
);

export default PrivateView;
