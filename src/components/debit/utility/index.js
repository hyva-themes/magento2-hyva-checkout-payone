import _get from 'lodash.get';
import { object as YupObject, string as YupString } from 'yup';

import debitConfig from '../debitConfig';
import { __ } from '../../../../../../i18n';
import { PAYMENT_METHOD_FORM } from '../../../../../../config';

export const debitField = `${PAYMENT_METHOD_FORM}.payone.debit`;
export const bicField = `${debitField}.bic`;
export const ibanField = `${debitField}.iban`;
export const debitCountryField = `${debitField}.debitCountry`;

export function validate(values) {
  const validationSchema = YupObject().shape({
    debitCountry: YupString().required(__('Please choose the bank country.')),
    iban: YupString().required(__('Please enter a valid IBAN.')),
    bic: YupString().test(
      'requiredIfRequestBic',
      __('Please enter a valid BIC.'),
      async value => debitConfig.requestBic && !!(await value)
    ),
  });
  const paymentMethodValues = _get(values, debitField, {});

  return validationSchema.validate(paymentMethodValues);
}
