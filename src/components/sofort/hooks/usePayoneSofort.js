import { useCallback } from 'react';
import _get from 'lodash.get';
import { __ } from '@hyva/react-checkout/i18n';

import sofortConfig from '../sofortConfig';
import { prepareSetPaymentMethodData } from '../utility';
import { PAYMENT_METHOD_FORM } from '../../../../../../config';
import usePayOneAppContext from '../../../hooks/usePayOneAppContext';
import usePerformPlaceOrder from '../../../hooks/usePerformPlaceOrder';

const sofortField = `${PAYMENT_METHOD_FORM}.payone.sofort`;

export default function usePayoneSofort(paymentMethodCode) {
  const { setErrorMessage } = usePayOneAppContext();
  const performPlaceOrder = usePerformPlaceOrder(paymentMethodCode);

  const placeOrderWithSofort = useCallback(
    async (values) => {
      if (sofortConfig.requestIbanBic) {
        const { bic, iban } = _get(values, sofortField);

        if (!bic || bic === '') {
          setErrorMessage(__('Please enter a valid BIC.'));
          return;
        }

        if (!iban || iban === '') {
          setErrorMessage(__('Please enter a valid IBAN.'));
          return;
        }
      }

      const extensionAttributes = { agreement_ids: ['1', '2'] };
      const additionalData = prepareSetPaymentMethodData(values);

      await performPlaceOrder(values, additionalData, extensionAttributes);
    },
    [performPlaceOrder, setErrorMessage]
  );

  return {
    placeOrderWithSofort,
  };
}
