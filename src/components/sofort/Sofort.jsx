import React, { useEffect } from 'react';
import { func, shape } from 'prop-types';

import Card from '../../../../../components/common/Card';
import Checkbox from '../../../../../components/common/Form/Checkbox';
import TextInput from '../../../../../components/common/Form/TextInput';
import RadioInput from '../../../../../components/common/Form/RadioInput';

import { __ } from '../../../../../i18n';
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
      value={method.code}
      label={method.title}
      name="paymentMethod"
      checked={isSelected}
      onChange={actions.change}
    />
  );

  if (!isSelected || !sofortConfig.canShow) {
    return sofortRadioInput;
  }

  return (
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
                  formikData={formikData}
                  label={__(sofortConfig.agreementMessage)}
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
  );
}

Sofort.propTypes = {
  method: paymentMethodShape.isRequired,
  selected: paymentMethodShape.isRequired,
  actions: shape({ change: func }).isRequired,
};

export default Sofort;
