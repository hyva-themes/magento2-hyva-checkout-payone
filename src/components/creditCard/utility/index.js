import _get from 'lodash.get';
import _set from 'lodash.set';

import { LOGIN_FORM, PAYMENT_METHOD_FORM } from '../../../../../../config';
import { __ } from '../../../../../../i18n';
import LocalStorage from '../../../../../../utils/localStorage';
import paymentConfig from '../paymentConfig';

export const selectedCardField = `${PAYMENT_METHOD_FORM}.selectedCard`;
export const additionalDataField = `${PAYMENT_METHOD_FORM}.additional_data`;
const cardTypeField = `${PAYMENT_METHOD_FORM}.additional_data.cardtype`;
const cardHolderField = `${PAYMENT_METHOD_FORM}.additional_data.cardholder`;

export function isInt(value) {
  return value.length > 0 && typeof value === 'number';
}

export function isMinValidityCorrect(sExpireDate) {
  if (isInt(paymentConfig.ccMinValidity)) {
    const oExpireDate = new Date(
      parseInt(`20${parseInt(sExpireDate.substring(0, 2), 10)}`, 10),
      parseInt(sExpireDate.substring(2, 4), 10),
      1,
      0,
      0,
      0
    );
    oExpireDate.setSeconds(oExpireDate.getSeconds() - 1);

    const oMinValidDate = new Date();
    oMinValidDate.setDate(
      parseInt(oMinValidDate.getDate().toString(), 10) +
        parseInt(paymentConfig.ccMinValidity, 10)
    );

    if (oExpireDate < oMinValidDate) {
      return false;
    }
  }

  return true;
}

export function isCardholderDataValid(sCardholder) {
  if (sCardholder.search(/[^a-zA-ZÄäÖöÜüß\- ]+/) === -1) {
    return true;
  }
  return false;
}

export function validate(values) {
  if (!paymentConfig.isSavedPaymentDataUsed(values)) {
    const cardType = _get(values, cardTypeField);
    const cardholder = _get(values, cardHolderField);

    if (!cardType) {
      return {
        isValid: false,
        message: __('Please choose the creditcard type.'),
      };
    }

    if (!cardholder) {
      return {
        isValid: false,
        message: __('Please provide cardholder information'),
      };
    }

    if (cardholder.length > 50) {
      return {
        isValid: false,
        message: __('The cardholder information entered is too long.'),
      };
    }

    if (!isCardholderDataValid(cardholder)) {
      return {
        isValid: false,
        message: __('The cardholder information contains invalid characters.'),
      };
    }
  } else {
    const selectedSavedCard = getSelectedSavedCard(values);

    if (
      selectedSavedCard &&
      !isMinValidityCorrect(selectedSavedCard.payment_data.cardexpiredate)
    ) {
      return {
        isValid: false,
        message: __(
          'This transaction could not be performed. Please select another payment method.'
        ),
      };
    }
  }

  return { isValid: true };
}

function getSelectedSavedCard(values) {
  const { savedPaymentData = [] } = paymentConfig;
  const selectedCardPan = _get(values, selectedCardField);
  return savedPaymentData.find(
    card => paymentConfig.getCardPan(card) === selectedCardPan
  );
}

export function prepareSetPaymentMethodData(
  response,
  values,
  cartId,
  paymentMethodCode
) {
  const email = _get(values, `${LOGIN_FORM}.email`);
  const payment = _get(values, PAYMENT_METHOD_FORM);
  const cardholder = _get(payment, 'additional_data.cardholder');
  const saveData = Number(!!_get(payment, 'additional_data.saveData'));
  const selectedCardPan = _get(values, selectedCardField);
  const isLoggedIn = !!LocalStorage.getCustomerToken();
  const {
    truncatedcardpan,
    pseudocardpan,
    cardtype,
    cardexpiredate,
  } = response;

  const paymentMethod = {
    paymentMethod: {
      method: paymentMethodCode,
      additional_data: {
        cardholder,
        truncatedcardpan,
        pseudocardpan,
        cardtype,
        cardexpiredate,
      },
    },
  };

  if (isLoggedIn) {
    const additionalData = 'paymentMethod.additional_data';

    if (selectedCardPan !== 'new') {
      const selectedSavedCard = getSelectedSavedCard(values);
      if (selectedSavedCard && selectedSavedCard.payment_data) {
        _set(paymentMethod, additionalData, selectedSavedCard.payment_data);
      }
    }
    _set(paymentMethod, 'cartId', cartId);
    _set(paymentMethod, `${additionalData}.saveData`, saveData);
    _set(paymentMethod, `${additionalData}.cardholder`, cardholder);
    _set(paymentMethod, `${additionalData}.selectedData`, selectedCardPan);
  } else {
    _set(paymentMethod, 'email', email);
  }

  return paymentMethod;
}
