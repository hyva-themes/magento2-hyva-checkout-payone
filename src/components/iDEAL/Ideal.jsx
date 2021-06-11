import React, { useEffect } from 'react';
import { func, shape } from 'prop-types';
import { useFormikContext } from 'formik';

import Card from '../../../../../components/common/Card';
import Checkbox from '../../../../../components/common/Form/Checkbox';
import RadioInput from '../../../../../components/common/Form/RadioInput';
import SelectInput from '../../../../../components/common/Form/SelectInput';
import { __ } from '../../../../../i18n';
import idealConfig from './idealConfig';
import { paymentMethodShape } from '../../utility';
import { PAYMENT_METHOD_FORM } from '../../../../../config';
import usePayOneCheckoutFormContext from '../../hooks/usePayOneCheckoutFormContext';
import usePayOneIdeal from './hooks/usePayOneIdeal';

const idealBankGroupField = `${PAYMENT_METHOD_FORM}.payone.ideal.bankGroup`;
const boniAgreementField = `${PAYMENT_METHOD_FORM}.payone.ideal.boniAgreement`;

function Ideal({ method, selected, actions }) {
  const { setFieldValue } = useFormikContext();
  const { registerPaymentAction } = usePayOneCheckoutFormContext();
  const isSelected = method.code === selected.code;
  const { placeOrderWithIdeal } = usePayOneIdeal(method.code);

  useEffect(() => {
    setFieldValue(idealBankGroupField, '');
  }, [setFieldValue]);

  useEffect(() => {
    registerPaymentAction(method.code, placeOrderWithIdeal);
  }, [method, registerPaymentAction, placeOrderWithIdeal]);

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
              name={idealBankGroupField}
              options={idealConfig.bankGroupOptions}
            />
          </div>
          <div>
            {idealConfig.instructions && <p>{idealConfig.instructions}</p>}
            {idealConfig.canShowPaymentText && (
              <div>
                <strong>
                  <span>{idealConfig.paymentHintText}</span>
                </strong>
              </div>
            )}
            {idealConfig.canShowBoniAgreement && (
              <div>
                <Checkbox
                  name={boniAgreementField}
                  label={__(idealConfig.agreementMessage)}
                />
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

Ideal.propTypes = {
  method: paymentMethodShape.isRequired,
  selected: paymentMethodShape.isRequired,
  actions: shape({ change: func }),
};

export default Ideal;
