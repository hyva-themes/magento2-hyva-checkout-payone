import { useContext } from 'react';

import { PaymentMethodFormContext } from '../../../../components/paymentMethod/context';

export default function usePayOnePaymentMethodContext() {
  return useContext(PaymentMethodFormContext);
}
