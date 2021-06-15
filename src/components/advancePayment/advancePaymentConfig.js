import { getPayOneBaseConfig } from '../../utility/payOneBaseConfig';

const paymentMethodCode = 'payone_advance_payment';
const baseConfig = getPayOneBaseConfig(paymentMethodCode);

const advancePaymentConfig = {
  ...baseConfig,
};

export default advancePaymentConfig;
