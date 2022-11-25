import _get from 'lodash.get';

import RootElement from '../../../../../utils/rootElement';

const paymentMethodCode = 'payone_obt_sofortueberweisung';
const config = RootElement.getPaymentConfig();
const payOne = _get(config, 'payone');

const sofortConfig = {
  paymentHintText: _get(payOne, 'paymentHintText'),
  agreementMessage: _get(payOne, 'agreementMessage', ''),
  requestIbanBic: _get(payOne, 'requestIbanBicSofortUeberweisung'),
  instructions: _get(config, `instructions.${paymentMethodCode}`, ''),
};

sofortConfig.canShow =
  sofortConfig.paymentHintText ||
  sofortConfig.agreementMessage ||
  sofortConfig.requestIbanBic ||
  sofortConfig.instructions;


export default sofortConfig;
