import { useEffect, useState } from 'react';
import _get from 'lodash.get';
import _set from 'lodash.set';

import { cardTypeField } from '../utility';
import creditCardConfig from '../creditCardConfig';
import usePayOnePaymentMethodContext from '../../../hooks/usePayOnePaymentMethodContext';

export default function useCardTypeDetection() {
  const [cardTypeDetected, setCardTypeDetected] = useState('');
  const { setFieldValue } = usePayOnePaymentMethodContext();

  useEffect(() => {
    if (creditCardConfig.isAutoCardtypeDetectionEnabled) {
      _set(
        creditCardConfig,
        'fieldConfig.autoCardtypeDetection.callback',
        (newCardTypeDetected) => {
          setFieldValue(cardTypeField, newCardTypeDetected.toUpperCase());
          setCardTypeDetected(newCardTypeDetected.toUpperCase());
        }
      );

      const initialCardType = _get(
        creditCardConfig,
        'fieldConfig.autoCardtypeDetection.supportedCardtypes.0'
      );

      setFieldValue(cardTypeField, initialCardType);
      setCardTypeDetected(initialCardType);
    }
  }, [setFieldValue]);

  return { cardTypeDetected, setCardTypeDetected };
}
