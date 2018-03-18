import React, { PropTypes } from 'react';
import { Dimmer, Loader, Dropdown, Grid, Header, Table } from 'semantic-ui-react';
import { find, isEmpty } from 'lodash';
import Asset from '../../../components/stellar/Asset';
import Amount from '../../../components/stellar/Amount';
import { AssetInstance, AssetUid } from '../../../helpers/StellarTools';

class OrderBook extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selling: null,
      buying: null,
    };

    console.log('this.state', this.state);
  }

  getBidRow(bid, index) {
    return (
      <Table.Row key={index}>
        <Table.Cell textAlign="right">
          <Amount amount={Math.round(bid.amount/bid.price)} />
        </Table.Cell>
        <Table.Cell>
          <Amount amount={bid.price} />
          <Asset asset={AssetInstance(this.props.orderbook.counter)} />
        </Table.Cell>
      </Table.Row>
    );
  }
  getBids() {
    const bids = this.props.orderbook.bids;
    if (!bids) return null;
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
          <Asset asset={AssetInstance(this.props.orderbook.counter)} />
        </Table.Cell>
        <Table.Cell>
          <Amount amount={ask.amount} />
        </Table.Cell>
      </Table.Row>
    );
  }
  getAsks() {
    const asks = this.props.orderbook.asks;
    if (!asks) return null;
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
    // this.props.isFetching = false;
    console.log('this.props', this.props);
    // this.props.isFetching = false;
    // this.props.orderbook = {};
    // this.props.isFetching = false;
    // this.props.orderbook = null;
  }

  getOrderbook() {
    if (!this.props.isFetching && isEmpty(this.props.orderbook)) {
      return (
        <Grid.Row centered className="notify-title">
          <Header as="h3">Please select a pair of assets to see an orderbook.</Header>
        </Grid.Row>
      );
    }
    return (
      <Grid.Row>
        <Dimmer inverted active={this.props.isFetching}>
          <Loader inverted active={this.props.isFetching} />
        </Dimmer>
        <Grid.Column>
          {this.getBids()}
        </Grid.Column>
        <Grid.Column>
          {this.getAsks()}
        </Grid.Column>
      </Grid.Row>
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
    const asset = find(this.props.trustlines, t => (AssetUid(t) === b.value));
    this.setState({ buying: asset }, ::this.updateOrderbook);
  }
  changeSellingAsset(a, b) {
    const asset = find(this.props.trustlines, t => (AssetUid(t) === b.value));
    this.setState({ selling: asset }, ::this.updateOrderbook);
  }
  getTrustedAssets() {
    return this.props.trustlines.map(asset => (
      {
        value: AssetUid(asset),
        text: Asset.getAssetString(asset),
      }));
  }

  updateOrderbook() {
    if (this.state.selling && this.state.buying) {
      this.props.setOrderbook(this.state);
    }
  }

  render() {
    const baseAsset = this.props.orderbook
      && this.props.orderbook.base
      && AssetInstance(this.props.orderbook.base);
    const counterAsset = this.props.orderbook
      && this.props.orderbook.counter
      && AssetInstance(this.props.orderbook.counter);
    return (
      <div className="order-book">
        <Header as="h3">
          Order Book
        </Header>

        <Grid columns={2}>
          <Grid.Row>
            <Grid.Column>
              <label className="text-center">
                {
                  baseAsset ?
                    <div>Base <Asset asset={baseAsset} /></div>
                    :
                    'Choose a base asset'
                }
              </label>

              <Dropdown
                selection fluid search
                options={this.getTrustedAssets()}
                placeholder="Asset sold"
                onChange={::this.changeSellingAsset}
              />
            </Grid.Column>
            <Grid.Column>
              <label className="text-center">
                {
                  baseAsset ?
                    <div>Counter <Asset asset={counterAsset} /></div>
                    :
                    'Choose a counter asset'
                }
              </label>

              <Dropdown
                selection fluid search
                options={this.getTrustedAssets()}
                placeholder="Asset bought"
                onChange={::this.changeBuyingAsset}
              />
            </Grid.Column>
          </Grid.Row>
          {this.getOrderbook()}
        </Grid>
      </div>
    );
  }
}

OrderBook.propTypes = {
  setOrderbook: PropTypes.func.isRequired,
  trustlines: PropTypes.array,
  orderbook: PropTypes.object,
  isFetching: PropTypes.bool,
};

export default OrderBook;
