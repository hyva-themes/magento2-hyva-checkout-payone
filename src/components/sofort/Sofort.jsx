import React, { useEffect } from 'react';
import { func, shape } from 'prop-types';
import { __ } from '@hyva/react-checkout/i18n';
import Card from '@hyva/react-checkout/components/common/Card';
import Checkbox from '@hyva/react-checkout/components/common/Form/Checkbox';
import TextInput from '@hyva/react-checkout/components/common/Form/TextInput';
import RadioInput from '@hyva/react-checkout/components/common/Form/RadioInput';

import sofortConfig from './sofortConfig';
import { paymentMethodShape } from '../../utility';
import usePayoneSofort from './hooks/usePayoneSofort';
import { PAYMENT_METHOD_FORM } from '../../../../../config';
import usePayOneCheckoutFormContext from '../../hooks/usePayOneCheckoutFormContext';
import usePayOnePaymentMethodContext from '../../hooks/usePayOnePaymentMethodContext';

const ibanField = `${PAYMENT_METHOD_FORM}.payone.sofort.iban`;
const bicField = `${PAYMENT_METHOD_FORM}.payone.sofort.bic`;

function Sofort({ method, selected, actions }) {
  const { placeOrderWithSofort } = usePayoneSofort(method.code);
  const { registerPaymentAction } = usePayOneCheckoutFormContext();
  const { formikData, setFieldValue } = usePayOnePaymentMethodContext();
  const isSelected = method.code === selected.code;

  useEffect(() => {
    setFieldValue(ibanField, '');
    setFieldValue(bicField, '');
  }, [setFieldValue]);

  useEffect(() => {
    registerPaymentAction(method.code, placeOrderWithSofort);
  }, [method, registerPaymentAction, placeOrderWithSofort]);

  const sofortRadioInput = (
    <RadioInput
      label={method.title}
      name="paymentMethod"
      value={method.code}
      onChange={actions.change}
      checked={isSelected}
    />
  );

  if (!isSelected) {
    return sofortRadioInput;
  }

  return (
    <div>
      <div>
        {sofortRadioInput}
        <div className="mx-4 my-4">
          <Card bg="darker">
            <div className="container flex flex-col justify-center w-4/5">
              {sofortConfig.instructions && <p>{sofortConfig.instructions}</p>}
              {sofortConfig.paymentHintText && (
                <div>
                  <strong>
                    <span>{sofortConfig.paymentHintText}</span>
                  </strong>
                </div>
              )}
              {sofortConfig.agreementMessage && (
                <div>
                  <Checkbox
                    name="agreement"
                    label={__(sofortConfig.agreementMessage)}
                    formikData={formikData}
                  />
                </div>
              )}
              {sofortConfig.requestIbanBic && (
                <div>
                  <TextInput
                    label="IBAN"
                    name={ibanField}
                    formikData={formikData}
                  />
                  <TextInput
                    label="BIC"
                    name={bicField}
                    formikData={formikData}
                  />
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

Sofort.propTypes = {
  method: paymentMethodShape.isRequired,
  selected: paymentMethodShape.isRequired,
  actions: shape({ change: func }).isRequired,
};

export default Sofort;
