import { push } from 'react-router-redux';

import { AsyncActions } from '../helpers/asyncActions';
import * as AccountActions from '../actions/account';
import { ASYNC_FETCH_ACCOUNT, ASYNC_CREATE_TEST_ACCOUNT } from '../constants/asyncActions';

import { getAccount, switchNetwork as switchNetworkInstance, generateTestPair } from '../helpers/StellarServer';
import { KeypairInstance } from '../helpers/StellarTools';
import { getNetwork } from '../selectors/stellarData';
import {DEFAULT_KEY} from '../helpers/defaultData';

export const setAccount = keys => (dispatch, getState) => {
  dispatch(AsyncActions.startFetch(ASYNC_FETCH_ACCOUNT));

  const keypair = KeypairInstance(keys);
  const network = getNetwork(getState());
    // console.log("keypair.publicKey()", keypair.publicKey());
  //TODO ACCOUNT: keypair.secret()
  return getAccount(keypair.publicKey())
    .then((account) => {
      dispatch(AsyncActions.successFetch(ASYNC_FETCH_ACCOUNT, account));
      dispatch(AccountActions.setKeypair(keypair));
      const putSecret = (keypair.canSign() && process.env.NODE_ENV === 'development');
      const query = {
        accountId: putSecret ? undefined : keypair.publicKey(),
        secretSeed: putSecret ? keypair.secret() : undefined,
        network,
      };
      dispatch(push({ query }));
        if(keypair.publicKey() === DEFAULT_KEY){
            history.pushState(null, "", location.href.split("?")[0]);
        }
      return account;


    })
    .catch(error => dispatch(AsyncActions.errorFetch(ASYNC_FETCH_ACCOUNT, error)));
};

export const resetAccount = () => (dispatch) => {
  dispatch(push({ query: {} }));
  dispatch(AccountActions.resetAccount());
};

export const switchNetwork = network => (dispatch, getState) => {
  const currentNetwork = getNetwork(getState());
  if (network === currentNetwork) return;

  dispatch(resetAccount());

  switchNetworkInstance(network);
  dispatch(AccountActions.switchNetwork(network));
};

export const createTestAccount = () => (dispatch) => {
  dispatch(AsyncActions.startLoading(ASYNC_CREATE_TEST_ACCOUNT));
  generateTestPair()
    .then((newPair) => {
      dispatch(AsyncActions.stopLoading(ASYNC_CREATE_TEST_ACCOUNT));
      dispatch(setAccount(newPair));
    })
    .catch(console.error);
};

