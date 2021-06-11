import _get from 'lodash.get';

import RootElement from '../../../../../utils/rootElement';

const paymentMethodCode = 'obt_sofortueberweisung';

const config = RootElement.getPaymentConfig();
const payOne = _get(config, 'payment.payone');
console.log(
  "CHECK IF IS GETTING THE CONFIG OR SHOULD REMOVE 'payment.'",
  _get(payOne, 'requestIbanBicSofortUeberweisung'),
  config
);

const sofortConfig = {
  instructions: _get(config, `instructions.${paymentMethodCode}`, ''),
  paymentHintText: _get(payOne, 'paymentHintText'),
  agreementMessage: _get(payOne, 'agreementMessage', ''),
  requestIbanBic: _get(payOne, 'requestIbanBicSofortUeberweisung'),
};

export default sofortConfig;
