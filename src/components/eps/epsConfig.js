import _get from 'lodash.get';

import { __ } from '../../../../../i18n';
import RootElement from '../../../../../utils/rootElement';
import { getPayOneBaseConfig } from '../../utility/payOneBaseConfig';

const paymentMethodCode = 'payone_obt_eps';
const config = RootElement.getPaymentConfig();
const payOne = _get(config, 'payone');
const bankGroups = _get(payOne, 'epsBankGroups', []);
const baseConfig = getPayOneBaseConfig(paymentMethodCode);

const epsConfig = {
  ...baseConfig,
  bankGroupOptions: bankGroups.map(({ id, title }) => ({
    value: id,
    label: __(title),
  })),
};

export default epsConfig;
