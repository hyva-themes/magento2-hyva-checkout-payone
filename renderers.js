import Ideal from './src/components/iDEAL';
import CreditCard from './src/components/creditCard';
import Sofort from './src/components/sofort';
import PayPal from './src/components/paypal';

export default {
  payone_creditcard: CreditCard,
  payone_obt_sofortueberweisung: Sofort,
  payone_obt_ideal: Ideal,
  payone_paypal: PayPal,
};
