import _get from 'lodash.get';
import _set from 'lodash.set';

import { LOGIN_FORM, PAYMENT_METHOD_FORM } from '../../../../../../config';
import LocalStorage from '../../../../../../utils/localStorage';
import sofortConfig from '../sofortConfig';

function cleanData(sofortValues) {
  return {
    iban: getCleanedNumber(sofortValues.iban),
    bic: getCleanedNumber(sofortValues.bic),
  };
}

function getCleanedNumber(sDirtyNumber) {
  let sCleanedNumber = '';
  let sTmpChar;
  for (let i = 0; i < sDirtyNumber.length; i += 1) {
    sTmpChar = sDirtyNumber.charAt(i);
    if (
      sTmpChar !== ' ' &&
      (!Number.isNaN(sTmpChar) || /^[A-Za-z]/.test(sTmpChar))
    ) {
      if (/^[a-z]/.test(sTmpChar)) {
        sTmpChar = sTmpChar.toUpperCase();
      }
      sCleanedNumber += sTmpChar;
    }
  }
  return sCleanedNumber;
}

export function prepareSetPaymentMethodData(values, cartId, paymentMethodCode) {
  const sofortValues = sofortConfig.requestIbanBic
    ? cleanData(_get(values, `${PAYMENT_METHOD_FORM}.payone.sofort`))
    : {};
  const email = _get(values, `${LOGIN_FORM}.email`);
  const isLoggedIn = !!LocalStorage.getCustomerToken();

  const paymentMethod = {
    paymentMethod: {
      method: paymentMethodCode,
      additional_data: { ...sofortValues },
      extension_attributes: { agreement_ids: ['1', '2'] },
    },
  };

  if (isLoggedIn) {
    _set(paymentMethod, 'cartId', cartId);
  } else {
    _set(paymentMethod, 'email', email);
  }

  return paymentMethod;
}
