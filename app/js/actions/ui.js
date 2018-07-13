export const OPEN_ERROR_MODAL = 'modal:error:open';
export const CLOSE_ERROR_MODAL = 'modal:error:close';
export const OPEN_KEYPAIR_MODAL = 'modal:keypair:open';
export const CLOSE_KEYPAIR_MODAL = 'modal:keypair:close';
export const DELETE_OFFER = 'offer:delete:fetching';
export const SEND_OFFER = 'offer:send:fetching';
export const SEND_OFFER_SUCCESS = 'offer:send:success';
export const DELETE_TRUSTLINE = 'trustline:delete:fetching';
export const TOGGLE_NAVIGATION = 'navigation:toggle';
export const PRICE_DATA = 'data:price';
export const ORDERBOOK_DATA = 'data:orderbook';
export const SELLBUY_DATA = 'data:sellbuy';

export function openKeypairModal() {
  return {
    type: OPEN_KEYPAIR_MODAL,
  };
}
export function closeKeypairModal() {
  return {
    type: CLOSE_KEYPAIR_MODAL,
  };
}
export function openErrorModal(errorData) {
    console.log("errorModal",{
        type: OPEN_ERROR_MODAL,
        errorData,
    });
  return {
    type: OPEN_ERROR_MODAL,
    errorData,
  };
}
export function closeErrorModal() {
  return {
    type: CLOSE_ERROR_MODAL,
  };
}

export function deletingOffer(offer) {
  return {
    type: DELETE_OFFER,
    offer,
  };
}
export function sendingOffer() {
  return {
    type: SEND_OFFER,
  };
}

export function sendOfferSuccess(data) {
  return {
    type: SEND_OFFER_SUCCESS,
    data,
  };
}

export function deletingTrustline(trustline, balances) {
  return {
    type: DELETE_TRUSTLINE,
    trustline,
    balances,
  };
}

export function toggleNavigation(toggle) {
  return {
    type: TOGGLE_NAVIGATION,
    toggle,
  };
}

export function priceDataFor(data) {
    return {
        type: PRICE_DATA,
        data,
    };
}

export function orderbookIsChanged(data) {
    return {
        type: ORDERBOOK_DATA,
        data,
    };
}

export function sellBuyIsChanged(data) {
    return {
        type: SELLBUY_DATA,
        data,
    };
}
