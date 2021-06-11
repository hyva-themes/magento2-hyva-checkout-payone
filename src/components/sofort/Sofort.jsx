import React, { useEffect } from 'react';
import { func, shape } from 'prop-types';
import { useFormikContext } from 'formik';

import Card from '../../../../../components/common/Card';
import Checkbox from '../../../../../components/common/Form/Checkbox';
import TextInput from '../../../../../components/common/Form/TextInput';
import RadioInput from '../../../../../components/common/Form/RadioInput';

import usePayoneSofort from './hooks/usePayoneSofort';
import usePayOneCheckoutFormContext from '../../hooks/usePayOneCheckoutFormContext';
import { __ } from '../../../../../i18n';
import sofortConfig from './sofortConfig';
import { paymentMethodShape } from '../../utility';
import { PAYMENT_METHOD_FORM } from '../../../../../config';

const ibanField = `${PAYMENT_METHOD_FORM}.payone.sofort.iban`;
const bicField = `${PAYMENT_METHOD_FORM}.payone.sofort.bic`;

function Sofort({ method, selected, actions }) {
  const { setFieldValue } = useFormikContext();
  const { registerPaymentAction } = usePayOneCheckoutFormContext();
  const { placeOrderWithSofort } = usePayoneSofort(method.code);
  const isSelected = method.code === selected.code;

  useEffect(() => {
    setFieldValue(ibanField, '');
    setFieldValue(bicField, '');
  }, [setFieldValue]);

  useEffect(() => {
    registerPaymentAction(method.code, placeOrderWithSofort);
  }, [method, registerPaymentAction, placeOrderWithSofort]);

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
                  label={__(sofortConfig.agreementMessage)}
                />
              </div>
            )}
            {sofortConfig.requestIbanBic && (
              <div>
                <TextInput label="IBAN" name={ibanField} />
                <TextInput label="BIC" name={bicField} />
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

Sofort.propTypes = {
  method: paymentMethodShape.isRequired,
  selected: paymentMethodShape.isRequired,
  actions: shape({ change: func }),
};

export default Sofort;
