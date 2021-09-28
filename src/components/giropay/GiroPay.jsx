import React, { useCallback, useEffect } from 'react';
import _get from 'lodash.get';
import { func, shape } from 'prop-types';
import { __ } from '@hyva/react-checkout/i18n';
import Card from '@hyva/react-checkout/components/common/Card';
import Checkbox from '@hyva/react-checkout/components/common/Form/Checkbox';
import TextInput from '@hyva/react-checkout/components/common/Form/TextInput';
import RadioInput from '@hyva/react-checkout/components/common/Form/RadioInput';

import giroPayConfig from './giroPayConfig';
import { paymentMethodShape } from '../../utility';
import { PAYMENT_METHOD_FORM } from '../../../../../config';
import usePayOneAppContext from '../../hooks/usePayOneAppContext';
import usePerformPlaceOrder from '../../hooks/usePerformPlaceOrder';
import usePayOneCheckoutFormContext from '../../hooks/usePayOneCheckoutFormContext';
import usePayOnePaymentMethodContext from '../../hooks/usePayOnePaymentMethodContext';

const giroPayField = `${PAYMENT_METHOD_FORM}.payone.giropay`;
const bicField = `${giroPayField}.bic`;
const ibanField = `${giroPayField}.iban`;
const boniAgreementField = `${PAYMENT_METHOD_FORM}.payone.giropay.boniAgreement`;

function GiroPay({ method, selected, actions }) {
  const { setFieldValue, formikData } = usePayOnePaymentMethodContext();
  const { setErrorMessage } = usePayOneAppContext();
  const { registerPaymentAction } = usePayOneCheckoutFormContext();
  const performPlaceOrder = usePerformPlaceOrder(method.code);
  const isSelected = method.code === selected.code;

  const placeOrderWithGiroPay = useCallback(
    async (values) => {
      const { bic, iban } = _get(values, giroPayField);

      if (!bic) {
        setErrorMessage(__('Please enter a valid BIC.'));
        return;
      }

      if (!iban) {
        setErrorMessage(__('Please enter a valid IBAN.'));
        return;
      }

      await performPlaceOrder(values, { bic, iban });
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

  const paymentMethodRadioInput = (
    <RadioInput
      value={method.code}
      label={method.title}
      name="paymentMethod"
      checked={isSelected}
      onChange={actions.change}
    />
  );

  if (!isSelected) {
    return paymentMethodRadioInput;
  }

  return (
    <div>
      <div>
        {paymentMethodRadioInput}
        <div className="mx-4 my-4">
          <Card bg="darker">
            <div className="container flex flex-col justify-center w-4/5">
              <TextInput
                label="IBAN"
                name={ibanField}
                autocomplete="off"
                formikData={formikData}
              />
              <TextInput
                label="BIC"
                name={bicField}
                autocomplete="off"
                formikData={formikData}
              />
            </div>
            <div className="container">
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
            </div>

            <div className="container">
              {giroPayConfig.canShowBoniAgreement && (
                <div>
                  <Checkbox
                    formikData={formikData}
                    name={boniAgreementField}
                    label={__(giroPayConfig.agreementMessage)}
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

GiroPay.propTypes = {
  method: paymentMethodShape.isRequired,
  selected: paymentMethodShape.isRequired,
  actions: shape({ change: func }).isRequired,
};

export default GiroPay;
