import { useCallback } from 'react';
import _get from 'lodash.get';

import { PAYMENT_METHOD_FORM } from '../../../../../../config';
import usePerformPlaceOrder from '../../../hooks/usePerformPlaceOrder';

const idealBankGroupField = `${PAYMENT_METHOD_FORM}.payone.ideal.bankGroup`;

export default function usePayOneIdeal(paymentMethodCode) {
  const performPlaceOrder = usePerformPlaceOrder(paymentMethodCode);

  const placeOrderWithIdeal = useCallback(
    async (values) => {
      const bankGroup = _get(values, idealBankGroupField);
      const additionalData = { bank_group: bankGroup };

      await performPlaceOrder(values, additionalData);
    },
    [performPlaceOrder]
  );

  return { placeOrderWithIdeal };
}
