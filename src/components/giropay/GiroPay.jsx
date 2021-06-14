import React, { useCallback, useEffect } from 'react';
import { func, shape } from 'prop-types';
import { useFormikContext } from 'formik';

import Card from '../../../../../components/common/Card';
import TextInput from '../../../../../components/common/Form/TextInput';
import Checkbox from '../../../../../components/common/Form/Checkbox';
import RadioInput from '../../../../../components/common/Form/RadioInput';
import usePayOneCheckoutFormContext from '../../hooks/usePayOneCheckoutFormContext';
import { __ } from '../../../../../i18n';
import giroPayConfig from './giroPayConfig';
import { paymentMethodShape } from '../../utility';
import { PAYMENT_METHOD_FORM } from '../../../../../config';
import usePerformPlaceOrder from '../../hooks/usePerformPlaceOrder';

const bicField = `${PAYMENT_METHOD_FORM}.payone.giropay.bic`;
const ibanField = `${PAYMENT_METHOD_FORM}.payone.giropay.iban`;
const boniAgreementField = `${PAYMENT_METHOD_FORM}.payone.giropay.boniAgreement`;

function GiroPay({ method, selected, actions }) {
  const { setFieldValue } = useFormikContext();
  const { registerPaymentAction } = usePayOneCheckoutFormContext();
  const isSelected = method.code === selected.code;
  const performPlaceOrder = usePerformPlaceOrder(method.code);

  const placeOrderWithGiroPay = useCallback(
    values => performPlaceOrder(values),
    [performPlaceOrder]
  );

  useEffect(() => {
    setFieldValue(ibanField, '');
    setFieldValue(bicField, '');
  }, [setFieldValue]);

  useEffect(() => {
    registerPaymentAction(method.code, placeOrderWithGiroPay);
  }, [method, registerPaymentAction, placeOrderWithGiroPay]);

  if (!isSelected) {
    return (
      <RadioInput
        label={method.title}
        name="paymentMethod"
        value={method.code}
        onChange={actions.change}
        checked={isSelected}
      />
    );
  }

  return (
    <div>
      <div>
        <RadioInput
          label={method.title}
          name="paymentMethod"
          value={method.code}
          onChange={actions.change}
          checked={isSelected}
        />
        <div className="mx-4 my-4">
          <Card bg="white">
            <div>
              <TextInput label="IBAN" name={ibanField} autocomplete="off" />
              <TextInput label="BIC" name={bicField} autocomplete="off" />
            </div>
            {giroPayConfig.instructions && (
              <p className="mt-4">{giroPayConfig.instructions}</p>
            )}
            {giroPayConfig.paymentHintText && (
              <div className="mt-4">
                <strong>
                  <span>{giroPayConfig.paymentHintText}</span>
                </strong>
              </div>
            )}
            {giroPayConfig.agreementMessage && (
              <div>
                <Checkbox
                  name={boniAgreementField}
                  label={__(giroPayConfig.agreementMessage)}
                />
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

GiroPay.propTypes = {
  method: paymentMethodShape.isRequired,
  selected: paymentMethodShape.isRequired,
  actions: shape({ change: func }),
};

export default GiroPay;
