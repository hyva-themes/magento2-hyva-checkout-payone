import { useEffect, useState } from 'react';
import _get from 'lodash.get';
import { useFormikContext } from 'formik';

import { PAYMENT_METHOD_FORM } from '../../../../../../config';
import paymentConfig from '../paymentConfig';

const cardTypeField = `${PAYMENT_METHOD_FORM}.additional_data.cardtype`;

export default function useCardTypeDetection() {
  const [cardTypeDetected, setCardTypeDetected] = useState('');
  const { setFieldValue } = useFormikContext();

  useEffect(() => {
    if (paymentConfig.fieldConfig.autoCardtypeDetection) {
      paymentConfig.fieldConfig.autoCardtypeDetection.callback = newCardTypeDetected => {
        setFieldValue(cardTypeField, newCardTypeDetected.toUpperCase());
        setCardTypeDetected(newCardTypeDetected.toUpperCase());
      };

      const initialCardType = _get(
        paymentConfig,
        'fieldConfig.autoCardtypeDetection.supportedCardtypes.0'
      );

      setFieldValue(cardTypeField, initialCardType);
      setCardTypeDetected(initialCardType);
    }
  }, [setFieldValue]);

  return { cardTypeDetected, setCardTypeDetected };
}
