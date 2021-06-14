import { getPayOneBaseConfig } from '../../utility/payOneBaseConfig';

const paymentMethodCode = 'payone_obt_giropay';
const baseConfig = getPayOneBaseConfig(paymentMethodCode);

const giroPayConfig = {
  ...baseConfig,
};

export default giroPayConfig;
