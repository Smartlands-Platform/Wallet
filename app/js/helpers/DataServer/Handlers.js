import _ from 'lodash';

import Trigger from './Trigger';

export default function Handlers(driver) {
  this.event = new Trigger();

  const init = () => {
    this.state = 'out';
    this.account = null;
  };
  init();
  this.updateAccountOffers = () => {
    const updateFn = _.get(this, 'account.updateOffers');
    if (updateFn) {
      updateFn();
    }
  };
}

