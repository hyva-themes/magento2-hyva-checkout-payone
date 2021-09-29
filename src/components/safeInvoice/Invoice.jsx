import React, { useCallback, useEffect } from 'react';
import { func, shape } from 'prop-types';

import Card from '../../../../../components/common/Card';
import Checkbox from '../../../../../components/common/Form/Checkbox';
import RadioInput from '../../../../../components/common/Form/RadioInput';
import { __ } from '../../../../../i18n';
import invoiceConfig from './invoiceConfig';
import { paymentMethodShape } from '../../utility';
import { PAYMENT_METHOD_FORM } from '../../../../../config';
import usePerformPlaceOrder from '../../hooks/usePerformPlaceOrder';
import usePayOneCheckoutFormContext from '../../hooks/usePayOneCheckoutFormContext';
import usePayOnePaymentMethodContext from '../../hooks/usePayOnePaymentMethodContext';

const { instructions, canShowPaymentText, canShowBoniAgreement } =
  invoiceConfig;

const boniAgreementField = `${PAYMENT_METHOD_FORM}.payone.invoice.boniAgreement`;

function Invoice({ method, selected, actions }) {
  const { formikData } = usePayOnePaymentMethodContext();
  const performPlaceOrder = usePerformPlaceOrder(method.code);
  const { registerPaymentAction } = usePayOneCheckoutFormContext();
  const isSelected = method.code === selected.code;

  const placeOrderWithInvoice = useCallback(
    (values) => performPlaceOrder(values),
    [performPlaceOrder]
  );

  useEffect(() => {
    registerPaymentAction(method.code, placeOrderWithInvoice);
  }, [method, registerPaymentAction, placeOrderWithInvoice]);

  const invoiceRadioInput = (
    <RadioInput
      value={method.code}
      label={method.title}
      name="paymentMethod"
      checked={isSelected}
      onChange={actions.change}
    />
  );

  if (!isSelected) {
    return invoiceRadioInput;
  }

  return (
    <div>
      <div>
        {invoiceRadioInput}
        {(instructions || canShowPaymentText || canShowBoniAgreement) && (
          <div className="mx-4 my-4">
            <Card bg="darker">
              <div className="container flex flex-col justify-center w-4/5">
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
                      formikData={formikData}
                    />
                  </div>
                )}
              </div>
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
  actions: shape({ change: func }).isRequired,
};

export default Invoice;
