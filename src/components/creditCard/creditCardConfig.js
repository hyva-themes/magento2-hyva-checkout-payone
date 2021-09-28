import _get from 'lodash.get';
import RootElement from '@hyva/react-checkout/utils/rootElement';
import LocalStorage from '@hyva/react-checkout/utils/localStorage';

import { PAYMENT_METHOD_FORM } from '../../../../../config';

const config = RootElement.getPaymentConfig();
const inputStyles =
  'width:100%;border: 1px solid #e2e8f0; padding: .5rem .75rem;margin:0;min-height:24px;border-radius:0.25rem;font-size: 1rem;line-height: 1.5;';
const selectStyles =
  'width:100%;border: 1px solid #e2e8f0; padding: .5rem .75rem;margin:0;min-height:24px;border-radius:0.25rem;font-size: 1rem;line-height: 1.5;';
const iframe = { height: '50px', width: '100%' };
const payOne = config.payone;
const {
  checkCvc,
  fieldConfig,
  hostedRequest,
  ccMinValidity,
  savedPaymentData,
  saveCCDataEnabled,
  availableCardTypes,
} = payOne;

const paymentConfig = {
  fieldConfig: {
    ...fieldConfig,
    fields: {
      ...fieldConfig.fields,
      cardexpiremonth: {
        ...fieldConfig.fields.cardexpiremonth,
        iframe,
      },
      cardexpireyear: {
        ...fieldConfig.fields.cardexpireyear,
        iframe,
      },
    },
    defaultStyle: {
      ...fieldConfig.defaultStyle,
      iframe,
      input: inputStyles,
      select: selectStyles,
    },
  },
  checkCvc,
  ccMinValidity,
  savedPaymentData,
  availableCardTypes,
  request: hostedRequest,
  isAutoCardtypeDetectionEnabled: !!fieldConfig.autoCardtypeDetection,

  isSaveDataEnabled() {
    return saveCCDataEnabled && !!LocalStorage.getCustomerToken();
  },

  useSavedData() {
    return paymentConfig.isSaveDataEnabled() && !!savedPaymentData.length;
  },

  isSavedPaymentDataUsed(values) {
    const selectedCard = _get(values, `${PAYMENT_METHOD_FORM}.selectedCard`);

    return paymentConfig.useSavedData() && selectedCard !== 'new';
  },

  getDefaultSavedCard() {
    return paymentConfig.savedPaymentData.find(
      (payment) => Number(payment.is_default) === 1
    );
  },

  getCardPan(entity) {
    return _get(entity, 'payment_data.cardpan');
  },
};

export default paymentConfig;
