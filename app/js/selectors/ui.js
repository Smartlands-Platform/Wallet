import { createSelector } from 'reselect';
import { selectProperty } from '../helpers/redux';
import { asyncSelectorObject } from '../helpers/asyncActions/selectors';
import { UI_STATE_KEY } from '../constants/reducerKeys';
import { ASYNC_SEND_OPERATION, ASYNC_CREATE_TRUSTLINE } from '../constants/asyncActions';

export const getDestinationTrustlines = selectProperty([UI_STATE_KEY, 'destinationTruslines'], []);


export const isModalKeypairOpen = selectProperty([UI_STATE_KEY, 'modalKeypair'], false);
export const getModalErrorOpen = selectProperty([UI_STATE_KEY, 'errorOpen'], false);
export const getModalErrorData = selectProperty([UI_STATE_KEY, 'errorData'], '');

export const isSendingPayment = asyncSelectorObject(ASYNC_SEND_OPERATION).isLoading;

export const isSendingPaymentData = asyncSelectorObject(ASYNC_SEND_OPERATION).data;
export const isCreatingTrustline = asyncSelectorObject(ASYNC_CREATE_TRUSTLINE).isLoading;

export const isSendingOffer = selectProperty([UI_STATE_KEY, 'sendingOffer'], false);
export const isToggleNavigation = selectProperty([UI_STATE_KEY, 'toggle'], false);

export const isPriceData = selectProperty([UI_STATE_KEY, 'priceData'], false);

export const issellBuy = selectProperty([UI_STATE_KEY, 'sellBuy'], false);

export const isOrderbookIsChanged = selectProperty([UI_STATE_KEY, 'isChange'], false);

export const toggleNav = createSelector(
    isToggleNavigation,
    toggle => toggle,
);

export const priceDat = createSelector(
    isPriceData,
    priceData => priceData,
);

export const sellBuyDat = createSelector(
    issellBuy,
    sellBuyData => sellBuyData,
);

export const getOrdebookIsChanged = createSelector(
    isOrderbookIsChanged,
    isChange => isChange,
);