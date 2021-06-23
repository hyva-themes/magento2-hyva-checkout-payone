import React, { useCallback, useEffect } from 'react';
import { func, shape } from 'prop-types';

import Card from '../../../../../components/common/Card';
import Checkbox from '../../../../../components/common/Form/Checkbox';
import RadioInput from '../../../../../components/common/Form/RadioInput';
import usePerformPlaceOrder from '../../hooks/usePerformPlaceOrder';
import usePayOneCheckoutFormContext from '../../hooks/usePayOneCheckoutFormContext';
import { __ } from '../../../../../i18n';
import invoiceConfig from './invoiceConfig';
import { paymentMethodShape } from '../../utility';
import { PAYMENT_METHOD_FORM } from '../../../../../config';

const {
  instructions,
  canShowPaymentText,
  canShowBoniAgreement,
} = invoiceConfig;

const boniAgreementField = `${PAYMENT_METHOD_FORM}.payone.invoice.boniAgreement`;

function Invoice({ method, selected, actions }) {
  const { registerPaymentAction } = usePayOneCheckoutFormContext();
  const isSelected = method.code === selected.code;
  const performPlaceOrder = usePerformPlaceOrder(method.code);

  const placeOrderWithInvoice = useCallback(
    values => performPlaceOrder(values),
    [performPlaceOrder]
  );

  useEffect(() => {
    registerPaymentAction(method.code, placeOrderWithInvoice);
  }, [method, registerPaymentAction, placeOrderWithInvoice]);

  if (!isSelected) {
    return (
      <RadioInput
        value={method.code}
        label={method.title}
        name="paymentMethod"
        checked={isSelected}
        onChange={actions.change}
      />
    );
  }

  return (
    <div>
      <div>
        <RadioInput
          value={method.code}
          label={method.title}
          name="paymentMethod"
          checked={isSelected}
          onChange={actions.change}
        />
        {(instructions || canShowPaymentText || canShowBoniAgreement) && (
          <div className="mx-4 my-4">
            <Card bg="white">
              {instructions && <p className="mt-4">{instructions}</p>}
              {canShowPaymentText && (
                <div className="mt-4">
                  <strong>
                    <span>{invoiceConfig.paymentHintText}</span>
                  </strong>
                </div>
              )}
              {canShowBoniAgreement && (
                <div>
                  <Checkbox
                    name={boniAgreementField}
                    label={__(invoiceConfig.agreementMessage)}
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

Invoice.propTypes = {
  method: paymentMethodShape.isRequired,
  selected: paymentMethodShape.isRequired,
  actions: shape({ change: func }),
};

export default Invoice;
