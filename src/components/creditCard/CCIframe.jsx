import React from 'react';
import { string } from 'prop-types';
import _get from 'lodash.get';
import { useFormikContext } from 'formik';

import Checkbox from '../../../../../components/common/Form/Checkbox';
import paymentConfig from '../../utility/paymentConfig';
import { PAYMENT_METHOD_FORM } from '../../../../../config';
import { __ } from '../../../../../i18n';

let { availableCardTypes } = paymentConfig;
const { isAutoCardtypeDetectionEnabled } = paymentConfig;

function getCardTypeImageUrl(imageId) {
  return `https://cdn.pay1.de/cc/${imageId}/s/default.png`;
}

const saveDataField = `${PAYMENT_METHOD_FORM}.additional_data.saveData`;

function CCIframe({ detectedCardType }) {
  const { values } = useFormikContext();
  const saveData = !!_get(values, saveDataField);
  let detectedCard;

  if (isAutoCardtypeDetectionEnabled) {
    detectedCard = paymentConfig.availableCardTypes.find(
      cardType => cardType.id.toUpperCase() === detectedCardType
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
              availableCardTypes.map(cardType => (
                <img
                  key={cardType.id}
                  alt={cardType.title}
                  src={getCardTypeImageUrl(cardType.id.toLowerCase())}
                  className="w-auto h-3"
                />
              ))}
          </div>
        </div>
        <div id="cardpan" className="inputIframe"></div>
      </div>

      <div>
        <label htmlFor="cardexpiremonth" className="md:text-sm">
          {__('Expiration Date')}
        </label>
        <div className="flex justify-between">
          <div className="w-2/5" id="cardexpiremonth"></div>
          <div className="w-2/5" id="cardexpireyear"></div>
        </div>
      </div>

      {paymentConfig.checkCvc && (
        <div>
          <label htmlFor="cardcvc2" className="md:text-sm">
            {__('Card Verification Number')}
          </label>
          <div id="cardcvc2" className="inputIframe"></div>
        </div>
      )}

      {paymentConfig.isSaveDataEnabled() && (
        <Checkbox
          label={__('Save the payment data for future use.')}
          name={saveDataField}
          isChecked={saveData}
        />
      )}
    </>
  );
}

CCIframe.propTypes = {
  detectedCardType: string.isRequired,
};

export default CCIframe;