import React, { PropTypes } from 'react';
import { Form, Header, Table, Grid, Dropdown, Icon, Modal, Button } from 'semantic-ui-react';
import Amount from '../../../components/stellar/Amount';
import { STROOP, pageWidth, getHeaderCells } from '../../../helpers/StellarTools';
import MyStockChart from '../../../elements/Charts';
import DepthChart from '../../../elements/DepthChart';
import OrderBook from '../../../elements/StellarContainers/OrderBook';
import RecentTable from '../../../elements/RecentTable';
import {get, map, sortBy, isEqual} from 'lodash';
import '../../../../styles/buy_sell_tabs.scss';
import BigNumber from 'bignumber.js';
import OfferTables from '../../SellBuyTables';
import {Loading} from "../../../helpers/Loading/Loading";
import {DEFAULT_KEY} from '../../../helpers/defaultData';

import MarketTable from '../../MarketTable';


const priceStyle ={
    position: 'relative',
    paddingLeft: '.5em',
    paddingRight: '.5em',
};


class Offers extends React.Component {
    constructor(props) {
        super(props);
        this.base = {
            code: get(this.props.orderbook, 'base.asset_code', 'not'),
            issuer: get(this.props.orderbook, 'base.asset_issuer', 'not')
        };
        this.baseData = {
            defaultPriceBuy: null,
            defaultPriceSell: null,
        };
        this.state = {
            selectedCell: this.headerTitles.PRICE,
            buyingData: null,
            sellData: null,
            loading: true,
            tabIndex: 0,
            windowWidth: window.innerWidth,

            priceBuy: '',
            amountBuy: '',
            totalBuy: '',
            // defaultPriceBuy: null,

            priceSell: '',
            amountSell: '',
            totalSell: '',
            // defaultPriceSell: '',

        };

    }

    componentDidMount() {

        if(this.base.code != "not"){
            setTimeout(() => this.setState({ loading: false }), 1000);
        }
        this.checkPageSize();
        window.addEventListener('resize', ::this.checkPageSize, false);
        this.buySellButton();
        this.sellBuyButton();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', ::this.checkPageSize, false);
    }

    componentWillReceiveProps(nextProps) {
        const code = get(nextProps.orderbook, 'base.asset_code', null) || 'not';
        const issuer = get(nextProps.orderbook, 'base.asset_issuer', null) || 'not';
        const bids = get(nextProps.orderbook, 'bids');
        const asks = get(nextProps.orderbook, 'asks');

        if (this.props.orderbookIsChanged) {
            this.setState({loading: true});
        } else {
            this.setState({loading: false});
        }

        if(!isEqual(nextProps.priceData, this.props.priceData)){
            this.setState({priceBuy: nextProps.priceData, priceSell: nextProps.priceData});
            this.updateState('price_buy', nextProps.priceData);
            this.updateState('price_sell', nextProps.priceData);
        }

        if (!isEqual(code, this.base.code) && !isEqual(issuer, this.base.issuer)) {
            if (bids != undefined && bids.length > 0){
                this.setState({priceBuy: bids[0].price});
            }
            if (asks != undefined && asks.length > 0){
                this.setState({priceSell: asks[0].price});
            }

            this.setState({loading: true});
            setTimeout(() => this.setState({ loading: false }), 1000);
            this.base.code = code;
            this.base.issuer = issuer;
        }
    }

    checkPageSize() {
        this.onSelect(Number(this.isMobileView));
        this.setState({windowWidth: window.innerWidth});
    }

    get headerTitles() {
        return {
            CANCEL: "CANCEL",
            PRICE: 'Price',
            AMOUNT: 'Amount',
        };
    }

    rounded(number){
        let numberToString = String(number).slice(0, -4);
        return +Number(numberToString).toFixed(1);
    };

    createOfferBuy(e, { formData }) {
        e.preventDefault();
        let buyingData = this.props.orderbook.base.asset_code;
        let trustLines = this.props.trustlines;
        // console.log("buyingData", buyingData);
        let index = trustLines.findIndex(x => x.code === buyingData);
        let formSell = this.props.trustlines.length - 1;
        const selling = this.props.trustlines[formSell];
        const buying = this.props.trustlines[index];
        const offerData = {
            buying,
            selling,
            // date: Date.now(),
            amount: Number(formData.total).toFixed(7),
            price: Number(1/formData.price),
            // price: new BigNumber(1).dividedBy(new BigNumber(formData.price)).toFixed(7),
            total: Number(formData.amount).toFixed(7),
            passive: false,
        };

        this.props.createOffer(offerData);
    }

    createOfferSell(e, { formData }) {
        e.preventDefault();
        let sellAsset = this.props.orderbook.base.asset_code;
        // console.log("sellAsset", sellAsset);
        let trustLines = this.props.trustlines;
        let index = trustLines.findIndex(x => x.code === sellAsset);
        // console.log("sellAsset", index);
        let formBuy = this.props.trustlines.length - 1;
        const selling = this.props.trustlines[index];
        // const buying = this.props.trustlines[formData.buy_asset];
        const buying = this.props.trustlines[formBuy];

        const offerData = {
            selling,
            buying,
            // date: Date.now(),
            amount: Number(formData.amount).toFixed(7),
            price: Number(formData.price).toFixed(7),
            total: Number(formData.total).toFixed(7),
            passive: false,
        };

        this.props.createOffer(offerData);
    }

    handleLoader () {
        this.setState({loading: true});
        setTimeout(() => {
            this.setState({loading: false})
        }, 6500)
    }

    deleteOffer(offer) {
        return (e) => {
            if (e){
                this.handleLoader();
            }
            e.preventDefault();
            this.props.deleteOffer(offer);
        };
    }

    buySellButton(){
        var buttonName = '';
        if (this.props.orderbook === null){
            buttonName = 'Buy SLT';


        }else if(this.props.orderbook.base.asset_code){
            buttonName = `Buy ${this.props.orderbook.base.asset_code}`;

        }
        return buttonName;
    }
    sellBuyButton(){
        var  buttonName = '';
        if (this.props.orderbook === null){
            buttonName = 'Sell SLT';

        }else if(this.props.orderbook.base.asset_code){
            buttonName = `Sell ${this.props.orderbook.base.asset_code}`;
        }
        return buttonName;
    }



    getBuyOfferRow(offer, index) {
        return (
            <Table.Row key={index}>
                <Table.Cell>
                    {this.props.canSign ?
                        <button
                            className="btn-icon remove"
                            data-hover="Remove"
                            onClick={::this.deleteOffer(offer)}
                        />
                        : null}
                </Table.Cell>
                { this.state.selectedCell === this.headerTitles.AMOUNT || pageWidth() ? <Table.Cell>
                    <Amount amount={Number(offer.amount*offer.price).toFixed(4)} />
                </Table.Cell> : null }
                { this.state.selectedCell === this.headerTitles.PRICE || pageWidth() ? <Table.Cell>
                    <Amount amount={new BigNumber(offer.price_r.d).dividedBy(offer.price_r.n).toFixed(7)} />
                </Table.Cell> : null }
            </Table.Row>
        );
    }
    getSellOfferRow(offer, index) {
        return (
            <Table.Row key={index}>
                { this.state.selectedCell === this.headerTitles.PRICE || pageWidth() ? <Table.Cell>
                    <Amount amount={offer.price} />
                </Table.Cell> : null }
                { this.state.selectedCell === this.headerTitles.AMOUNT || pageWidth() ? <Table.Cell>
                    <Amount amount={offer.amount} />
                </Table.Cell> : null }
                <Table.Cell>
                    {this.props.canSign ?
                        <button
                            className="btn-icon remove"
                            data-hover="Remove"
                            onClick={::this.deleteOffer(offer)}
                        />
                        : null}
                </Table.Cell>
            </Table.Row>
        );
    }


    updateState(item, value){
        // console.log("item");
        let state = Object.assign(this.state, {
            // Reset messages
            successMessage: '',
            errorMessage: false,
        });
        state.valid = false;

        switch (item) {
            case 'price_buy':
                state.priceBuy = value;
                break;
            case 'amount_buy':
                state.amountBuy = value;
                break;
            case 'total_buy':
                state.totalBuy = value;
                break;
            case 'price_sell':
                state.priceSell = value;
                break;
            case 'amount_sell':
                state.amountSell = value;
                break;
            case 'total_sell':
                state.totalSell = value;
                break;
            default:
                throw new Error('Invalid item type');
        }

        try {

            switch (item) {
                case 'price_buy':
                    state.totalBuy = new BigNumber(new BigNumber(value).times(new BigNumber(state.amountBuy)).toFixed(7)).toString();
                    break;
                case 'amount_buy':
                    state.totalBuy = new BigNumber(new BigNumber(value).times(new BigNumber(state.priceBuy)).toFixed(7)).toString();
                    break;
                case 'total_buy':
                    state.amountBuy = new BigNumber(new BigNumber(value).dividedBy(new BigNumber(state.priceBuy)).toFixed(7)).toString();
                    break;
                case 'price_sell':
                    state.totalSell = new BigNumber(new BigNumber(value).times(new BigNumber(state.amountSell)).toFixed(7)).toString();
                    break;
                case 'amount_sell':
                    state.totalSell = new BigNumber(new BigNumber(value).times(new BigNumber(state.priceSell)).toFixed(7)).toString();
                    break;
                case 'total_sell':
                    state.amountSell = new BigNumber(new BigNumber(value).dividedBy(new BigNumber(state.priceSell)).toFixed(7)).toString();
                    break;
                default:
                    throw new Error('Invalid item type');
            }

            // TODO: truer valid
            state.valid = true;
        } catch(e) {
            // Invalid input somewhere
        }
        this.setState(state);
    };

    getBuyOfferTable() {

        let OffersArray = this.props.offers;

        // console.log("OffersArray", OffersArray);
        var buyingCode = "SLT";
        if (this.props.orderbook != null){
            var buyingCode = this.props.orderbook.base.asset_code;
        }

        function getValues(array, buyingCode) {
            return array
                .filter(function(values, item){
                    return (values.buying.asset_code != undefined && values.buying.asset_code === buyingCode);
                })
                .map(function (item) {
                    return item;
                });
        }
        let buyOffers = getValues(OffersArray, buyingCode);
        let sortOffersBuy = buyOffers.sort((a, b) => parseFloat(a.price) - parseFloat(b.price)).reverse();

        const colSpanDefault = pageWidth() ? '3' : '2';


        const {resetAccount} = this.props;
        let offersRowBuy;

        if(this.props.offers.length){
            offersRowBuy = sortOffersBuy.map(::this.getBuyOfferRow)
        }else if(this.props.keypair.publicKey() === DEFAULT_KEY){
            offersRowBuy = <Table.Row>
                <Table.Cell className="nodata" colSpan={colSpanDefault} textAlign="center">
                    <a href="#" className="loginLink" onClick={resetAccount} style={{width: 100 + "%", display: "block", textAlign: "center", fontSize: 14 + "px"}}>Log in to see your open offers</a>
                </Table.Cell>
            </Table.Row>
        }else{
            offersRowBuy = <Table.Row>
                <Table.Cell className="nodata" colSpan={colSpanDefault} textAlign="center">No offers</Table.Cell>
            </Table.Row>
        }

        return (
            <div className="is-relative">
                <Table className={this.props.canCreate ? 'exchange-table' : ''} singleLine size="small" compact unstackable>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Cancel</Table.HeaderCell>
                            { this.state.selectedCell === this.headerTitles.AMOUNT || pageWidth() ? <Table.HeaderCell>Quantity({`${buyingCode}`})</Table.HeaderCell> : null }
                            { this.state.selectedCell === this.headerTitles.PRICE || pageWidth() ? <Table.HeaderCell>Price(XLM)</Table.HeaderCell> : null }
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {offersRowBuy}
                    </Table.Body>
                </Table>
                {!pageWidth() ? this.mobileTableFilter() : null}
            </div>
        );
    }

    getSellOfferTable() {
        // console.log("this.price", this.props.priceData);
        let OffersArray = this.props.offers;
        let buyingCode = get(this.props.orderbook, 'base.asset_code', 'SLT');
        function getValues(array, buyingCode) {
            return array
                .filter(function(values, item){
                    return (values.selling.asset_code === buyingCode)
                })
                .map(function (item) {
                    return item;
                });
        }

        let sellOffers = getValues(OffersArray, buyingCode);
        let sortOffersSell = sellOffers.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));

        const colSpanDefault = pageWidth() ? '3' : '2';

        const {resetAccount} = this.props;
        let offersRow;

        if(this.props.offers.length){
            offersRow = sortOffersSell.map(::this.getSellOfferRow)
        }else if(this.props.keypair.publicKey() === DEFAULT_KEY){
            offersRow = <Table.Row>
                <Table.Cell className="nodata" colSpan={colSpanDefault} textAlign="center">
                    <a href="#" className="loginLink" onClick={resetAccount} style={{width: 100 + "%", display: "block", textAlign: "center", fontSize: 14 + "px"}}>Log in to see your open offers</a>
                </Table.Cell>
            </Table.Row>
        }else{
            offersRow = <Table.Row>
                <Table.Cell className="nodata" colSpan={colSpanDefault} textAlign="center">No offers</Table.Cell>
            </Table.Row>
        }
        return (
            <div className="is-relative">
                <Table className={this.props.canCreate ? 'exchange-table' : ''} singleLine size="small" compact unstackable>
                    <Table.Header>
                        <Table.Row>
                            { this.state.selectedCell === this.headerTitles.PRICE || pageWidth() ? <Table.HeaderCell>Price(XLM)</Table.HeaderCell> : null }
                            { this.state.selectedCell === this.headerTitles.AMOUNT || pageWidth() ? <Table.HeaderCell>Quantity({buyingCode})</Table.HeaderCell> : null }
                            <Table.HeaderCell>Cancel</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {offersRow}
                    </Table.Body>
                </Table>
                {!pageWidth() ? this.mobileTableFilter() : null}
            </div>
        );
    }


    mobileTableFilter() {
        const changeCell = (e, t) => {
            this.setState({ selectedCell: t.value });
        };

        return (
            <Dropdown
                className="cell-filter"
                options={getHeaderCells(this.headerTitles)}
                selection
                fluid
                placeholder="Select Cell"
                name="selected_cell"
                value={this.state.selectedCell}
                onChange={changeCell}
            />
        );
    }

    getOfferFormBuy(balance) {
        const {resetAccount} = this.props;
        let buySellBTN;
        // console.log("balance", balance);
        if(this.props.canSign && balance.length > 0){
            buySellBTN = <Form.Button
                type="submit"
                primary
                className="create-btn"
                color="green"
                content={this.buySellButton()}
            />;
        }else if(balance.length === 0){
            buySellBTN = <Form.Button
                type="submit"
                primary
                disabled
                className="create-btn"
                color="green"
                content={this.buySellButton()}
            />;
        }
        else {
            buySellBTN = <a href="#" className="loginLink" onClick={resetAccount} style={{width: 100 + "%", display: "block", textAlign: "center", fontSize: 14 + "px"}}>Login</a>
        }
        return (
            <Form onSubmit={::this.createOfferBuy} loading={this.props.sendingOffer}>
                <Form.Group widths="12">
                </Form.Group>
                <Form.Group widths="12">
                    <div className="price-form-wrap" style={priceStyle}>
                        <span className="price-form-price">{`XLM/${this.base.code}`}</span>
                        <Form.Field
                            name="price"
                            label="Price"
                            control="Input"
                            type="number"
                            placeholder="1"
                            step={STROOP}
                            value={this.state.priceBuy}
                            onChange={(e) => this.updateState('price_buy', e.target.value)}
                            required
                        />
                    </div>
                    <div className="price-form-wrap" style={priceStyle}>
                        <span className="price-form-amount">{`${this.base.code}`}</span>
                        <Form.Field
                            name="amount"
                            label="Amount"
                            control="Input"
                            type="number"
                            placeholder="0"
                            step={STROOP}
                            value={this.state.amountBuy}
                            onChange={(e) => this.updateState('amount_buy', e.target.value)}
                            required
                        />
                    </div>
                    <Form.Field
                        name="total"
                        label="Total"
                        control="Input"
                        type="number"
                        placeholder="1"
                        value={this.state.totalBuy}
                        onChange={(e) => this.updateState('total_buy', e.target.value)}
                        step={STROOP}
                    />

                </Form.Group>
                <Form.Group className="control-box">
                    {buySellBTN}
                </Form.Group>
            </Form>
        );
    }
    getOfferFormSell(balance) {
        const {resetAccount} = this.props;
        // console.log("balance", balance);
        let sellBuyBTN;
        if(this.props.canSign && balance != undefined ? balance.length > 0: null){
            sellBuyBTN =<Form.Button
                type="submit"
                primary
                className="create-btn"
                color="green"
                content={this.sellBuyButton()}
            />
        }else if(balance != undefined ? balance.length === 0: null){
            sellBuyBTN =<Form.Button
                type="submit"
                primary
                disabled
                className="create-btn"
                color="green"
                content={this.sellBuyButton()}
            />
        }
        else {
            sellBuyBTN = <a href="#" className="loginLink" onClick={resetAccount} style={{width: 100 + "%", display: "block", textAlign: "center", fontSize: 14 + "px"}}>Login</a>

        }
        return (
            <div className="exchange-form">
                <Form onSubmit={::this.createOfferSell} loading={this.props.sendingOffer}>
                    <Form.Group widths="12">
                    </Form.Group>
                    <Form.Group widths="12">
                        <div className="price-form-wrap" style={priceStyle}>
                            <span className="price-form-price">{`XLM/${this.base.code}`}</span>
                            <Form.Field
                                name="price"
                                label="Price"
                                control="Input"
                                type="number"
                                placeholder="1"
                                step={STROOP}
                                style={priceStyle}
                                value={this.state.priceSell}
                                onChange={(e) => this.updateState('price_sell', e.target.value)}
                                required
                            />
                        </div>
                        <div className="price-form-wrap" style={priceStyle}>
                            <span className="price-form-amount">{`${this.base.code}`}</span>
                            <Form.Field
                                name="amount"
                                label="Amount"
                                control="Input"
                                type="number"
                                placeholder="0"
                                step={STROOP}
                                value={this.state.amountSell}
                                onChange={(e) => this.updateState('amount_sell', e.target.value)}
                                required
                            />
                        </div>
                        <Form.Field
                            name="total"
                            label="Total"
                            control="Input"
                            type="number"
                            placeholder="1"
                            step={STROOP}
                            value={this.state.totalSell}
                            onChange={(e) => this.updateState('total_sell', e.target.value)}
                        />

                    </Form.Group>
                    <Form.Group className="control-box">
                        {sellBuyBTN}
                    </Form.Group>
                </Form>
            </div>
        );
    }
    get showChart() {
        if (this.props.orderbook) {
            let {asset_code: code, asset_issuer: issuer} = this.props.orderbook.base;
            return <MyStockChart code={code} issuer={issuer} />;
        } else {
            let code = null;
            let issuer = null;
            return <MyStockChart code={code} issuer={issuer} />;
        }
    }

    get tabList() {
        const tabs = ['Buy', 'Sell'];
        const slides = tabs.map((tab, index) =>
            <li key={index}
                className={this.state.tabIndex === index + 1 ? 'active' : ''}
                onClick={this.onSelect.bind(this, index + 1)}>{tab}</li>
        );

        return <ul className="tabs-nav">
            {slides}
        </ul>;
    }

    get tabPanel() {
        let tabPanel;
        const balancesData = this.props.balances;
        let buyingCode = get(this.props.orderbook, 'base.asset_code', 'SLT');

        function getValuesSell(array, buyingCode) {
            return array
                .filter(function(values, item){
                    return (values.asset_type === buyingCode)
                })
                .map(function (item) {
                    return item;
                });
        }
        let balanceCodeSell = getValuesSell(balancesData, 'native');

        let balanceCodeFilterSell = balanceCodeSell.sort((a, b) => parseFloat(a.balance) - parseFloat(b.balance));


        function getValuesBuy(array, buyingCode) {
            return array
                .filter(function(values, item){
                    return (values.asset_code === buyingCode)
                })
                .map(function (item) {
                    return item;
                });
        }

        let balanceCodeBuy = getValuesBuy(balancesData, buyingCode);

        var balanceCodeFilterBuy;

        if(balanceCodeBuy.length > 0){
            balanceCodeFilterBuy = balanceCodeBuy.sort((a, b) => parseFloat(a.balance) - parseFloat(b.balance));
        }
        switch(this.state.tabIndex) {
            case 1:
                tabPanel = <div className="buy-form">
                    {this.getOfferFormBuy(balanceCodeBuy)}
                    {this.getBuyOfferTable()}
                </div>;
                break;
            case 2:
                tabPanel = <div className="sell-form">
                    {this.getOfferFormSell(balanceCodeBuy)}
                    {this.getSellOfferTable()}
                </div>;
                break;
            default:
                tabPanel = <div className="buy-form">
                    {this.getOfferFormBuy(balanceCodeBuy)}
                    {this.getBuyOfferTable()}
                </div>;
        }

        return <div className="sel-buy-tabs">
            {tabPanel}
        </div>;
    }

    onSelect(tabIndex) {
        this.setState({ tabIndex });
    }

    get tabView() {
        return <div className="holder">
            {this.isMobileView && this.tabList}
            {this.tabPanel}
        </div>
    }

    get isMobileView() {
        return this.state.windowWidth < 640;
    }

    render() {

        const balancesData = this.props.balances;
        let buyingCode = get(this.props.orderbook, 'base.asset_code', 'SLT');

        function getValuesSell(array, buyingCode) {
            return array
                .filter(function(values, item){
                    return (values.asset_type === buyingCode)
                })
                .map(function (item) {
                    return item;
                });
        }
        let balanceCodeSell = getValuesSell(balancesData, 'native');

        let balanceCodeFilterSell = balanceCodeSell.sort((a, b) => parseFloat(a.balance) - parseFloat(b.balance));


        function getValuesBuy(array, buyingCode) {
            return array
                .filter(function(values, item){
                    return (values.asset_code === buyingCode)
                })
                .map(function (item) {
                    return item;
                });
        }

        let balanceCodeBuy = getValuesBuy(balancesData, buyingCode);

        var balanceCodeFilterBuy;

        if(balanceCodeBuy.length > 0){
            balanceCodeFilterBuy = balanceCodeBuy.sort((a, b) => parseFloat(a.balance) - parseFloat(b.balance));
        }

        // console.log("balanceCodeBuy", balanceCodeBuy);

        if (true) {
            if(window.innerWidth > 640){
                var exchangeBlock = <div>
                    <div className="exchange-block">
                        <Grid columns={1} divided doubling>
                            <Grid.Row>
                                <Grid.Column className="main-column offers-main">
                                    <div className="holder">
                                        <OrderBook />
                                    </div>
                                </Grid.Column>
                                <Grid.Column className="main-column offers-main-form">
                                    <div className="holder row">
                                        {this.state.loading ? <Loading loading={this.state.loading}/> : <div className="buy-form column">
                                            <h3 className="form-title">Buy {`${this.base.code}`} using XLM</h3>
                                            {balanceCodeBuy.length > 0 && this.props.keypair.publicKey() != DEFAULT_KEY ? <p className="form-available"><span>Available</span> {balanceCodeFilterSell[0].balance} XLM</p> : null}
                                            {this.getOfferFormBuy(balanceCodeBuy)}
                                        </div>}
                                        {this.state.loading ? <Loading loading={this.state.loading}/> : <div className="sell-form column">
                                            <h3 className="form-title">Sell {`${this.base.code}`} for XLM</h3>
                                            {balanceCodeBuy.length > 0 && this.props.keypair.publicKey() != DEFAULT_KEY ? <p className="form-available"><span>Available</span> {balanceCodeFilterBuy[0].balance} {`${this.base.code}`}</p>: null}
                                            {this.getOfferFormSell(balanceCodeBuy)}
                                        </div>}
                                    </div>

                                    {/* Include Offer Tables*/}
                                    <OfferTables/>

                                    {/* Include MyOffers Tables*/}
                                    <p className="my-Offer-title">My offers</p>
                                    <div className="holder row">
                                        <div className="buy-form column buy-form-table">
                                            {this.state.loading ? <Loading loading={this.state.loading}/> : this.getBuyOfferTable()}
                                        </div>
                                        <div className="sell-form column sell-form-table">
                                            {this.state.loading ? <Loading loading={this.state.loading}/> : this.getSellOfferTable()}
                                        </div>
                                    </div>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </div>
                    <div className="stock-block">
                        <MyStockChart/>
                        <div>
                            <div style={{display: "inline-block", verticalAlign: "top", "width": 60 + "%"}}>
                                <MarketTable />
                                <div className="amChartWrap">
                                    <Loading className="amChartLoading" loading={true}/>
                                    <DepthChart/>
                                </div>
                            </div>
                            <div style={{display: "inline-block", verticalAlign: "top", "width": 40+ "%", paddingRight: 35 + "px"}}>
                                <RecentTable />
                            </div>

                        </div>

                    </div>
                </div>
            }else {
                exchangeBlock = <div>
                    <div className="exchange-block">
                        <Grid.Row>
                            <Grid.Column className="main-column offers-main-form">
                                <div className="holder">
                                    <MyStockChart d={this.props} />
                                    <OrderBook />
                                    <OfferTables/>
                                    {this.tabView}
                                </div>
                            </Grid.Column>
                        </Grid.Row>
                    </div>
                </div>
            }
        } else {
            null
        }


        return (
            <div className="balances-container">
                {exchangeBlock}
                {!this.props.canCreate ?
                    this.getBuyOfferTable()
                    : null
                }
            </div>
        );
    }
}

Offers.propTypes = {
    trustlines: PropTypes.array,
    offers: PropTypes.array,
    createOffer: PropTypes.func.isRequired,
    deleteOffer: PropTypes.func.isRequired,
    canSign: PropTypes.bool,
    sendingOffer: PropTypes.bool,
    canCreate: PropTypes.bool,
};

export default Offers;
