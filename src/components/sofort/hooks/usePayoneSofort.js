import { useCallback } from 'react';
import _get from 'lodash.get';
import LocalStorage from '../../../../../../utils/localStorage';
import { config, PAYMENT_METHOD_FORM } from '../../../../../../config';
import usePayOneCartContext from '../../../hooks/usePayOneCartContext';
import usePayOneAppContext from '../../../hooks/usePayOneAppContext';
import { prepareSetPaymentMethodData } from '../utility';
import { __ } from '../../../../../../i18n';
import sofortConfig from '../sofortConfig';

export default function usePayoneSofort(paymentMethodCode) {
  const { cartId, setRestPaymentMethod } = usePayOneCartContext();
  const { setPageLoader, setErrorMessage } = usePayOneAppContext();

  const placeOrder = useCallback(
    async values => {
      const isLoggedIn = !!LocalStorage.getCustomerToken();
      const { bic, iban } = _get(
        values,
        `${PAYMENT_METHOD_FORM}.payone.sofort`
      );

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
        setErrorMessage(__('Something went wrong.'));
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
    placeOrder,
  };
}
