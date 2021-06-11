import { useCallback } from 'react';
import _get from 'lodash.get';

import usePayOneAppContext from '../../../hooks/usePayOneAppContext';
import usePayOneCartContext from '../../../hooks/usePayOneCartContext';
import sofortConfig from '../sofortConfig';
import { __ } from '../../../../../../i18n';
import { prepareSetPaymentMethodData } from '../utility';
import LocalStorage from '../../../../../../utils/localStorage';
import { config, PAYMENT_METHOD_FORM } from '../../../../../../config';

const sofortField = `${PAYMENT_METHOD_FORM}.payone.sofort`;

export default function usePayoneSofort(paymentMethodCode) {
  const { cartId, setRestPaymentMethod } = usePayOneCartContext();
  const { setPageLoader, setErrorMessage } = usePayOneAppContext();

  const placeOrderWithSofort = useCallback(
    async values => {
      const isLoggedIn = !!LocalStorage.getCustomerToken();
      const { bic, iban } = _get(values, sofortField);

      if (sofortConfig.requestIbanBic) {
        if (!bic || bic === '') {
          setErrorMessage(__('Please enter a valid BIC.'));
          return;
        }

        if (!iban || iban === '') {
          setErrorMessage(__('Please enter a valid IBAN.'));
          return;
        }
      }

      const paymentMethod = prepareSetPaymentMethodData(
        values,
        cartId,
        paymentMethodCode
      );

      setPageLoader(true);
      const result = await setRestPaymentMethod(paymentMethod, isLoggedIn);
      setPageLoader(false);

      if (result) {
        if (result.order_number.message) {
          setErrorMessage(__(_get(result, 'order_number.message')));
          return;
        }

        if (result.order_number) {
          LocalStorage.clearCheckoutStorage();
          window.location.replace(`${config.baseUrl}/payone/onepage/redirect/`);
        }
      } else {
        setErrorMessage(
          __(
            'This transaction could not be performed. Please select another payment method.'
          )
        );
      }
    },
    [
      setRestPaymentMethod,
      cartId,
      setPageLoader,
      paymentMethodCode,
      setErrorMessage,
    ]
  );

  return {
    placeOrderWithSofort,
  };
}
