import _get from 'lodash.get';

import RootElement from '../../../../utils/rootElement';

const config = RootElement.getPaymentConfig();
const payOne = _get(config, 'payone');
const canShowPaymentHintText = !!_get(payOne, 'canShowPaymentHintText');
const canShowAgreementMsg = !!_get(payOne, 'canShowAgreementMessage');
const consumerScoreEnabledMethods = _get(
  payOne,
  'consumerScoreEnabledMethods',
  []
);

export function getPayOneBaseConfig(paymentMethodCode) {
  const canShowAgreementMessage =
    canShowAgreementMsg &&
    !consumerScoreEnabledMethods.includes(paymentMethodCode);
  const isAgreementVisible = canShowPaymentHintText || canShowAgreementMessage;

  const baseConfig = {
    instructions: _get(config, `instructions.${paymentMethodCode}`, ''),
    paymentHintText: _get(payOne, 'paymentHintText'),
    agreementMessage: _get(payOne, 'agreementMessage', ''),
    isAgreementVisible,
    canShowPaymentText: isAgreementVisible && canShowPaymentHintText,
    canShowBoniAgreement: isAgreementVisible && canShowAgreementMessage,
  };

  return baseConfig;
}
