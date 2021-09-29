import React, { useEffect } from 'react';
import { func, shape } from 'prop-types';

import Card from '../../../../../components/common/Card';
import Checkbox from '../../../../../components/common/Form/Checkbox';
import RadioInput from '../../../../../components/common/Form/RadioInput';
import SelectInput from '../../../../../components/common/Form/SelectInput';
import epsConfig from './epsConfig';
import { __ } from '../../../../../i18n';
import usePayOneEPS from './hooks/usePayOneEPS';
import { paymentMethodShape } from '../../utility';
import { PAYMENT_METHOD_FORM } from '../../../../../config';
import usePayOneCheckoutFormContext from '../../hooks/usePayOneCheckoutFormContext';
import usePayOnePaymentMethodContext from '../../hooks/usePayOnePaymentMethodContext';

const epsBankGroupField = `${PAYMENT_METHOD_FORM}.payone.eps.bankGroup`;
const boniAgreementField = `${PAYMENT_METHOD_FORM}.payone.eps.boniAgreement`;

function EPS({ method, selected, actions }) {
  const { formikData, setFieldValue } = usePayOnePaymentMethodContext();
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
      </div>
      <div className="mx-4 my-4">
        <Card bg="darker">
          <div className="container flex flex-col justify-center w-4/5">
            <SelectInput
              formikData={formikData}
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
                  formikData={formikData}
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
  actions: shape({ change: func }).isRequired,
};

export default EPS;
