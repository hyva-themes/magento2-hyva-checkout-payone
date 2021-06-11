import _get from 'lodash.get';
import { __ } from '../../../../../i18n';

import RootElement from '../../../../../utils/rootElement';

const paymentMethodCode = 'payone_obt_ideal';

const config = RootElement.getPaymentConfig();
const payOne = _get(config, 'payone');
const bankGroups = _get(payOne, 'idealBankGroups', []);
const canShowPaymentHintText = !!_get(payOne, 'canShowPaymentHintText');
const canShowAgreementMsg = !!_get(payOne, 'canShowAgreementMessage');
const consumerScoreEnabledMethods = _get(
  payOne,
  'consumerScoreEnabledMethods',
  []
);
const canShowAgreementMessage =
  canShowAgreementMsg &&
  !consumerScoreEnabledMethods.includes(paymentMethodCode);
const isAgreementVisible = canShowPaymentHintText || canShowAgreementMessage;

const idealConfig = {
  bankGroupOptions: bankGroups.map(({ id, title }) => ({
    value: id,
    label: __(title),
  })),
  instructions: _get(config, `instructions.${paymentMethodCode}`, ''),
  paymentHintText: _get(payOne, 'paymentHintText'),
  agreementMessage: _get(payOne, 'agreementMessage', ''),
  isAgreementVisible,
  canShowPaymentText: isAgreementVisible && canShowPaymentHintText,
  canShowBoniAgreement: isAgreementVisible && canShowAgreementMessage,
};

export default idealConfig;
