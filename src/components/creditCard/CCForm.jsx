import React from 'react';
import { string } from 'prop-types';
import { __ } from '@hyva/react-checkout/i18n';
import TextInput from '@hyva/react-checkout/components/common/Form/TextInput';
import SelectInput from '@hyva/react-checkout/components/common/Form/SelectInput';

import CCIframe from './CCIframe';
import creditCardConfig from './creditCardConfig';
import { cardHolderField, cardTypeField } from './utility';
import usePayOnePaymentMethodContext from '../../hooks/usePayOnePaymentMethodContext';

const cardTypeOptions = creditCardConfig.availableCardTypes.map(
  ({ id, title }) => ({ value: id, label: title })
);

function CCForm({ detectedCardType }) {
  const { setFieldValue, formikData } = usePayOnePaymentMethodContext();

  const handleCardTypeChange = (event) => {
    const newCardTypeSelected = event.target.value;

    setFieldValue(cardTypeField, newCardTypeSelected);
    window.iframes.setCardType(newCardTypeSelected);
  };

  return (
    <div className="w-full">
      {!creditCardConfig.isAutoCardtypeDetectionEnabled && (
        <SelectInput
          name={cardTypeField}
          formikData={formikData}
          label={__('Card Type')}
          options={cardTypeOptions}
          onChange={handleCardTypeChange}
        />
      )}
      <TextInput
        label="Card Holder"
        name={cardHolderField}
        formikData={formikData}
      />
      <CCIframe detectedCardType={detectedCardType} />
    </div>
  );
}

CCForm.propTypes = {
  detectedCardType: string.isRequired,
};

export default CCForm;
