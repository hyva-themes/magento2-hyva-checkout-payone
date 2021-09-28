import _get from 'lodash.get';
import { __ } from '@hyva/react-checkout/i18n';
import RootElement from '@hyva/react-checkout/utils/rootElement';

import { getPayOneBaseConfig } from '../../utility/payOneBaseConfig';

const paymentMethodCode = 'payone_obt_ideal';
const config = RootElement.getPaymentConfig();
const payOne = _get(config, 'payone');
const bankGroups = _get(payOne, 'idealBankGroups', []);
const baseConfig = getPayOneBaseConfig(paymentMethodCode);

const idealConfig = {
  ...baseConfig,
  bankGroupOptions: bankGroups.map(({ id, title }) => ({
    value: id,
    label: __(title),
  })),
};

export default idealConfig;
