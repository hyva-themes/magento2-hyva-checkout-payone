import React, { useCallback, useEffect } from 'react';
import { func, shape } from 'prop-types';
import _get from 'lodash.get';
import { useFormikContext } from 'formik';

import Card from '../../../../../components/common/Card';
import TextInput from '../../../../../components/common/Form/TextInput';
import Checkbox from '../../../../../components/common/Form/Checkbox';
import RadioInput from '../../../../../components/common/Form/RadioInput';
import usePayOneAppContext from '../../hooks/usePayOneAppContext';
import usePerformPlaceOrder from '../../hooks/usePerformPlaceOrder';
import usePayOneCheckoutFormContext from '../../hooks/usePayOneCheckoutFormContext';
import { __ } from '../../../../../i18n';
import giroPayConfig from './giroPayConfig';
import { paymentMethodShape } from '../../utility';
import { PAYMENT_METHOD_FORM } from '../../../../../config';

const giroPayField = `${PAYMENT_METHOD_FORM}.payone.giropay`;
const bicField = `${giroPayField}.bic`;
const ibanField = `${giroPayField}.iban`;
const boniAgreementField = `${PAYMENT_METHOD_FORM}.payone.giropay.boniAgreement`;

function GiroPay({ method, selected, actions }) {
  const { setFieldValue } = useFormikContext();
  const { setErrorMessage } = usePayOneAppContext();
  const { registerPaymentAction } = usePayOneCheckoutFormContext();
  const performPlaceOrder = usePerformPlaceOrder(method.code);
  const isSelected = method.code === selected.code;

  const placeOrderWithGiroPay = useCallback(
    async values => {
      const { bic, iban } = _get(values, giroPayField);

      if (!bic) {
        setErrorMessage(__('Please enter a valid BIC.'));
        return;
      }

      if (!iban) {
        setErrorMessage(__('Please enter a valid IBAN.'));
        return;
      }

      await performPlaceOrder(values);
    },
    [performPlaceOrder, setErrorMessage]
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
            {giroPayConfig.canShowPaymentText && (
              <div className="mt-4">
                <strong>
                  <span>{giroPayConfig.paymentHintText}</span>
                </strong>
              </div>
            )}
            {giroPayConfig.canShowBoniAgreement && (
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
