import React, { useEffect } from 'react';
import { func, shape } from 'prop-types';

import Card from '../../../../../components/common/Card';
import Checkbox from '../../../../../components/common/Form/Checkbox';
import TextInput from '../../../../../components/common/Form/TextInput';
import RadioInput from '../../../../../components/common/Form/RadioInput';
import SelectInput from '../../../../../components/common/Form/SelectInput';
import debitConfig from './debitConfig';
import { __ } from '../../../../../i18n';
import { paymentMethodShape } from '../../utility';
import usePayOneDebit from './hooks/usePayOneDebit';
import { bicField, debitCountryField, debitField, ibanField } from './utility';
import usePayOneCheckoutFormContext from '../../hooks/usePayOneCheckoutFormContext';
import usePayOnePaymentMethodContext from '../../hooks/usePayOnePaymentMethodContext';

const boniAgreementField = `${debitField}.boniAgreement`;

function Debit({ method, selected, actions }) {
  const { formikData, setFieldValue } = usePayOnePaymentMethodContext();
  const placeOrderWithDebit = usePayOneDebit(method.code);
  const { registerPaymentAction } = usePayOneCheckoutFormContext();
  const isSelected = method.code === selected.code;

  useEffect(() => {
    setFieldValue(ibanField, '');
    setFieldValue(debitField, '');
    setFieldValue(debitCountryField, '');
  }, [setFieldValue]);

  useEffect(() => {
    registerPaymentAction(method.code, placeOrderWithDebit);
  }, [method, registerPaymentAction, placeOrderWithDebit]);

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
            <fieldset>
              <SelectInput
                formikData={formikData}
                name={debitCountryField}
                label={__('Bank country')}
                options={debitConfig.getCountryList}
              />
              <TextInput
                name={ibanField}
                label={__('IBAN')}
                formikData={formikData}
              />
              {debitConfig.requestBic && (
                <TextInput
                  name={bicField}
                  label={__('BIC')}
                  formikData={formikData}
                />
              )}
            </fieldset>
          </div>
          <div>
            {debitConfig.instructions && (
              <p className="mt-4">{debitConfig.instructions}</p>
            )}
            {debitConfig.canShowPaymentText && (
              <div>
                <strong>
                  <span>{debitConfig.paymentHintText}</span>
                </strong>
              </div>
            )}
            {debitConfig.canShowBoniAgreement && (
              <div>
                <Checkbox
                  formikData={formikData}
                  name={boniAgreementField}
                  label={__(debitConfig.agreementMessage)}
                />
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

Debit.propTypes = {
  actions: shape({ change: func }),
  method: paymentMethodShape.isRequired,
  selected: paymentMethodShape.isRequired,
};

export default Debit;
