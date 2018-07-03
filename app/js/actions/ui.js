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

  //TODO error for data 400
  //   console.log("errorData", errorData);
  if(errorData === 'Request failed with status code 400' || errorData === 'timeout of 60000ms exceeded'){
      let errorData = "Transaction submission failed";
      return {
          type: OPEN_ERROR_MODAL,
          errorData,
      };
  }else if(errorData && errorData != undefined){
      if(errorData.data != undefined){
          if(errorData.data.status === 400 ){
              let errorData = "Transaction submission failed";
              return {
                  type: OPEN_ERROR_MODAL,
                  errorData,
              };
          }else if(errorData.data.title === 'Internal Server Error' || errorData.data.status === 500){
              let errorData = "Internal Server Error";
              return {
                  type: OPEN_ERROR_MODAL,
                  errorData,
              };
          }else if(errorData.data.type === 'before_history') {
              let errorData = "Data Requested Is Before Recorded History";
              return {
                  type: OPEN_ERROR_MODAL,
                  errorData,
              };
          }else if(errorData.data.type === 'forbidden' || errorData.data.status === 403) {
              let errorData = "Forbidden";
              return {
                  type: OPEN_ERROR_MODAL,
                  errorData,
              };
          }else if(errorData.data.type === 'bad_request') {
              let errorData = "Bad Request";
              return {
                  type: OPEN_ERROR_MODAL,
                  errorData,
              };
          }else if(errorData.data.type === 'not_found' || errorData.data.status === 404) {
              let errorData = "The resource at the url requested was not found.";
              return {
                  type: OPEN_ERROR_MODAL,
                  errorData,
              };
          }else if(errorData.data.type === 'transaction_malformed'){
              let errorData = "Transaction Malformed";
              return {
                  type: OPEN_ERROR_MODAL,
                  errorData,
              };
          }else if(errorData.data.type === 'not_implemented' || errorData.data.status === 404){
              let errorData = "Resource Not Yet Implemented";
              return {
                  type: OPEN_ERROR_MODAL,
                  errorData,
              };
          }else if(errorData.data.type === 'stale_history' || errorData.data.status === 503){
              let errorData = "Historical DB Is Too Stale";
              return {
                  type: OPEN_ERROR_MODAL,
                  errorData,
              };
          }else if(errorData.data.title === 'Rate Limit Exceeded' || errorData.data.status  === 429){
              let errorData = "Rate Limit Exceeded";
              return {
                  type: OPEN_ERROR_MODAL,
                  errorData,
              };
          }else if(errorData.data.type === 'not_acceptable' || errorData.data.status === 406){
              let errorData = "An acceptable response content-type could not be provided for this request";
              return {
                  type: OPEN_ERROR_MODAL,
                  errorData,
              };
          } else{
              return {
                  type: OPEN_ERROR_MODAL,
                  errorData,
              };
          }
      }else{
          let defaultErrorData = 'Please, check the correctness of the input and try again.';
          errorData = defaultErrorData;
          return {
              type: OPEN_ERROR_MODAL,
              errorData,
          };
      }

  } else{
      let defaultErrorData = 'Please, check the correctness of the input and try again.';
      errorData = defaultErrorData;
      return {
          type: OPEN_ERROR_MODAL,
          errorData,
      };
  }



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
