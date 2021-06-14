import { getPayOneBaseConfig } from '../../utility/payOneBaseConfig';

const paymentMethodCode = 'payone_paypal';
const baseConfig = getPayOneBaseConfig(paymentMethodCode);

const paypalConfig = {
  ...baseConfig,
};

export default paypalConfig;
