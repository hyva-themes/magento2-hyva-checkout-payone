import _get from 'lodash.get';
import _set from 'lodash.set';

import { __ } from '../../../../../../i18n';
import creditCardConfig from '../creditCardConfig';
import { PAYMENT_METHOD_FORM } from '../../../../../../config';
import LocalStorage from '../../../../../../utils/localStorage';

export const ccField = `${PAYMENT_METHOD_FORM}.payone.cc`;
export const selectedCardField = `${ccField}.selectedCard`;
export const additionalDataField = `${ccField}.additional_data`;
export const cardTypeField = `${ccField}.additional_data.cardtype`;
export const cardHolderField = `${ccField}.additional_data.cardholder`;

export function isInt(value) {
  return value.length > 0 && typeof value === 'number';
}

export function isMinValidityCorrect(sExpireDate) {
  if (isInt(creditCardConfig.ccMinValidity)) {
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
        parseInt(creditCardConfig.ccMinValidity, 10)
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
  if (!creditCardConfig.isSavedPaymentDataUsed(values)) {
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
  const { savedPaymentData = [] } = creditCardConfig;
  const selectedCardPan = _get(values, selectedCardField);
  return savedPaymentData.find(
    card => creditCardConfig.getCardPan(card) === selectedCardPan
  );
}

export function prepareSetPaymentMethodData(response, values) {
  const payment = _get(values, PAYMENT_METHOD_FORM);
  const cardholder = _get(payment, 'additional_data.cardholder');
  const saveData = Number(!!_get(payment, 'additional_data.saveData'));
  const selectedCardPan = _get(values, selectedCardField);
  const isLoggedIn = !!LocalStorage.getCustomerToken();
  const {
    cardtype,
    pseudocardpan,
    cardexpiredate,
    truncatedcardpan,
  } = response;

  let additionalData = {
    cardtype,
    cardholder,
    pseudocardpan,
    cardexpiredate,
    truncatedcardpan,
  };

  if (isLoggedIn) {
    if (selectedCardPan !== 'new') {
      const selectedSavedCard = getSelectedSavedCard(values);
      if (selectedSavedCard && selectedSavedCard.payment_data) {
        additionalData = selectedSavedCard.payment_data;
      }
    }
    _set(additionalData, `saveData`, saveData);
    _set(additionalData, `cardholder`, cardholder);
    _set(additionalData, `selectedData`, selectedCardPan);
  }

  return additionalData;
}
