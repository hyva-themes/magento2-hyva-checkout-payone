import { useCallback } from 'react';

import usePerformPlaceOrder from '../../../hooks/usePerformPlaceOrder';

export default function usePayOnePayPal(paymentMethodCode) {
  const performPlaceOrder = usePerformPlaceOrder(paymentMethodCode);

  return useCallback(values => performPlaceOrder(values), [performPlaceOrder]);
}
