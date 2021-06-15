import { getPayOneBaseConfig } from '../../utility/payOneBaseConfig';

const paymentMethodCode = 'payone_paydirekt';
const baseConfig = getPayOneBaseConfig(paymentMethodCode);

const payDirektConfig = {
  ...baseConfig,
};

export default payDirektConfig;
