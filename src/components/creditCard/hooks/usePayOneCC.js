import { useCallback } from 'react';

import usePayOneAppContext from '../../../hooks/usePayOneAppContext';
import usePerformPlaceOrder from '../../../hooks/usePerformPlaceOrder';
import creditCardConfig from '../creditCardConfig';
import { __ } from '../../../../../../i18n';
import {
  isMinValidityCorrect,
  prepareSetPaymentMethodData,
  validate,
} from '../utility';

export default function usePayOneCC(paymentMethodCode) {
  const { setErrorMessage, setPageLoader } = usePayOneAppContext();
  const performPlaceOrder = usePerformPlaceOrder(paymentMethodCode);

  const placeOrder = useCallback(
    async (response, values) => {
      const paymentMethodData = prepareSetPaymentMethodData(response, values);

      await performPlaceOrder(values, paymentMethodData);
    },
    [performPlaceOrder]
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
