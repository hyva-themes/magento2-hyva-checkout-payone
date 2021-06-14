import React, { useCallback, useEffect } from 'react';
import { func, shape } from 'prop-types';

import Checkbox from '../../../../../components/common/Form/Checkbox';
import RadioInput from '../../../../../components/common/Form/RadioInput';
import usePerformPlaceOrder from '../../hooks/usePerformPlaceOrder';
import usePayOneCheckoutFormContext from '../../hooks/usePayOneCheckoutFormContext';
import { __ } from '../../../../../i18n';
import payPalConfig from './paypalConfig';
import { paymentMethodShape } from '../../utility';
import { PAYMENT_METHOD_FORM } from '../../../../../config';

const boniAgreementField = `${PAYMENT_METHOD_FORM}.payone.paypal.boniAgreement`;

function PayPal({ method, selected, actions }) {
  const { registerPaymentAction } = usePayOneCheckoutFormContext();
  const isSelected = method.code === selected.code;
  const performPlaceOrder = usePerformPlaceOrder(method.code);

  const placeOrderWithPayPal = useCallback(
    values => performPlaceOrder(values),
    [performPlaceOrder]
  );

  useEffect(() => {
    registerPaymentAction(method.code, placeOrderWithPayPal);
  }, [method, registerPaymentAction, placeOrderWithPayPal]);

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
      </div>
      <div>
        {payPalConfig.instructions && <p>{payPalConfig.instructions}</p>}
        {payPalConfig.canShowBoniAgreement && (
          <div>
            <Checkbox
              name={boniAgreementField}
              label={__(payPalConfig.agreementMessage)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

PayPal.propTypes = {
  method: paymentMethodShape.isRequired,
  selected: paymentMethodShape.isRequired,
  actions: shape({ change: func }),
};

export default PayPal;
