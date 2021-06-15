import _get from 'lodash.get';

import RootElement from '../../../../../utils/rootElement';
import { getPayOneBaseConfig } from '../../utility/payOneBaseConfig';

const paymentMethodCode = 'payone_paydirekt';
const baseConfig = getPayOneBaseConfig(paymentMethodCode);
const config = RootElement.getPaymentConfig();
const payOne = _get(config, 'payone');

const payDirektConfig = {
  ...baseConfig,
  isPayDirektOnKlickEnabled: !!_get(payOne, 'isPaydirektOneKlickDisplayable'),
};

export default payDirektConfig;
