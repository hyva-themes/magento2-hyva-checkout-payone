import React, { useCallback, useEffect } from 'react';
import { func, shape } from 'prop-types';

import Card from '../../../../../components/common/Card';
import Checkbox from '../../../../../components/common/Form/Checkbox';
import RadioInput from '../../../../../components/common/Form/RadioInput';
import usePerformPlaceOrder from '../../hooks/usePerformPlaceOrder';
import usePayOneCheckoutFormContext from '../../hooks/usePayOneCheckoutFormContext';
import { __ } from '../../../../../i18n';
import { paymentMethodShape } from '../../utility';
import advancePaymentConfig from './advancePaymentConfig';
import { PAYMENT_METHOD_FORM } from '../../../../../config';

const {
  instructions,
  canShowPaymentText,
  canShowBoniAgreement,
} = advancePaymentConfig;

const boniAgreementField = `${PAYMENT_METHOD_FORM}.payone.paydirekt.boniAgreement`;

function AdvancePayment({ method, selected, actions }) {
  const { registerPaymentAction } = usePayOneCheckoutFormContext();
  const isSelected = method.code === selected.code;
  const performPlaceOrder = usePerformPlaceOrder(method.code);

  const placeOrderWithAdvancePayment = useCallback(
    values => performPlaceOrder(values),
    [performPlaceOrder]
  );

  useEffect(() => {
    registerPaymentAction(method.code, placeOrderWithAdvancePayment);
  }, [method, registerPaymentAction, placeOrderWithAdvancePayment]);

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
        {(instructions || canShowPaymentText || canShowBoniAgreement) && (
          <div className="mx-4 my-4">
            <Card bg="white">
              {instructions && <p className="mt-4">{instructions}</p>}
              {canShowPaymentText && (
                <div className="mt-4">
                  <strong>
                    <span>{advancePaymentConfig.paymentHintText}</span>
                  </strong>
                </div>
              )}
              {canShowBoniAgreement && (
                <div>
                  <Checkbox
                    name={boniAgreementField}
                    label={__(advancePaymentConfig.agreementMessage)}
                  />
                </div>
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

AdvancePayment.propTypes = {
  method: paymentMethodShape.isRequired,
  selected: paymentMethodShape.isRequired,
  actions: shape({ change: func }),
};

export default AdvancePayment;
