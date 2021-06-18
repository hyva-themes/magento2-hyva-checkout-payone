import React, { useEffect } from 'react';
import { func, shape } from 'prop-types';
import { useFormikContext } from 'formik';

import Card from '../../../../../components/common/Card';
import Checkbox from '../../../../../components/common/Form/Checkbox';
import TextInput from '../../../../../components/common/Form/TextInput';
import RadioInput from '../../../../../components/common/Form/RadioInput';
import SelectInput from '../../../../../components/common/Form/SelectInput';
import usePayOneDebit from './hooks/usePayOneDebit';
import usePayOneCheckoutFormContext from '../../hooks/usePayOneCheckoutFormContext';
import debitConfig from './debitConfig';
import { __ } from '../../../../../i18n';
import { paymentMethodShape } from '../../utility';
import { bicField, debitCountryField, debitField, ibanField } from './utility';

const boniAgreementField = `${debitField}.boniAgreement`;

function Debit({ method, selected, actions }) {
  const { setFieldValue } = useFormikContext();
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
            <fieldset>
              <SelectInput
                label={__('Bank country')}
                name={debitCountryField}
                options={debitConfig.getCountryList}
              />
              <TextInput label={__('IBAN')} name={ibanField} />
              {debitConfig.requestBic && (
                <TextInput label={__('BIC')} name={bicField} />
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
  method: paymentMethodShape.isRequired,
  selected: paymentMethodShape.isRequired,
  actions: shape({ change: func }),
};

export default Debit;
