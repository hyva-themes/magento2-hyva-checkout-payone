import { useCallback, useEffect, useState } from 'react';
import { useFormikContext } from 'formik';

import { additionalDataField, selectedCardField } from '../utility';

export default function usePayOneCCFormInitialize() {
  const [isFormInitialized, setIsFormInitialized] = useState(false);
  const { setFieldValue } = useFormikContext();

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
