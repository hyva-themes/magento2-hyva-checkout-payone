import { useCallback } from 'react';
import _get from 'lodash.get';
import _set from 'lodash.set';

import { __ } from '../../../../i18n';
import { performRedirect } from '../utility';
import { LOGIN_FORM } from '../../../../config';
import { _isObjEmpty, _keys } from '../../../../utils';
import usePayOneAppContext from './usePayOneAppContext';
import usePayOneCartContext from './usePayOneCartContext';

export default function usePerformPlaceOrder(paymentMethodCode) {
  const { cartId, setRestPaymentMethod, setOrderInfo } = usePayOneCartContext();
  const { isLoggedIn, setPageLoader, setErrorMessage, checkoutAgreements } =
    usePayOneAppContext();

  return useCallback(
    async (values, additionalData, extensionAttributes = {}) => {
      try {
        const email = _get(values, `${LOGIN_FORM}.email`);
        const paymentMethodData = {
          paymentMethod: {
            method: paymentMethodCode,
            additional_data: additionalData,
          },
        };

        if (
          !_isObjEmpty(extensionAttributes) ||
          !_isObjEmpty(checkoutAgreements)
        ) {
          _set(paymentMethodData, 'paymentMethod.extension_attributes', {
            ...extensionAttributes,
            agreement_ids: _keys(checkoutAgreements),
          });
        }

        if (!isLoggedIn) {
          _set(paymentMethodData, 'email', email);
        } else {
          _set(paymentMethodData, 'cartId', cartId);
        }

        setPageLoader(true);
        const order = await setRestPaymentMethod(paymentMethodData, isLoggedIn);
        setPageLoader(false);
        performRedirect(order);

        if (order) {
          setOrderInfo(order);
        }
      } catch (error) {
        console.error(error);
        setErrorMessage(
          __(
            'This transaction could not be performed. Please select another payment method.'
          )
        );
        setPageLoader(false);
      }
    },
    [
      cartId,
      isLoggedIn,
      setOrderInfo,
      setPageLoader,
      setErrorMessage,
      paymentMethodCode,
      checkoutAgreements,
      setRestPaymentMethod,
    ]
  );
}
