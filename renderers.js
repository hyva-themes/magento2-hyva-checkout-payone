import EPS from './src/components/eps';
import Ideal from './src/components/iDEAL';
import Sofort from './src/components/sofort';
import PayPal from './src/components/paypal';
import GiroPay from './src/components/giropay';
import Invoice from './src/components/safeInvoice';
import PayDirekt from './src/components/paydirekt';
import CreditCard from './src/components/creditCard';

export default {
  payone_obt_eps: EPS,
  payone_paypal: PayPal,
  payone_obt_ideal: Ideal,
  payone_obt_giropay: GiroPay,
  payone_paydirekt: PayDirekt,
  payone_safe_invoice: Invoice,
  payone_creditcard: CreditCard,
  payone_obt_sofortueberweisung: Sofort,
};
