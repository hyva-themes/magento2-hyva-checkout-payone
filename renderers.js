import Ideal from './src/components/iDEAL';
import CreditCard from './src/components/creditCard';
import Sofort from './src/components/sofort';
import PayPal from './src/components/paypal';
import GiroPay from './src/components/giropay';

export default {
  payone_creditcard: CreditCard,
  payone_obt_giropay: GiroPay,
  payone_obt_ideal: Ideal,
  payone_obt_sofortueberweisung: Sofort,
  payone_paypal: PayPal,
};
