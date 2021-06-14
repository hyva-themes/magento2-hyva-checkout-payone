import _get from 'lodash.get';

import RootElement from '../../../../../utils/rootElement';

const paymentMethodCode = 'obt_sofortueberweisung';
const config = RootElement.getPaymentConfig();
const payOne = _get(config, 'payment.payone');

const sofortConfig = {
  instructions: _get(config, `instructions.${paymentMethodCode}`, ''),
  paymentHintText: _get(payOne, 'paymentHintText'),
  agreementMessage: _get(payOne, 'agreementMessage', ''),
  requestIbanBic: _get(payOne, 'requestIbanBicSofortUeberweisung'),
};

export default sofortConfig;
