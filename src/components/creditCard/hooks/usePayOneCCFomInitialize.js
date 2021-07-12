import { useCallback, useEffect, useState } from 'react';

import { additionalDataField, selectedCardField } from '../utility';
import usePayOnePaymentMethodContext from '../../../hooks/usePayOnePaymentMethodContext';

export default function usePayOneCCFormInitialize() {
  const [isFormInitialized, setIsFormInitialized] = useState(false);
  const { setFieldValue } = usePayOnePaymentMethodContext();

  const setSelectedCard = useCallback(
    card => setFieldValue(selectedCardField, card),
    [setFieldValue]
  );

  useEffect(() => {
    setFieldValue(selectedCardField, '');
    setFieldValue(additionalDataField, {});
    setIsFormInitialized(true);
  }, [setFieldValue]);

  return {
    isFormInitialized,
    setIsFormInitialized,
    setSelectedCard,
  };
}
