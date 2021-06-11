import { useCallback } from 'react';
import _get from 'lodash.get';
import _set from 'lodash.set';

import usePayOneAppContext from '../../../hooks/usePayOneAppContext';
import usePayOneCartContext from '../../../hooks/usePayOneCartContext';
import { __ } from '../../../../../../i18n';
import { performRedirect } from '../../../utility';
import { LOGIN_FORM, PAYMENT_METHOD_FORM } from '../../../../../../config';

const idealBankGroupField = `${PAYMENT_METHOD_FORM}.payone.ideal.bankGroup`;

export default function usePayOneIdeal(paymentMethodCode) {
  const { isLoggedIn, setErrorMessage, setPageLoader } = usePayOneAppContext();
  const { setRestPaymentMethod } = usePayOneCartContext();

  const placeOrderWithIdeal = useCallback(
    async values => {
      try {
        const email = _get(values, `${LOGIN_FORM}.email`);
        const bankGroup = _get(values, idealBankGroupField);
        const paymentMethodData = {
          paymentMethod: {
            method: paymentMethodCode,
            additional_data: {
              bank_group: bankGroup,
            },
          },
        };

        if (!isLoggedIn) {
          _set(paymentMethodData, 'email', email);
        }

        setPageLoader(true);
        const order = await setRestPaymentMethod(paymentMethodData, isLoggedIn);
        setPageLoader(false);
        performRedirect(order);
      } catch (error) {
        console.error(error);
        setErrorMessage(
          __(
            'This transaction could not be performed. Please select another payment method.'
          )
        );
        setPageLoader(false);
      }
    },
    [
      isLoggedIn,
      paymentMethodCode,
      setRestPaymentMethod,
      setErrorMessage,
      setPageLoader,
    ]
  );

  return { placeOrderWithIdeal };
}
