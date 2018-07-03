import React, { Component} from 'react';
import { Popup, Button } from 'semantic-ui-react';

class Asset extends Component {

    constructor(props) {
        super(props);
        this.state = {
            windowWidth: 1,
        };
    }

    getAccountIdText(issuer) {
        const firstThree = issuer.slice(0, 16);
        const lastThree = issuer.slice(-5);

        return `${firstThree}...${lastThree}`;
    }
    render() {
        const dataAmount = this.props.base_amount;
        const dataBase = this.props.base_account;
        const dataCounter = this.props.counter_account;
        return (
            <Popup
                className="popup-box"
                hoverable
                trigger={
                    <div>
                        {dataAmount}
                    </div>
                }>
                <Popup.Header>
                    {
                        <div>
                            <p><p className="recent-trades-head">Buyer: </p> <a href={`https://stellar.expert/explorer/public/account/${dataCounter}`} className="recent-trades-key" target="_blank">{this.getAccountIdText(dataCounter)}</a> </p>
                            <p><p className="recent-trades-head">Seller: </p> <a href={`https://stellar.expert/explorer/public/account/${dataBase}`} className="recent-trades-key" target="_blank">{this.getAccountIdText(dataBase)}</a>
                            </p>
                        </div>
                    }
                </Popup.Header>
            </Popup>
        );
    }
}

export default Asset;
