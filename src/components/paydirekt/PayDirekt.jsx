import React, { useCallback, useEffect } from 'react';
import { func, shape } from 'prop-types';
import { __ } from '@hyva/react-checkout/i18n';
import Card from '@hyva/react-checkout/components/common/Card';
import Button from '@hyva/react-checkout/components/common/Button';
import Checkbox from '@hyva/react-checkout/components/common/Form/Checkbox';
import RadioInput from '@hyva/react-checkout/components/common/Form/RadioInput';

import payDirektConfig from './payDirektConfig';
import { paymentMethodShape } from '../../utility';
import { redirectToOneKlickController } from './utility';
import { PAYMENT_METHOD_FORM } from '../../../../../config';
import usePayOneAppContext from '../../hooks/usePayOneAppContext';
import usePerformPlaceOrder from '../../hooks/usePerformPlaceOrder';
import usePayOneCheckoutFormContext from '../../hooks/usePayOneCheckoutFormContext';
import usePayOnePaymentMethodContext from '../../hooks/usePayOnePaymentMethodContext';

const { instructions, canShowPaymentText, canShowBoniAgreement } =
  payDirektConfig;

const boniAgreementField = `${PAYMENT_METHOD_FORM}.payone.paydirekt.boniAgreement`;

function PayDirekt({ method, selected, actions }) {
  const { isLoggedIn } = usePayOneAppContext();
  const { formikData } = usePayOnePaymentMethodContext();
  const { registerPaymentAction } = usePayOneCheckoutFormContext();
  const isSelected = method.code === selected.code;
  const performPlaceOrder = usePerformPlaceOrder(method.code);

  const placeOrderWithPayDirekt = useCallback(
    (values) => performPlaceOrder(values),
    [performPlaceOrder]
  );

  useEffect(() => {
    registerPaymentAction(method.code, placeOrderWithPayDirekt);
  }, [method, registerPaymentAction, placeOrderWithPayDirekt]);

  const payDirektRadioInput = (
    <RadioInput
      value={method.code}
      label={method.title}
      name="paymentMethod"
      checked={isSelected}
      onChange={actions.change}
    />
  );

  if (!isSelected) {
    return payDirektRadioInput;
  }

  return (
    <div>
      <div>
        {payDirektRadioInput}
        {(instructions || canShowPaymentText || canShowBoniAgreement) && (
          <div className="mx-4 my-4">
            <Card bg="darker">
              <div className="container flex flex-col justify-center w-4/5">
                {instructions && <p className="mt-4">{instructions}</p>}
                {canShowPaymentText && (
                  <div className="mt-4">
                    <strong>
                      <span>{payDirektConfig.paymentHintText}</span>
                    </strong>
                  </div>
                )}
                {canShowBoniAgreement && (
                  <div>
                    <Checkbox
                      formikData={formikData}
                      name={boniAgreementField}
                      label={__(payDirektConfig.agreementMessage)}
                    />
                  </div>
                )}
                {payDirektConfig.isPayDirektOnKlickEnabled && isLoggedIn && (
                  <Button click={redirectToOneKlickController}>
                    {__('Register for paydirekt oneKlick')}
                  </Button>
                )}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

PayDirekt.propTypes = {
  method: paymentMethodShape.isRequired,
  selected: paymentMethodShape.isRequired,
  actions: shape({ change: func }).isRequired,
};

export default PayDirekt;
