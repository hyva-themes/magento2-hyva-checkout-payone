import { getPayOneBaseConfig } from '../../utility/payOneBaseConfig';

const paymentMethodCode = 'payone_invoice';
const baseConfig = getPayOneBaseConfig(paymentMethodCode);

const invoiceConfig = {
  ...baseConfig,
};

export default invoiceConfig;
