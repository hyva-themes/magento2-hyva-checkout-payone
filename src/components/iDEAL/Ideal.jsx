import React, { useEffect } from 'react';
import { func, shape } from 'prop-types';

import Card from '../../../../../components/common/Card';
import Checkbox from '../../../../../components/common/Form/Checkbox';
import RadioInput from '../../../../../components/common/Form/RadioInput';
import SelectInput from '../../../../../components/common/Form/SelectInput';
import idealConfig from './idealConfig';
import { __ } from '../../../../../i18n';
import { paymentMethodShape } from '../../utility';
import usePayOneIdeal from './hooks/usePayOneIdeal';
import { PAYMENT_METHOD_FORM } from '../../../../../config';
import usePayOneCheckoutFormContext from '../../hooks/usePayOneCheckoutFormContext';
import usePayOnePaymentMethodContext from '../../hooks/usePayOnePaymentMethodContext';

const idealBankGroupField = `${PAYMENT_METHOD_FORM}.payone.ideal.bankGroup`;
const boniAgreementField = `${PAYMENT_METHOD_FORM}.payone.ideal.boniAgreement`;

function Ideal({ method, selected, actions }) {
  const { formikData, setFieldValue } = usePayOnePaymentMethodContext();
  const { placeOrderWithIdeal } = usePayOneIdeal(method.code);
  const { registerPaymentAction } = usePayOneCheckoutFormContext();
  const isSelected = method.code === selected.code;

  useEffect(() => {
    setFieldValue(idealBankGroupField, '');
  }, [setFieldValue]);

  useEffect(() => {
    registerPaymentAction(method.code, placeOrderWithIdeal);
  }, [method, registerPaymentAction, placeOrderWithIdeal]);

  if (!isSelected) {
    return (
      <RadioInput
        value={method.code}
        label={method.title}
        name="paymentMethod"
        checked={isSelected}
        formikData={formikData}
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
          formikData={formikData}
          onChange={actions.change}
        />
      </div>
      <div className="mx-4 my-4">
        <Card bg="darker">
          <div className="container flex flex-col justify-center w-4/5">
            <SelectInput
              formikData={formikData}
              label={__('Bank group')}
              name={idealBankGroupField}
              options={idealConfig.bankGroupOptions}
            />
          </div>
          <div>
            {idealConfig.instructions && (
              <p className="mt-4">{idealConfig.instructions}</p>
            )}
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
                  formikData={formikData}
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
  actions: shape({ change: func }),
  method: paymentMethodShape.isRequired,
  selected: paymentMethodShape.isRequired,
};

export default Ideal;
