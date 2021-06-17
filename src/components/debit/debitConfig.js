import _get from 'lodash.get';
import _set from 'lodash.set';

import RootElement from '../../../../../utils/rootElement';
import { getPayOneBaseConfig } from '../../utility/payOneBaseConfig';

const paymentMethodCode = 'payone_debit';
const config = RootElement.getPaymentConfig();
const payOne = _get(config, 'payone', {}) || {};
const baseConfig = getPayOneBaseConfig(paymentMethodCode);
const {
  blockedMessage,
  validateBankCode,
  bankaccountcheckRequest,
  bankCodeValidatedAndValid,
} = payOne;

const debitConfig = {
  ...baseConfig,
  blockedMessage,
  requestBic: !!_get(payOne, 'requestBic'),
  bankAccountCheckRequest: bankaccountcheckRequest || {},
  isManageMandateActive: !!_get(payOne, 'mandateManagementActive'),
  needToValidateBankCode: validateBankCode && !bankCodeValidatedAndValid,
  getCountryList: _get(payOne, 'sepaCountries', []).map(({ id, title }) => ({
    value: id,
    label: title,
  })),

  setBankCodeValidateAndValid(validStatus) {
    _set(payOne, 'bankCodeValidatedAndValid', validStatus);
  },
};

export default debitConfig;
