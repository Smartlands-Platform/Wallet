import React, { PropTypes } from 'react';
import { Form, Dropdown, Table } from 'semantic-ui-react';
import Decimal from 'decimal.js';

import Asset from '../../../components/stellar/Asset';
import Amount from '../../../components/stellar/Amount';
import { validPk, AssetInstance, pageWidth, getHeaderCells } from '../../../helpers/StellarTools';
import data from '../../../helpers/DataServer/logos.json';
import '../../../../styles/wallet.scss';

import { get } from 'lodash';
import {AssetUid} from "js/helpers/StellarTools";
import { ClipLoader } from 'react-spinners';

const defaultSLTAccount = {
  asset_code: 'SLT',
  // asset_issuer: 'GC7Q4726KHPFK3LNMCSYJZ3YT7A2BFMGKEQYRLLTA2TSODUK3HBK2MOB' //test,
  asset_issuer: 'GCKA6K5PCQ6PNF5RQBF7PQDJWRHO6UOGFMRLK3DYHDOI244V47XKQ4GP' //prod,
};

class Balances extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      trustFirstHeight: null,
        // trustSecondHeight: null,
        loading: false,
        loadingTrust: false,
      validIssuer: true,
      tickersPrice: [{}],
      trustlines: {},
      // fullPrice: [],
      selectedCell: this.headerTitles.AMOUNT,
    };


    this.getMoviesFromApiAsync();

  }

  componentDidMount(){
      let tableWrap = document.querySelectorAll(".balances-container > table")[0].offsetHeight;
      // let tableWrapSecond = document.querySelectorAll(".balances-container > table")[1].offsetHeight;
      // console.log("tableWrapSecond", tableWrapSecond);
      setTimeout(()=>{
          this.setState({trustFirstHeight: tableWrap});
      }, 1000);
      // console.log("tableWrap", tableWrap);

      // let table = tableWrap.getElementsByTagName('table')[0];
      // let tableHeight = document.getElementsByClassName("balances-container").offsetHeight;
      // console.log("tableHeight", tableWrap);
  }

  get headerTitles() {
    return {
      ASSET: 'ASSET',
      AMOUNT: 'AMOUNT',
      PRICE: 'PRICE',
      PAYMENT: 'PAYMENT',
      TRUSTLINE: 'TRUSTLINE',
    };
  }

  checkIssuer(e) {
    const destinationAddress = e.target.value;
    this.setState({ validIssuer: validPk(destinationAddress) });
    if (destinationAddress === ''){
      this.setState({ validIssuer: true });
    }
  }

  goToPayment(code) {
    this.props.curTab(1, code);
  }

  getMoviesFromApiAsync() {
    return fetch('https://api.stellarterm.com/v1/ticker.json')
      .then(response => response.json())
      .then(responseJson => {
        this.setState({tickersPrice: responseJson.assets});

      })
      .catch((error) => {
        console.error(error);
      });
  }


  get getSLTtrustline() {
    return this.props.balances.filter(balance => balance.asset.code === defaultSLTAccount.asset_code && balance.asset.issuer === defaultSLTAccount.asset_issuer);
  }

    handleLoader () {
        this.setState({loading: true});
        // console.log("loading: true");
        setTimeout(() => {
            // console.log("loading: false");
            this.setState({loading: false})
        }, 6500)
    }

    handleLoaderTrustlines () {
        this.setState({loadingTrust: true});
        // console.log("loadingTrust: true");
        setTimeout(() => {
            // console.log("loading: false");
            this.setState({loadingTrust: false})
        }, 6500)
    }

  getBalanceRows() {

      // for(let i = 0; i <= this.state.tickersPrice.length; i++){
      //   console.log("i", this.state.tickersPrice[i]);
      // }

    this.props.balances.forEach(balance => {
        // console.log("balance", balance);
      this.state.tickersPrice.forEach(asset => {
          // this.props.createTrustline(Asset(asset.asset_code, asset.asset_issuer));
          // console.log("asset.code", asset.code);
          // console.log("asset.issuer", asset.issuer);
        if (balance.asset.code === asset.code && asset.issuer == balance.asset.issuer) {
            balance.price_USD = asset.price_USD;
            balance.domain = asset.domain;
        }
        // else if(balance.asset.code != asset.code && asset.issuer != balance.asset.issuer){
            // this.props.createTrustline(AssetInstance({'asset_code':  asset.code, 'asset_issuer': asset.issuer}));
        // }
      });
    });
      // console.log("this.props.balances", this.props.balances);
    return this.props.balances.map((balance, index) => {
      const bnBalance = new Decimal(balance.balance);
      const codeText = 'Send ' + get(balance, 'asset.code', '');

      return (
        <Table.Row key={index}>
          <Table.Cell className="prime">
            <Asset {...balance} />
          </Table.Cell>
          { this.state.selectedCell === this.headerTitles.AMOUNT || pageWidth() ? <Table.Cell className="cell-1">
            <Amount amount={balance.balance} />
          </Table.Cell> : null }
          { this.state.selectedCell === this.headerTitles.PRICE || pageWidth() ? <Table.Cell className="cell-2">
            {this.getPriceUSD(Number(balance.balance*balance.price_USD).toFixed(3))}
          </Table.Cell> : null }
          { this.state.selectedCell === this.headerTitles.PAYMENT || pageWidth() ? <Table.Cell className="cell-3">
            <button
              type="button"
              className='btn green-white send-button'
              onClick={this.goToPayment.bind(this, get(balance, 'asset.code', ''))}
            >{codeText}</button>
          </Table.Cell> : null }
          { this.state.selectedCell === this.headerTitles.TRUSTLINE || pageWidth() ? <Table.Cell className="cell-3">
            {this.props.canSign ?
              <button
                className="btn-icon remove"
                data-hover="Remove"
                disabled={!bnBalance.isZero()}
                onClick={() => {this.props.deleteTrustline(balance.asset, this.props.balances); this.handleLoader()}}
              />
              : null}
          </Table.Cell> : null }
        </Table.Row>
      );
    });
  }


  setFullList(){
    let fullArray = [];
    let imageDefault = "data:image/png;base64,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";
    let image = "data:image/png;base64,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";
    for (let i = 0; i < this.state.tickersPrice.length; i++) {
      let Asset = {};
      let image = '';
      for (const [key, value] of Object.entries(data)) {
        if(key === this.state.tickersPrice[i].domain){
          image = value;
        }else if(!key === this.state.tickersPrice[i].domain){
          image = imageDefault;
        }
        Object.assign(Asset, {
          value: this.state.tickersPrice[i].code + ':' + this.state.tickersPrice[i].issuer,
          text: `${this.state.tickersPrice[i].code} | ${this.state.tickersPrice[i].domain} \n ${this.state.tickersPrice[i].issuer}`,
          image: image,
          buyingCode: `${this.state.tickersPrice[i].code}-${this.state.tickersPrice[i].domain}`
        })
      }

      fullArray.push(Asset);
    }
    // console.log("fullArray", fullArray);
    return fullArray;
  };

  getTrustedAssets() {
    let image = "data:image/png;base64,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";
    let site = 'Smartland.io';
    let tokenName = "SLT";
    let newArray = this.setFullList();

    let trustlines = this.props.trustlines.map(asset => (
      {
        code: asset.code,
        issuer: asset.issuer,
        //TODO get data from StellarTools AssetUid()
        value: AssetUid(asset),
        //TODO get data from Asset.js getAssetString()
        text: `${asset.code} | ${site} \n ${asset.issuer}`,
        image: Asset.setNewData(image)
      })).map(trustline => {
      newArray.forEach((newItem) => {
        let value = newItem.value.split(':');
        if (trustline.code === value[0] && trustline.issuer === value[1]) {
          trustline.text = newItem.text;
          trustline.image = Asset.setNewData(newItem.image);
        }
      });
      return trustline;
    });
    return( newArray.filter(arrayItem=>{
      trustlines.forEach((trustline) => {
        let value = arrayItem.value.split(':');
        if (trustline.code === value[0] && trustline.issuer === value[1]) {
          arrayItem.filter=true
        }
      })
      if(arrayItem.filter||arrayItem.value==='XLM:null')
        return false;
      else
        return true;
    }));

    // trustlines.push(...newArray);
  }


  addTrustlineButton(formData) {
    this.props.createTrustline(AssetInstance(formData));
    // console.log("formData", trustline);
  }

  buttonClick(formData) {
    this.props.createTrustline(AssetInstance(formData));
  }

  getListofTrustlines(){
    return(
    this.getTrustedAssets().map((trustline, index)=> {
      // console.log("trustline", trustline)
      let code = trustline.value.slice(0, -57);
      let issuer = trustline.value.substr(-56);
      if(!trustline.image){
          trustline.image = "data:image/png;base64,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";
      }
      var formData = {
        'asset_code': code,
        'asset_issuer': issuer
      };
       return <Table.Body>
          <Table.Row key={index}>
            <Table.Cell>
              <div className="item-table">
                <img src={trustline.image} />
              </div>
            </Table.Cell>
            <Table.Cell>
                <Table.Row>
                  {trustline.text.split(/\r?\n/)[0]}
                </Table.Row>
                <Table.Row>
                  {trustline.text.split(/\r?\n/)[1]}
                </Table.Row>
            </Table.Cell>
            <Table.Cell collapsing textAlign='right'>
              <div className="item-table">
                { code &&
                <button
                  type="button"
                  className="btn green normal margin-bottom-md"
                  onClick={() => {this.props.createTrustline(AssetInstance(formData)), this.handleLoaderTrustlines()}}
                >Add the trustline for {formData.asset_code}</button>  }
              </div>

          </Table.Cell>
          </Table.Row>
        </Table.Body>
      })
    );
  }


  getPriceUSD(price) {
    return price ? '$' + price : 'N/A';
  }

  addTrustline(e, {formData}) {
    e.preventDefault();
    // console.log("",this.props);
    this.props.createTrustline(AssetInstance(formData));
    // console.log("formData", formData);
    e.target.asset_code.value = null;
    e.target.asset_issuer.value = null;
  }

  addTrustlineSLT(e) {
    e.preventDefault();
    this.props.createTrustline(AssetInstance(defaultSLTAccount));
  }

  getTrustlineForm() {
    if (!this.props.canSign) {
      return null;
    }
    return (
      <div className='balances-form'>
        <h3>Add a trustline</h3>

        {!this.getSLTtrustline.length && (<button
          type="button"
          className="btn green normal margin-bottom-md"
          onClick={::this.addTrustlineSLT}
          disabled={this.props.creatingTrustline}>
          Add the trustline for SLT
        </button>)}

        <Form
          size='large'
          onSubmit={::this.addTrustline}
          loading={this.props.creatingTrustline}
        >
          <Form.Group>
            <Form.Field
              name="asset_code"
              control="input"
              type="text"
              placeholder="Code"
              width="5"
              maxLength={12}
              required
            />
            <Form.Field
              name="asset_issuer"
              onChange={::this.checkIssuer}
              error={!this.state.validIssuer}
              control="input"
              type="text"
              maxLength={56}
              placeholder="Issuer"
              width="12"
              required
            />
            <Form.Button
              size="big"
              primary
              width="4"
              content="Add trustline"

            />
          </Form.Group>
        </Form>
      </div>
    );
  }

  mobileTableFilter() {
    const changeCell = (e, t) => {
      this.setState({ selectedCell: t.value });
      // console.log(this.state);
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

  render() {
    return (
      <div className='balances-container'>
        <Table fixed singleLine size="small" compact unstackable style={{height: this.state.trustFirstHeight}}>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell className="prime">ASSET</Table.HeaderCell>
              {this.state.selectedCell === this.headerTitles.AMOUNT || pageWidth() ? <Table.HeaderCell>AMOUNT</Table.HeaderCell> : null}
              {this.state.selectedCell === this.headerTitles.PRICE || pageWidth() ? <Table.HeaderCell>VALUE</Table.HeaderCell> : null}
              {this.state.selectedCell === this.headerTitles.PAYMENT || pageWidth() ? <Table.HeaderCell>PAYMENT</Table.HeaderCell> : null}
              {this.state.selectedCell === this.headerTitles.TRUSTLINE || pageWidth() ? <Table.HeaderCell>TRUSTLINE</Table.HeaderCell> : null}
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {this.state.tickersPrice.length && !this.state.loading ?  this.getBalanceRows() : <div className='sweet-loading'>
              <ClipLoader
                  color={'#000000'}
                  loading={this.state.loading}
              />
            </div>}
          </Table.Body>
        </Table>
        {this.getTrustlineForm()}
          {/*{console.log("tickersPrice", this.getBalanceRows())}*/}
        {!pageWidth() ? this.mobileTableFilter() : null}
        {window.innerWidth > 767 && <Table celled striped>
            {this.state.loadingTrust ? <div className='sweet-loading'>
              <ClipLoader
                  color={'#000000'}
                  loading={this.state.loadingTrust}
              />
            </div> :this.getListofTrustlines()}
        </Table> }
      </div>
    );
  }
}





Balances.propTypes = {
  canSign: PropTypes.bool.isRequired,
  creatingTrustline: PropTypes.bool,
  balances: PropTypes.array.isRequired,
  createTrustline: PropTypes.func.isRequired,
  deleteTrustline: PropTypes.func.isRequired,
  curTab: PropTypes.func,
  trustlines: PropTypes.array,
};

export default Balances;
