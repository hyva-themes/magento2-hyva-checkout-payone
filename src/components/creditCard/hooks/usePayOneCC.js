import { useCallback } from 'react';

import usePayOneCartContext from '../../../hooks/usePayOneCartContext';
import usePayOneAppContext from '../../../hooks/usePayOneAppContext';
import creditCardConfig from '../creditCardConfig';
import { __ } from '../../../../../../i18n';
import LocalStorage from '../../../../../../utils/localStorage';
import {
  isMinValidityCorrect,
  prepareSetPaymentMethodData,
  validate,
} from '../utility';
import { performRedirect } from '../../../utility';

export default function usePayOneCC(paymentMethodCode) {
  const { cartId, setRestPaymentMethod } = usePayOneCartContext();
  const { setErrorMessage, setPageLoader } = usePayOneAppContext();

  const placeOrder = useCallback(
    async (response, values) => {
      const isLoggedIn = !!LocalStorage.getCustomerToken();
      const paymentMethod = prepareSetPaymentMethodData(
        response,
        values,
        cartId,
        paymentMethodCode
      );

      setPageLoader(true);
      const order = await setRestPaymentMethod(paymentMethod, isLoggedIn);
      setPageLoader(false);

      performRedirect(order);
    },
    [setRestPaymentMethod, setPageLoader, cartId, paymentMethodCode]
  );

  const processPayoneResponseCCHosted = useCallback(
    async (response, values) => {
      if (response.status === 'VALID') {
        if (!isMinValidityCorrect(response.cardexpiredate)) {
          setErrorMessage(__('Invalid expiration date.'));
          setPageLoader(false);
          return;
        }
        await placeOrder(response, values);
      } else if (response.status === 'INVALID') {
        setErrorMessage(__(response.errormessage));
        setPageLoader(false);
      } else if (response.status === 'ERROR') {
        setErrorMessage(__(response.errormessage));
        setPageLoader(false);
      }
    },
    [setErrorMessage, setPageLoader, placeOrder]
  );

  const handleCreditCardCheckThenPlaceOrder = useCallback(
    async values => {
      const { isValid, message } = validate(values);

      if (!isValid) {
        setErrorMessage(message);
        setPageLoader(false);
        return false;
      }

      if (creditCardConfig.isSavedPaymentDataUsed(values)) {
        await placeOrder({}, values);
        return false;
      }

      // PayOne Request if the data is valid
      if (window.iframes.isComplete()) {
        setPageLoader(true);
        window.processPayoneResponseCCHosted = async response => {
          await processPayoneResponseCCHosted(response, values);
        };
        window.iframes.creditCardCheck('processPayoneResponseCCHosted');
      }
      return true;
    },
    [processPayoneResponseCCHosted, setErrorMessage, setPageLoader, placeOrder]
  );

  return {
    handleCreditCardCheckThenPlaceOrder,
  };
}
