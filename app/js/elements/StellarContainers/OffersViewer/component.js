import React, { PropTypes } from 'react';
import { Form, Header, Table, Grid, Dropdown, Icon, Modal, Button } from 'semantic-ui-react';
import Asset from '../../../components/stellar/Asset';
import Amount from '../../../components/stellar/Amount';
import { STROOP, pageWidth, getHeaderCells } from '../../../helpers/StellarTools';
import MyStockChart from '../../../elements/Charts';
import DepthChart from '../../../elements/Charts/depth_chart';
import OrderBook from '../../../elements/StellarContainers/OrderBook';
// import OfferTables from '../../SellBuyTables/OfferTables';
// import ManageOffers from '../../SellBuyTables/ManageOffers';
import {get, map, sortBy, isEqual} from 'lodash';
import { ClipLoader } from 'react-spinners';
import '../../../../styles/buy_sell_tabs.scss'

class Offers extends React.Component {
  constructor(props) {
    super(props);
      this.base = {
          code: get(this.props.orderbook, 'base.asset_code', 'not'),
          issuer: get(this.props.orderbook, 'base.asset_issuer', 'not')
      };
    this.state = {
      selectedCell: this.headerTitles.PRICE,
      buyingData: null,
      sellData: null,
        loading: true,
      tabIndex: 0,
      windowWidth: window.innerWidth,
      price: "",
      amount: "",
      priceSell: "",
      amountSell: ""
    };

    // console.log("this", this.props);
  }

  componentDidMount() {
      if(this.base.code != "not"){
          setTimeout(() => this.setState({ loading: false }), 2500);
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
        if (!isEqual(code, this.base.code) && !isEqual(issuer, this.base.issuer)) {
            this.setState({loading: true});
            setTimeout(() => this.setState({ loading: false }), 2000);
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
      amount: Number(formData.total).toFixed(7) ,
      price: Number(1/formData.price).toFixed(7),
      total: Number(formData.amount).toFixed(7),
      passive: false,
    };
    // console.log("formData",formData);
    // console.log("offer",offerData);
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
    // console.log("passive", formData.passive)
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
    // console.log("offer", offer);
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
        {/*{ this.state.selectedCell === this.headerTitles.BUYING || pageWidth() ? <Table.Cell>*/}
          {/*<Asset {...offer.buying} />*/}
        {/*</Table.Cell> : null }*/}
          {/*{ this.state.selectedCell === this.headerTitles.CANCEL || pageWidth() ? <Table.Cell>*/}
              {/*{this.props.canSign ?*/}
                  {/*<button*/}
                      {/*className="btn-icon remove"*/}
                      {/*data-hover="Remove"*/}
                      {/*onClick={::this.deleteOffer(offer)}*/}
                  {/*/>*/}
                  {/*: null}*/}
          {/*</Table.Cell> : null }*/}
          {/*{ this.state.selectedCell === this.headerTitles.TIME || pageWidth() ? <Table.Cell>*/}
              {/*{0}*/}
          {/*</Table.Cell> : null }*/}
          { this.state.selectedCell === this.headerTitles.AMOUNT || pageWidth() ? <Table.Cell>
              <Amount amount={Number(offer.amount*offer.price).toFixed(4)} />
          </Table.Cell> : null }
        { this.state.selectedCell === this.headerTitles.PRICE || pageWidth() ? <Table.Cell>
          <Amount amount={Number(1/offer.price).toFixed(7)} />
        </Table.Cell> : null }
      </Table.Row>
    );
  }
    getSellOfferRow(offer, index) {
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
                { this.state.selectedCell === this.headerTitles.PRICE || pageWidth() ? <Table.Cell>
                    <Amount amount={offer.price} />
                </Table.Cell> : null }
                { this.state.selectedCell === this.headerTitles.AMOUNT || pageWidth() ? <Table.Cell>
                    <Amount amount={offer.amount} />
                </Table.Cell> : null }
                {/*{ this.state.selectedCell === this.headerTitles.TIME || pageWidth() ? <Table.Cell>*/}
                    {/*{0}*/}
                {/*</Table.Cell> : null }*/}
                {/*{ this.state.selectedCell === this.headerTitles.CANCEL || pageWidth() ? <Table.Cell>
                    {this.props.canSign ?
                        <button
                            className="btn-icon remove"
                            data-hover="Remove"
                            onClick={::this.deleteOffer(offer)}
                        />
                        : null}
                </Table.Cell> : null }*/}
            </Table.Row>
        );
    }

    handleChangeAmountBuy(e){
        e.preventDefault();
        let amount = e.target.value;
        this.setState({amount: amount})
    };

    handleChangePriceBuy(e){
        e.preventDefault();
        var price = e.target.value;
        this.setState({price: price})

    }


    handleChangeAmountBuySell(e){
        e.preventDefault();
        let amount = e.target.value;
        this.setState({amountSell: amount})
    };

    handleChangePriceBuySell(e){
        e.preventDefault();
        var price = e.target.value;
        this.setState({priceSell: price})
    }

  getBuyOfferTable() {

      let OffersArray = this.props.offers;
      var buyingCode = "SLT";
      if (this.props.orderbook != null){
          var buyingCode = this.props.orderbook.base.asset_code;
          // console.log("buyingCode", buyingCode);
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
    const colSpanDefault = pageWidth() ? '3' : '2';
    return (
      <div className="is-relative">
        <Table className={this.props.canCreate ? 'exchange-table' : ''} singleLine size="small" compact unstackable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>CANCEL</Table.HeaderCell>
              {/*{ this.state.selectedCell === this.headerTitles.BUYING || pageWidth() ? <Table.HeaderCell>Buying</Table.HeaderCell> : null }*/}
                {/*{ this.state.selectedCell === this.headerTitles.CANCEL || pageWidth() ? <Table.HeaderCell>Cancel</Table.HeaderCell> : null }*/}
                {/*{ this.state.selectedCell === this.headerTitles.TIME || pageWidth() ? <Table.HeaderCell>Time ago</Table.HeaderCell> : null }*/}
                { this.state.selectedCell === this.headerTitles.AMOUNT || pageWidth() ? <Table.HeaderCell>Quantity({`${buyingCode}`})</Table.HeaderCell> : null }
                { this.state.selectedCell === this.headerTitles.PRICE || pageWidth() ? <Table.HeaderCell>Price(XLM)</Table.HeaderCell> : null }
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.props.offers.length ?
                buyOffers.map(::this.getBuyOfferRow) :
              <Table.Row>
                <Table.Cell className="nodata" colSpan={colSpanDefault} textAlign="center">No offers</Table.Cell>
              </Table.Row>
            }
          </Table.Body>
        </Table>
        {!pageWidth() ? this.mobileTableFilter() : null}
      </div>
    );
  }
  getSellOfferTable() {
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
        const colSpanDefault = pageWidth() ? '3' : '2';

        return (
            <div className="is-relative">
                <Table className={this.props.canCreate ? 'exchange-table' : ''} singleLine size="small" compact unstackable>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>CANCEL</Table.HeaderCell>
                            {/*{ this.state.selectedCell === this.headerTitles.BUYING || pageWidth() ? <Table.HeaderCell>Buying</Table.HeaderCell> : null }*/}
                            { this.state.selectedCell === this.headerTitles.PRICE || pageWidth() ? <Table.HeaderCell>Price(XLM)</Table.HeaderCell> : null }
                            { this.state.selectedCell === this.headerTitles.AMOUNT || pageWidth() ? <Table.HeaderCell>Quantity({buyingCode})</Table.HeaderCell> : null }
                            {/*{ this.state.selectedCell === this.headerTitles.TIME || pageWidth() ? <Table.HeaderCell>Time ago</Table.HeaderCell> : null }*/}{/*
                            { this.state.selectedCell === this.headerTitles.CANCEL || pageWidth() ? <Table.HeaderCell>Cancel</Table.HeaderCell> : null }*/}
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {this.props.offers.length ?
                            sellOffers.map(::this.getSellOfferRow) :
                            <Table.Row>
                                <Table.Cell className="nodata" colSpan={colSpanDefault} textAlign="center">No offers</Table.Cell>
                            </Table.Row>
                        }
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

    // console.log("Все значеня для таблици ", t.value);

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

  // onChangeSellS1(e, data) {
    // console.log("e", e);
    // const match = e.target.textContent.match(/^(.+?)\(/);
    // let selectedSell = "XLM";
    // let selectedSell;
    // if (match) {
    //   selectedSell = match[1];
    //     console.log("selectedSell", selectedSell);
    // } else {
    //   selectedSell = e.target.textContent;
    //   console.log("selectedSell", selectedSell);
    // }
    // this.setState({selectedSell});
      // console.log("selectedSell", selectedSell);
  // }

  // onChangeBuyB1(e, data) {
  //   const match = e.target.textContent.match(/^(.+?)\(/);
  //   let selectedBuy;
  //   if (match) {
  //     selectedBuy = match[1];
  //   } else {
  //     selectedBuy = e.target.textContent;
  //   }
  //   this.setState({selectedBuy});
  //   this.onChangeSellS1();
  // }

    // onChangeSellS2(e, data) {
    //     const match = e.target.textContent.match(/^(.+?)\(/);
    //     let selectedSell;
    //     if (match) {
    //         selectedSell = match[1];
    //     } else {
    //         selectedSell = e.target.textContent;
    //     }
    //     this.setState({selectedSell});
    //     // console.log("selectedSell", selectedSell);
    //     this.onChangeBuyB2();
    //     // return this.props.d.orderbook.base.asset_code;
    // }

    // onChangeBuyB2(e, data) {
    //     // const match = e.target.textContent.match(/^(.+?)\(/);
    //     let selectedBuy = "XLM";
    //     // if (match) {
    //     //     selectedBuy = match[1];
    //     // } else {
    //     //     selectedBuy = e.target.textContent;
    //     // }
    //     this.setState({selectedBuy});
    // }


  getOfferFormBuy() {
      // console.log("dataForBuy", dataForBuy);
    // const getAssetsOptions = assets => assets.map((asset, index) => (
    //   {
    //     value: index,
    //     text: Asset.getAssetString(asset),
    //   }));

    return (
      <Form onSubmit={::this.createOfferBuy} loading={this.props.sendingOffer}>
        <Form.Group widths="12">
          {/*<Form.Select*/}
              {/*label="Buy"*/}
              {/*name="buy_asset"*/}
              {/*// defaultValue={17}*/}
              {/*options={getAssetsOptions(this.props.trustlines)}*/}
              {/*onChange={::this.onChangeBuyB1}*/}
              {/*placeholder="Asset to buy"*/}
              {/*required*/}
          {/*/>*/}
          {/*<Form.Select*/}
            {/*label="Sell"*/}
            {/*name="sell_asset"*/}
            {/*options={getAssetsOptions(this.props.trustlines)}*/}
            {/*onChange={::this.onChangeSellS1}*/}
            {/*placeholder="Asset to sell"*/}
            {/*required*/}
          {/*/>*/}
        </Form.Group>
        <Form.Group widths="12">
          <Form.Field
              name="price"
              label="Price"
              control="Input"
              type="number"
              placeholder="1"
              step={STROOP}
              onChange={(e) => this.handleChangePriceBuy(e)}
              required
          />
          <Form.Field
            name="amount"
            label="Amount"
            control="Input"
            type="number"
            placeholder="0"
            step={STROOP}
            onChange={(e) => this.handleChangeAmountBuy(e)}
            required
          />
          <Form.Field
              name="total"
              label="Total"
              control="Input"
              type="number"
              placeholder="1"
              value={Number(this.state.price*this.state.amount).toFixed(7)}
              step={STROOP}
              disabled
          />

        </Form.Group>
        <Form.Group className="control-box">
          {/*<Form.Checkbox*/}
            {/*name="passive"*/}
            {/*label="Passive offer"*/}
          {/*/>*/}
          <Form.Button
            type="submit"
            primary
            className="create-btn"
            color="green"
            content={this.buySellButton()}
          />
        </Form.Group>
      </Form>
    );
  }
  getOfferFormSell() {
        // console.log("dataForSell", dataForSell);
        // let dataForOfferSell = dataForSell;
        // const getAssetsOptions = assets => assets.map((asset, index) => (
        //     {
        //         value: index,
        //         text: Asset.getAssetString(asset),
        //     }));

      // this.onChangeSellS2(dataForOfferSell);

        return (
            <div className="exchange-form">
                <Form onSubmit={::this.createOfferSell} loading={this.props.sendingOffer}>
              <Form.Group widths="12">
                {/*<Form.Select*/}
                    {/*label="Sell"*/}
                    {/*name="sell_asset"*/}
                    {/*// defaultValue={17}*/}
                    {/*options={getAssetsOptions(this.props.trustlines)}*/}
                    {/*onChange={::this.onChangeSellS2}*/}
                    {/*placeholder="Asset to sell"*/}
                    {/*required*/}
                {/*/>*/}
                {/*<Form.Select*/}
                    {/*label="Buy"*/}
                    {/*name="buy_asset"*/}
                    {/*options={getAssetsOptions(this.props.trustlines)}*/}
                    {/*onChange={::this.onChangeBuyB2}*/}
                    {/*placeholder="Asset to buy"*/}
                    {/*required*/}
                {/*/>*/}
              </Form.Group>
              <Form.Group widths="12">
                <Form.Field
                    name="price"
                    label="Price"
                    control="Input"
                    type="number"
                    placeholder="1"
                    step={STROOP}
                    onChange={(e) => this.handleChangePriceBuySell(e)}
                    required
                />
                <Form.Field
                    name="amount"
                    label="Amount"
                    control="Input"
                    type="number"
                    placeholder="0"
                    step={STROOP}
                    onChange={(e) => this.handleChangeAmountBuySell(e)}
                    required
                />
                <Form.Field
                    name="total"
                    label="Total"
                    control="Input"
                    type="number"
                    placeholder="1"
                    step={STROOP}
                    value={this.state.priceSell*this.state.amountSell}
                    disabled
                />

              </Form.Group>
              <Form.Group className="control-box">
                  {/*<Form.Checkbox*/}
                  {/*name="passive"*/}
                  {/*label="Passive offer"*/}
                  {/*/>*/}
                <Form.Button
                    type="submit"
                    primary
                    className="create-btn"
                    color="green"
                    content={this.sellBuyButton()}
                />
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
      switch(this.state.tabIndex) {
          case 1:
              tabPanel = <div className="buy-form">
                {this.getOfferFormBuy()}
                {this.getBuyOfferTable()}
              </div>;
              break;
          case 2:
            tabPanel = <div className="sell-form">
              {this.getOfferFormSell()}
              {this.getSellOfferTable()}
            </div>;
              break;
          default:
              tabPanel = <div className="buy-form">
                  {this.getOfferFormBuy()}
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
      // console.log("this.props.offer", this.props);
    // var dataForBuySell = this.props.d.orderbook.base.asset_code;

        if (this.props.canSign && this.props.canCreate) {
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
                      <div className="holder">
                        <div className="buy-form">
                          {this.getOfferFormBuy()}

                          {this.state.loading ? <div className='sweet-loading'>
                              <ClipLoader
                                  color={'#000000'}
                                  loading={this.state.loading}
                              />
                          </div> : this.getBuyOfferTable()}

                        </div>
                        <div className="sell-form">
                          {this.getOfferFormSell()}

                          {this.state.loading ? <div className='sweet-loading'>
                              <ClipLoader
                                  color={'#000000'}
                                  loading={this.state.loading}
                              />
                          </div> : this.getSellOfferTable()}
                        </div>
                      </div>
                      {/*<OfferTables d={this.props} />*/}
                    </Grid.Column>
                    {/*<OfferTables d={this.props} />*/}
                    {/*<ManageOffers d={this.props} />*/}
                    {/*<SellBuyTables/>*/}
                  </Grid.Row>
                </Grid>
              </div>
              <div className="stock-block">
                  <MyStockChart d={this.props}  />
                  <DepthChart d={this.props}/>
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
