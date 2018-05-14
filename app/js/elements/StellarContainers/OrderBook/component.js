import React,{Component} from 'react';
import PropTypes from 'prop-types';
import { Dimmer, Loader, Dropdown, Grid, Header, Table } from 'semantic-ui-react';
import { find, isEmpty } from 'lodash';
import AssetComponent from '../../../components/stellar/Asset';
import Amount from '../../../components/stellar/Amount';
import { AssetInstance, AssetUid } from '../../../helpers/StellarTools';
import '../../../../styles/orderbook_dropdown.scss';
import data from '../../../helpers/DataServer/logos.json';
import '../../../../styles/style.scss';
import {Asset} from 'stellar-sdk';
// import DepthChart from '../../../elements/Charts/depth_chart';
// import logo from '../../../../../content/assets/images/vector-smart-object.png';

import OfferTables from '../../SellBuyTables/OfferTables';
// import ManageOffers from '../../SellBuyTables/ManageOffers';


export default class OrderBook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isChange: false,
      selling: null,
      buying: null,
      isMenuOpen: false,
      trustlines: {},
      selectValue: null,
       tickersPrice: [{}],
        baseBuying: {}
      // site: null
    };
    this.getMoviesFromApiAsync();
      setTimeout(()=>{
          this.setFullList();
      }, 1000);

  }

  componentDidMount(){
        var id = document.getElementsByClassName("order-wrap");
        var newSpan = document.createElement('p');
        newSpan.innerHTML = "<strong>XLM </strong> Stellar Network <p>native</p>";
        if (id.length > 0) {
            id[1].appendChild(newSpan);
        }
      this.changeSellingAsset();
    }


  getBidRow(bid, index) {
    return (
      <Table.Row key={index}>
        <Table.Cell textAlign="right">
          <Amount amount={Math.round(bid.amount/bid.price)} />
        </Table.Cell>
        <Table.Cell>
          <Amount amount={bid.price} />
          <AssetComponent asset={AssetInstance(this.props.orderbook.counter)} />
        </Table.Cell>
      </Table.Row>
    );
  }

  getBids() {
    if (!this.props.orderbook) return null;
    const bids = this.props.orderbook.bids;
    return (
      <Table singleLine size="small" compact unstackable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell colSpan={2} textAlign="center">Bids</Table.HeaderCell>
          </Table.Row>
          <Table.Row>
            <Table.HeaderCell>Volume</Table.HeaderCell>
            <Table.HeaderCell>Price</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {
            bids.length ?
              bids.map((bid, i) => (this.getBidRow(bid, i)))
              :
              <Table.Row textAlign="center"><Table.Cell colSpan={2}>
                No Bids
              </Table.Cell></Table.Row>
          }
        </Table.Body>
      </Table>
    );
  }

  getAskRow(ask, index) {
    return (
      <Table.Row key={index}>
        <Table.Cell>
          <Amount amount={ask.price} />
          <AssetComponent asset={AssetInstance(this.props.orderbook.counter)} />
        </Table.Cell>
        <Table.Cell>
          <Amount amount={ask.amount} />
        </Table.Cell>
      </Table.Row>
    );
  }

  getAsks() {
    if (!this.props.orderbook) return null;
    const asks = this.props.orderbook.asks;
    return (
      <Table singleLine size="small" compact unstackable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell colSpan={2} textAlign="center">Asks</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Price</Table.HeaderCell>
            <Table.HeaderCell>Volume</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {
            asks.length ?
              asks.map((ask, i) => (this.getAskRow(ask, i)))
              :
              <Table.Row textAlign="center"><Table.Cell colSpan={2}>
                No Asks
              </Table.Cell></Table.Row>
          }
        </Table.Body>
      </Table>
    );
  }

  componentWillUnmount() {
      //TODO will add clean up of orderbooks reducer!!!
      this.setDefaultAsset();
    // this.props.isFetching = false;
    // console.log('this.props', this.props);
    // this.props.isFetching = false;
    // this.props.orderbook = {};
    // this.props.isFetching = false;
    // this.props.orderbook = null;
  }

    // getDataOrder(orderData){
    //     // let base = orderData.base;
    //     let baseBuying = {
    //         code: orderData.base.asset_code,
    //         issuer: orderData.base.asset_issuer
    //     };
    //     this.setState(baseBuying);
    //
    //     this.props.setOrderbook(this.state);
    //
    //     console.log("baseBuying", this.props.orderbook);
    // }

  getOrderbook() {
    if (!this.props.isFetching && isEmpty(this.props.orderbook)) {
      return (
        <Grid.Row centered className="notify-title">
          {/*<Header as="h3">Please select a pair of assets to see an orderbook.</Header>*/}
        </Grid.Row>
      );
    }
      return (
      <div style={{width: 100 + "%"}}>
          <div style={{display: 'none'}}>
              {this.getAsks()}
              {this.getBids()}
          </div>
          {/*{TODO SELL/BUY add data to table from orderbook props - Chapter 1}*/}
          <OfferTables d={this.props} change={this.state.isChange} />
          {/*{console.log("this.props.orderbook", this.props)}*/}
          {/*<ManageOffers d={this.props} />*/}
      </div>
    );
  }

  reverseOrderbook() {
    if (this.state.selling && this.state.buying) {
      this.setState({
        selling: this.state.buying,
        buying: this.state.selling,
      }, ::this.updateOrderbook);
      this.props.setOrderbook(this.state);
    }
  }
  changeBuyingAsset(a, b) {
   //TODO disble native Buying
    const asset = find(this.props.trustlines, t => ( AssetUid(t) === "native" ));
    this.setState({ buying: asset }, ::this.updateOrderbook);
  }

  setDefaultAsset() {
      let defaultValue = "custom:SLT:GCKA6K5PCQ6PNF5RQBF7PQDJWRHO6UOGFMRLK3DYHDOI244V47XKQ4GP";
      const buying = find(this.props.trustlines, t => ( AssetUid(t) === "native" ));
      const selling = find(this.props.trustlines, t => ( AssetUid(t) === defaultValue ));
      this.props.resetOrderbook();
      this.props.setOrderbook({
          selling,
          buying
      });
  }

  changeSellingAsset(a, b) {
      //TODO refactor!!!!!
      let defaultValue = "custom:SLT:GCKA6K5PCQ6PNF5RQBF7PQDJWRHO6UOGFMRLK3DYHDOI244V47XKQ4GP";


      if (b === undefined){
          var asset = find(this.props.trustlines, t => (AssetUid(t) === defaultValue));
          this.setState({ selling: asset, selectValue: defaultValue }, ::this.updateOrderbook);
      }else{
          var asset = find(this.props.trustlines, t => (AssetUid(t) === b.value));
          var newArray=this.setFullList();
          var asset2 = find(newArray, t => ("custom:"+t.value === b.value));
          // var asset2 = find(this.props.trustlines,t);
          // console.log("in else");
          this.setState({isChange: true});
          setTimeout(()=>{
              this.setState({isChange: false});
          }, 1000);
          this.setState({isChange: true});
          let code = b.value.slice(0, -57);
          let issuer = b.value.substr(-56);
          document.getElementById("dropImage").src=asset2.image;
          var formData = {
              'asset_code': code,
              'asset_issuer': issuer
          };
          if(asset === undefined){
              this.props.createTrustline(AssetInstance(formData));
              // console.log("undefined", formData);
          }
          this.setState({ selling: asset, selectValue: b.value }, ::this.updateOrderbook);

      }
      // console.log("asset", asset);
    // let code = b.value.slice(0, -57);
    // let issuer = b.value.substr(-56);
    // var formData = {
    //       'asset_code': code,
    //       'asset_issuer': issuer
    // };

    this.changeBuyingAsset();
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

  //TODO get Assets for trust in orderBook
  getTrustedAssets() {
      let image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQIAAAECCAYAAAAVT9lQAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAACKFJREFUeNrs3T1yG8kZBuBe2YEz0pkzwJkzMHRG+ATUDaAbcG8A3YBHAJ3ZEbjZOiJ0AlAnIPYEoDJn9HRxYEEUqSWJv+n+nqeqi9JulQqYnnnZ/U1PT0oAAAAAAAAAAAAAAAAAAAAAAI/85BBUo9e0ftNOmnbc/rnf/r/Vf3uLRduyu6bdtH++Wfv7F4dfELB/g/biXrVhBz7TbC0YZm14/KarBAHbvfCHa+24kM9914bCKhw+6UpBwOuctRf9+7Uhfg1mbbtq2mfdDE//5r9o2rJp9wHabdMmbehBaEdNGzVtHuTif64t21AYOCWIpBfst/9rRwrnbUhCtQEwcbG/apTQc9ogALR7gUANNYCxC1kgENdZO991AW+/XaghUMI04NrFupcawrnTjS4aJXcC9t1y6LrtSGdqAVMX5UHb2GnIIQ3UAjo1OlBM5CBTARdg92oHp05N9uXCRWeqQOx6gMVB5aw7gJ2EwNwFVlSbJ2sOEAKaMEAIaMIAIaAJA4SAJgzYAncH6mxTpzYvZZ2AW4sEZ8VgjDZyqtvO/Dn52YEbhyGE/O6FYQq+tbogeLo4mEOg71CEcdOGQdhXt/3BOfCdfzXt7w5DKH9p2p+a9h+HAnUBLewTi6YGX/XaIeKxQxHWIj28VDbcFMHU4Kv8Lr6/OQyh5V8C/00BX9ZqRPB1SnDpMNDqp2CvdDcieLhL8Gt6KBbBKgj+HekLv9Pn6aO6AI/kV9GHKhxGnxrkAuHCec8TZk37hyCIYdqmfwQ37cl904bf4nfmwavfiMN2qLz6GUn+zp8SVcsneoSHavJr17b1yG0eQeU3C0V5LNtDSQHU+kqy/H6Fcdr98/aDFOMRbe9IMBoobi//Q2zfXft7Hm2JXnltoLZNNg694855qvOdj7culzr1KhsFdOl5+kGlYXDmsqnPpKIQ6OIbgGsMA0XDyhxVcpLOU7dfA15bGCxdOnUZJSMBBVmPKH8n2rMGl+lhE4pSlbSt1mqx0rCScycfexuXKBIqWr3RbSUjgrlLqA6lb01+Uehxr2mK4KUoFSj5N9Nt4SdhLQuOqq0TRHkMORfX+gV//g+p7O2zLis5j4YJ04J0uFWDNajhdmK1r0mLMiIoOcl/rqQPrir4DjawKVjJdwtqWtF2VkmdgEKVvIiotkdgBYGpgWnBK81SfTvpzir4DqeCQBDs02WFfeHFsoLgYPWBfoGfOy9n/WeF/bFwyQmCQzgp9HNfVdofNYwIjgWBIBAEm490nFOCQH3ghX6ptD8+JwSB9H6RmdMSQbA9R4XO5wSB/hEE5nKCAEEgCNxrRxBsVYnTgkUq+3FjBEHnDAsNAhAEwakPmLoJgi0rsUZwV/lFNKjgO3wRBGoEftvE6xNTA9iyoambINinUp8Z/1R5EJwkBAFGBEYEgoDYcqGw9BrBnSCAzXyo4DtUW8ytNQg8bNQ97wVBd/2x4iCYOck6I29l3i/8OyyS5d+wkRrefTituYPUCNi1fCt3WMH3mOlKeLuS30K93ga6Et5mXEkILHUlvM2gkhCo7R2UagTsTd4v8rKi73OlS+H1phWNBu7bYANeYVJZCEx0KbzOqLIQyO1Mt0LsELjVrRA7BHIb61qIWRNYXzugSAiBQ0CREF4g/6acVxwCufV0MzxvECAE1AbgB87auXPNIaA2AD8wrjwAVm2kq+HpesA0SAhc626IWQ9YnxIoEMIjowD1gPV2rsvhWxeBAqD6/QjhLfWA62AhcJvcJYBv6gG3wUJgmexFCGHrAR4xhkfOAwaA9QKwZiIEQAgIAQgqwpODQgCEgBAAIfD9LUIhAIFrAtYJQPAQyKMfDxFBK+I6gUmybBj+7yxgCHiKENb0Uqxlw/m7nup2+FakOwTXpgLwvXGgELDjMDzhNMXZR8CtQXhGhD0FpqYCEHdKYJUg/I7a7xJYIAQvUPPqwQvdCy8bDdQ6FbCdGAQeDZgKQPDRgGcFIPhowLMC8EpHqZ47BeoB8EajZAMRCK+GB4ssFYYN1FAknCdFQdjIhRAASp4WqAlA8GmBEOigdw5Bkd4X/Nl/btpnXQibmyYPD0F4JS4imus22J5BoaMBdQE1ArbopMDP/FFdALartPUDt7rMiAAjgo+6rPt+cgiKc1/QZ1007a+6zIiA7Sptxx6jAdiBkl5estRdRgTsRr+gz3qpuwQBgkAQCAJ25LiQz7lI1g0IAnamlFuHV7pKEMDMIRAEcOMQCAJiu2vabw6DIMBoAEEACAJAEACCABAEgCAABAEgCABBAAgCQBAA5bKLcVny24K6vjlJfujIpiQAAAAAAAAAAAAAAAAAAAAAAKWzQ1H9jpo2bNpJ+zO1f17f6Wi29vOm/fnFoYPyL/7zps2bdv/GNm//jSOHE8rSa9qkacsNAuBxW7b/Zs/hhe4bbzkAngqEscMM3TTYcArwlinDwGGH7hjteBTwo9HByOGHboTA/YGbMIDgISAMQAgIAziUwYFqAi9pCoiwJ/OOhkBut8niI9i5cYdDYNWsM4Ad6hUQAqtmBSLsyKSgIJjoLti+o4JCwKigUO8cgs774DMDXb5T8KM7CMCW9AoMAdMDUwO2bFjwZ3+v+wQBguBE9wkCtqPvs7MPNi/ttvxcwXGhn/2uaX/WhYKAzd07vzA1AAQBIAgAQUB6KLiBIAjupuDPPtN9goDtWBjNIAgwIkAQUPTFJAhgi/IjvR5DxogguCufGShxTwJ7EcAOTAsKgWvdBbsxKCgITnUX7E4JW5rbyhx2LG9rvuxwCCyTV57BXpx2OAjOdA/sTxffgeidhxC8XqAuAMHDQAhA8GnChcMP3ZGLdPu8m7BMCoPQSfm23T5WH06TW4TQefn24nXazbJhKwahMHlJ8mTDKcOy/TcEQABeQBFjlDBsWz89/yqyRdtmbfvk0AEAAAAAAAAAAAAAAAAAAAAABPY/AQYAy0Q5AZlICSYAAAAASUVORK5CYII=";
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
              image: AssetComponent.setNewData(image)
          })).map(trustline => {
              newArray.forEach((newItem) => {
                  let value = newItem.value.split(':');
                  let text= newItem.text.split(' ');
                  // console.log(text)
                  if (trustline.code === value[0] && trustline.issuer === value[1]) {
                      trustline.text = text[0]+" "+text[1]+" "+text[2]+" "+text[3]+" "+text[4].substring(0,9)+"..."+text[4].substring(text[4].length-9,text[4].length);
                      trustline.image = AssetComponent.setNewData(newItem.image);
                  }
              });
              return trustline;
            });
/*            trustlines.push(...newArray);*/
      // console.log("trustlines", trustlines)

            return trustlines.filter(v=> {
                return v.issuer
            })

    }

  // }

  updateOrderbook() {
    if (this.state.selling && this.state.buying) {
      this.props.setOrderbook(this.state);
      // console.log("this.state", this.state);
    }
  }

  render() {
      // console.log("this.props.orderbook", this.props.orderbook);
    const baseAsset = this.props.orderbook
      && this.props.orderbook.base
      && AssetInstance(this.props.orderbook.base);
    const counterAsset = this.props.orderbook
      && this.props.orderbook.counter
      && AssetInstance(this.props.orderbook.counter);
    let changeImage = "data:image/png;base64, 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";
    let imageDefault = "data:image/png;base64, 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";
    return (
      <div className="order-book">
        {/*<Header as="h3">*/}
          {/*Order Book*/}
        {/*</Header>*/}

        <Grid columns={2}>
          <Grid.Row>
            <Grid.Column>
              {/*<label className="text-center">*/}
                {/*{*/}
                  {/*baseAsset ?*/}
                    {/*<div>Base <Asset asset={baseAsset} /></div>*/}
                    {/*:*/}
                    {/*'Choose a base asset'*/}
                {/*}*/}
              {/*</label>*/}

              <div className="order-wrap">
                  <img id="dropImage" className="top-image"
                       src={changeImage}
                       alt=""/>

                  <Dropdown
                      className="order-drop"
                      selection fluid
                      // defaultOpen={true}
                      // onOpen={::this.changeSellingAsset}
                      options={this.getTrustedAssets()}
                      placeholder="SLT | smartlands.io GCKA6K5PC...V47XKQ4GP"
                      // onLabelClick={::this.defaultImage}
                      onChange={::this.changeSellingAsset}
                  />



              </div>

            </Grid.Column>
            <Grid.Column>
              {/*<label className="text-center">*/}
                {/*{*/}
                  {/*baseAsset ?*/}
                    {/*<div>Counter <Asset asset={counterAsset} /></div>*/}
                    {/*:*/}
                    {/*'Choose a counter asset'*/}
                {/*}*/}
              {/*</label>*/}
                <div className="order-wrap">
                    <img className="top-image"
                         src={imageDefault}
                         alt=""/>
                      <Dropdown
                        className="order-drop"
                        selection fluid disabled
                        options={this.getTrustedAssets()}
                        onChange={::this.changeBuyingAsset}
                      />
                </div>
            </Grid.Column>
          </Grid.Row>
            {/*<OffersViewer d={this.props} canCreate={true} />*/}
            {/*{console.log("this.props", this.props)}*/}
          {this.getOrderbook()}
        </Grid>
      </div>
    );
  }
}

OrderBook.propTypes = {
  setOrderbook: PropTypes.func.isRequired,
  resetOrderbook: PropTypes.func.isRequired,
  trustlines: PropTypes.array,
  orderbook: PropTypes.object,
  isFetching: PropTypes.bool,
};

