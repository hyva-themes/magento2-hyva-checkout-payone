import _get from 'lodash.get';

import sofortConfig from '../sofortConfig';
import { PAYMENT_METHOD_FORM } from '../../../../../../config';

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

function cleanData(sofortValues) {
  return {
    iban: getCleanedNumber(sofortValues.iban),
    bic: getCleanedNumber(sofortValues.bic),
  };
}

export function prepareSetPaymentMethodData(values) {
  return sofortConfig.requestIbanBic
    ? cleanData(_get(values, `${PAYMENT_METHOD_FORM}.payone.sofort`))
    : {};
}
