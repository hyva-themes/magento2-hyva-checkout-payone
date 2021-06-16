import React, { useEffect } from 'react';
import { func, shape } from 'prop-types';
import { useFormikContext } from 'formik';

import Card from '../../../../../components/common/Card';
import Checkbox from '../../../../../components/common/Form/Checkbox';
import RadioInput from '../../../../../components/common/Form/RadioInput';
import SelectInput from '../../../../../components/common/Form/SelectInput';
import usePayOneEPS from './hooks/usePayOneEPS';
import usePayOneCheckoutFormContext from '../../hooks/usePayOneCheckoutFormContext';
import epsConfig from './epsConfig';
import { __ } from '../../../../../i18n';
import { paymentMethodShape } from '../../utility';
import { PAYMENT_METHOD_FORM } from '../../../../../config';

const epsBankGroupField = `${PAYMENT_METHOD_FORM}.payone.eps.bankGroup`;
const boniAgreementField = `${PAYMENT_METHOD_FORM}.payone.eps.boniAgreement`;

function EPS({ method, selected, actions }) {
  const { setFieldValue } = useFormikContext();
  const { placeOrderWithEPS } = usePayOneEPS(method.code);
  const { registerPaymentAction } = usePayOneCheckoutFormContext();
  const isSelected = method.code === selected.code;

  useEffect(() => {
    setFieldValue(epsBankGroupField, '');
  }, [setFieldValue]);

  useEffect(() => {
    registerPaymentAction(method.code, placeOrderWithEPS);
  }, [method, registerPaymentAction, placeOrderWithEPS]);

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
      <div className="mx-4 my-4">
        <Card bg="white">
          <div>
            <SelectInput
              label={__('Bank group')}
              name={epsBankGroupField}
              options={epsConfig.bankGroupOptions}
            />
          </div>
          <div>
            {epsConfig.instructions && (
              <p className="mt-4]">{epsConfig.instructions}</p>
            )}
            {epsConfig.canShowPaymentText && (
              <div>
                <strong>
                  <span>{epsConfig.paymentHintText}</span>
                </strong>
              </div>
            )}
            {epsConfig.canShowBoniAgreement && (
              <div>
                <Checkbox
                  name={boniAgreementField}
                  label={__(epsConfig.agreementMessage)}
                />
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

EPS.propTypes = {
  method: paymentMethodShape.isRequired,
  selected: paymentMethodShape.isRequired,
  actions: shape({ change: func }),
};

export default EPS;
