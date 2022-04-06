import { useCallback } from 'react';
import _get from 'lodash.get';

import { PAYMENT_METHOD_FORM } from '../../../../../../config';
import usePerformPlaceOrder from '../../../hooks/usePerformPlaceOrder';

const epsBankGroupField = `${PAYMENT_METHOD_FORM}.payone.eps.bankGroup`;

export default function usePayOneEPS(paymentMethodCode) {
  const performPlaceOrder = usePerformPlaceOrder(paymentMethodCode);

  const placeOrderWithEPS = useCallback(
    async (values) => {
      const bankGroup = _get(values, epsBankGroupField);
      const additionalData = { bank_group: bankGroup };

      await performPlaceOrder(values, additionalData);
    },
    [performPlaceOrder]
  );

  return { placeOrderWithEPS };
}
