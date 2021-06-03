import React from 'react';

import { string } from 'prop-types';
import { useFormikContext } from 'formik';

import CCIframe from './CCIframe';
import paymentConfig from '../../utility/paymentConfig';
import { PAYMENT_METHOD_FORM } from '../../../../../config';
import TextInput from '../../../../../components/common/Form/TextInput';
import SelectInput from '../../../../../components/common/Form/SelectInput';
import { __ } from '../../../../../i18n';

const cardTypeOptions = paymentConfig.availableCardTypes.map(
  ({ id, title }) => ({ value: id, label: title })
);

const cardTypeField = `${PAYMENT_METHOD_FORM}.additional_data.cardtype`;
const cardHolderField = `${PAYMENT_METHOD_FORM}.additional_data.cardholder`;

function CCForm({ detectedCardType }) {
  const { setFieldValue } = useFormikContext();

  const handleCardTypeChange = event => {
    const newCardTypeSelected = event.target.value;

    setFieldValue(cardTypeField, newCardTypeSelected);
    window.iframes.setCardType(newCardTypeSelected);
  };

  return (
    <div className="w-full">
      {!paymentConfig.isAutoCardtypeDetectionEnabled && (
        <SelectInput
          label={__('Card Type')}
          name={cardTypeField}
          options={cardTypeOptions}
          onChange={handleCardTypeChange}
        />
      )}
      <TextInput label="Card Holder" name={cardHolderField} />
      <CCIframe detectedCardType={detectedCardType} />
    </div>
  );
}

CCForm.propTypes = {
  detectedCardType: string.isRequired,
};

export default CCForm;
