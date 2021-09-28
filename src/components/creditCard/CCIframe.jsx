import React from 'react';
import _get from 'lodash.get';
import { string } from 'prop-types';
import { __ } from '@hyva/react-checkout/i18n';

import Checkbox from '@hyva/react-checkout/components/common/Form/Checkbox';
import creditCardConfig from './creditCardConfig';
import { PAYMENT_METHOD_FORM } from '../../../../../config';
import usePayOnePaymentMethodContext from '../../hooks/usePayOnePaymentMethodContext';

let { availableCardTypes } = creditCardConfig;
const { isAutoCardtypeDetectionEnabled } = creditCardConfig;

function getCardTypeImageUrl(imageId) {
  return `https://cdn.pay1.de/cc/${imageId}/s/default.png`;
}

const saveDataField = 'payone.cc.additional_data.saveData';

function CCIframe({ detectedCardType }) {
  const { paymentValues, formikData } = usePayOnePaymentMethodContext();
  const saveData = !!_get(paymentValues, saveDataField);
  let detectedCard;

  if (isAutoCardtypeDetectionEnabled) {
    detectedCard = creditCardConfig.availableCardTypes.find(
      (cardType) => cardType.id.toUpperCase() === detectedCardType
    );

    if (detectedCard) {
      availableCardTypes = [detectedCard];
    }
  }

  return (
    <>
      <div className="mt-2">
        <div className="flex justify-between mb-2">
          <label htmlFor="cardpan" className="md:text-sm">
            {__('Credit Card Number')}
          </label>
          <div className="flex space-x-2">
            {isAutoCardtypeDetectionEnabled &&
              availableCardTypes.map((cardType) => (
                <img
                  key={cardType.id}
                  alt={cardType.title}
                  className="w-auto h-3"
                  src={getCardTypeImageUrl(cardType.id.toLowerCase())}
                />
              ))}
          </div>
        </div>
        <div id="cardpan" className="inputIframe" />
      </div>

      <div>
        <label htmlFor="cardexpiremonth" className="md:text-sm">
          {__('Expiration Date')}
        </label>
        <div className="flex justify-between">
          <div className="w-2/5" id="cardexpiremonth" />
          <div className="w-2/5" id="cardexpireyear" />
        </div>
      </div>

      {creditCardConfig.checkCvc && (
        <div>
          <label htmlFor="cardcvc2" className="md:text-sm">
            {__('Card Verification Number')}
          </label>
          <div id="cardcvc2" className="inputIframe" />
        </div>
      )}

      {creditCardConfig.isSaveDataEnabled() && (
        <Checkbox
          isChecked={saveData}
          formikData={formikData}
          name={`${PAYMENT_METHOD_FORM}.${saveDataField}`}
          label={__('Save the payment data for future use.')}
        />
      )}
    </>
  );
}

CCIframe.propTypes = {
  detectedCardType: string.isRequired,
};

export default CCIframe;
