import React, { useEffect } from 'react';
import { func, shape } from 'prop-types';

import RadioInput from '../../../../../components/common/Form/RadioInput';
import usePayOnePayPal from './hooks/usePayOnePayPal';
import usePayOneCheckoutFormContext from '../../hooks/usePayOneCheckoutFormContext';
import { paymentMethodShape } from '../../utility';
import paypalConfig from './paypalConfig';
import { PAYMENT_METHOD_FORM } from '../../../../../config';
import Checkbox from '../../../../../components/common/Form/Checkbox';
import { __ } from '../../../../../i18n';

const boniAgreementField = `${PAYMENT_METHOD_FORM}.payone.paypal.boniAgreement`;

function PayPal({ method, selected, actions }) {
  const { registerPaymentAction } = usePayOneCheckoutFormContext();
  const isSelected = method.code === selected.code;
  const placeOrderWithPayPal = usePayOnePayPal(method.code);

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
        {paypalConfig.instructions && <p>{paypalConfig.instructions}</p>}
        {paypalConfig.canShowBoniAgreement && (
          <div>
            <Checkbox
              name={boniAgreementField}
              label={__(paypalConfig.agreementMessage)}
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
