import React, {Component, PropTypes} from 'react';
import {get, isEqual} from 'lodash';
import { ClipLoader } from 'react-spinners';
import { Table } from 'semantic-ui-react';
import { pageWidth} from '../../helpers/StellarTools';

import Asset from './popup';


class RecentTable extends Component {

    constructor(props) {
        super(props);
        this.rendered = false;
        this.state = {
            loading: true,
            recentData: [],
            sellCode: 'SLT',
            selectedCell: this.headerTitles.PRICE,
        };
        this.base = {
            code: get(this.props.orderbook, 'base.asset_code', 'not'),
            issuer: get(this.props.orderbook, 'base.asset_issuer', 'not')
        };
    }


    componentDidMount() {
        if(this.base.code != "not"){
            setTimeout(() => this.setState({ loading: false }), 1000);
        }
    }

    componentWillReceiveProps(nextProps) {
        const code = get(nextProps.orderbook, 'base.asset_code', null) || 'not';
        const issuer = get(nextProps.orderbook, 'base.asset_issuer', null) || 'not';

        if (this.props.orderbookIsChanged) {
            this.setState({loading: true, recentData: []});
        } else{
            if(this.props.trades != null){
                this.setState({recentData: this.props.trades.records});
            }else{
                this.setState({recentData: []});
            }
        }
        if (!this.props.orderbookIsChanged){
            this.setState({loading: false});
        }
        if (!isEqual(code, this.base.code) && !isEqual(issuer, this.base.issuer)) {
            // this.setState({loading: false});

            this.base.code = code;
            this.base.issuer = issuer;
        }
    }


    timeFotRecent(time){
        var timeSinceTrade= new Date()-new Date(time);
        var timeSinceTradeFormat;

        var d = new Date(timeSinceTrade);

        if (d.getMinutes()>0) {
            timeSinceTradeFormat = d.getMinutes() + "m";
        } else {
            timeSinceTradeFormat = d.getSeconds() + "s";
        }
        if (d.getUTCHours()>0) {timeSinceTradeFormat = d.getUTCHours() + "h"}
        if (d>1000*3600*24){timeSinceTradeFormat = ">1 day"}

        return timeSinceTradeFormat;
    }

    get headerTitles() {
        return {
            QUANTITY: "Quantity",
            PRICE: 'Price',
            TIME: 'Time',
        };
    }

    render() {

        return (
            <div style={{width: 100 + "%", textAlign: "center"}}>
                <p className="recent-trades-title" style={{textAlign: "center"}}>Recent trades</p>
                {this.state.loading ? <div className='sweet-loading'>
                    <ClipLoader
                        color={'#000000'}
                        loading={this.state.loading}
                    />
                </div> : <div className="is-relative clearfix">
                    <Table className={'recent-table'} singleLine size="small" compact unstackable>
                        <Table.Header>
                            <Table.Row>
                                { this.state.selectedCell === this.headerTitles.QUANTITY || pageWidth() ? <Table.HeaderCell>Quantity({`${this.base.code}`})</Table.HeaderCell> : null }
                                { this.state.selectedCell === this.headerTitles.PRICE || pageWidth() ? <Table.HeaderCell>Price(XLM)</Table.HeaderCell> : null }
                                { this.state.selectedCell === this.headerTitles.TIME || pageWidth() ? <Table.HeaderCell>Time</Table.HeaderCell> : null }
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {this.state.recentData.map((data, index)=>(
                                <Table.Row key={index}>
                                    { this.state.selectedCell === this.headerTitles.QUANTITY || pageWidth() ? <Table.Cell style={data.base_is_seller ? {color: "#3cb46d"} : {color: "#d43d3d"}}>
                                        <Asset {...data} />
                                    </Table.Cell> : null }
                                    { this.state.selectedCell === this.headerTitles.PRICE || pageWidth() ? <Table.Cell>
                                        {(Number(data.counter_amount)/Number(data.base_amount)).toFixed(7)}
                                    </Table.Cell> : null }
                                    { this.state.selectedCell === this.headerTitles.TIME || pageWidth() ? <Table.Cell style={{fontWeight: "bold"}}>
                                        {this.timeFotRecent(data.ledger_close_time)}
                                    </Table.Cell> : null }
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                </div>}
            </div>
        );
    }
}

RecentTable.propTypes = {

    trades: PropTypes.object,
};

export default RecentTable;
