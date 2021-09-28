import { useCallback } from 'react';
import _get from 'lodash.get';
import { __ } from '@hyva/react-checkout/i18n';

import debitConfig from '../debitConfig';
import { performRedirect } from '../../../utility';
import ResponseUtility from '../utility/responseUtility';
import usePayOneAppContext from '../../../hooks/usePayOneAppContext';
import usePerformPlaceOrder from '../../../hooks/usePerformPlaceOrder';
import { bicField, debitCountryField, ibanField, validate } from '../utility';

export default function usePayOneDebit(paymentMethodCode) {
  const { setErrorMessage, setPageLoader } = usePayOneAppContext();
  const performPlaceOrder = usePerformPlaceOrder(paymentMethodCode);

  const performPlaceOrderWithDebit = useCallback(
    async (values) => {
      const bic = _get(values, bicField);
      const iban = _get(values, ibanField);
      const bankCountry = _get(values, debitCountryField);

      const additionalData = {
        bic,
        iban,
        bank_country: bankCountry,
      };

      const order = await performPlaceOrder(values, additionalData);
      performRedirect(order);
    },
    [performPlaceOrder]
  );

  const processPayOneResponseELV = useCallback(
    async (response, values) => {
      const responseUtil = new ResponseUtility(response);

      if (responseUtil.isValid()) {
        debitConfig.setBankCodeValidateAndValid(true);
        await performPlaceOrderWithDebit(values);
      } else if (responseUtil.isBlocked()) {
        setErrorMessage(debitConfig.blockedMessage);
      } else {
        setErrorMessage(__(responseUtil.getMessage()));
      }
    },
    [performPlaceOrderWithDebit, setErrorMessage]
  );

  const handleBankAccountCheck = useCallback(
    (values) => {
      const iban = _get(values, ibanField);
      const oBasicRequest = {
        ...debitConfig.bankAccountCheckRequest,
        iban,
      };

      if (debitConfig.requestBic) {
        oBasicRequest.bic = _get(values, bicField);
      }

      window.processPayOneResponseELV =
        window.processPayOneResponseELV ||
        ((response) => processPayOneResponseELV(response, values));

      const options = {
        return_type: 'object',
        callback_function_name: 'processPayOneResponseELV',
      };

      // eslint-disable-next-line no-undef
      const request = new PayoneRequest(oBasicRequest, options);
      request.checkAndStore();
    },
    [processPayOneResponseELV]
  );

  return useCallback(
    async (values) => {
      try {
        setPageLoader(true);

        if (debitConfig.isManageMandateActive) {
          const isValid = await validate(values);

          if (!isValid) {
            return;
          }

          if (debitConfig.needToValidateBankCode) {
            handleBankAccountCheck(values);
            return;
          }
        }

        await performPlaceOrderWithDebit(values);
        setPageLoader(false);
      } catch (error) {
        console.error(error);
        setErrorMessage(error.message);
        setPageLoader(false);
      }
    },
    [
      setPageLoader,
      setErrorMessage,
      handleBankAccountCheck,
      performPlaceOrderWithDebit,
    ]
  );
}
