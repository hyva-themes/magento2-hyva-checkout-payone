import React, { useCallback, useEffect } from 'react';
import { func, shape } from 'prop-types';

import CCForm from './CCForm';
import CCIframe from './CCIframe';
import SavedCards from './SavedCards';
import RadioInput from '../../../../../components/common/Form/RadioInput';
import usePayOneCC from './hooks/usePayOneCC';
import useCardTypeDetection from './hooks/useCardTypeDetection';
import usePayOneCCFormInitialize from './hooks/usePayOneCCFomInitialize';
import usePayOneCheckoutFormContext from '../../hooks/usePayOneCheckoutFormContext';
import creditCardConfig from './creditCardConfig';
import { paymentMethodShape } from '../../utility';

function CreditCard({ method, selected, actions }) {
  const savedData = creditCardConfig.useSavedData();
  const isSelected = method.code === selected.code;
  const { isFormInitialized, setSelectedCard } = usePayOneCCFormInitialize();
  const { registerPaymentAction } = usePayOneCheckoutFormContext();
  const { cardTypeDetected } = useCardTypeDetection();
  const { handleCreditCardCheckThenPlaceOrder } = usePayOneCC(method.code);

  /**
   * This will be fired when user placing the order and this payment method
   * is selected by the user.
   */
  const paymentSubmitHandler = useCallback(
    async values => {
      await handleCreditCardCheckThenPlaceOrder(values);
      return false;
    },
    [handleCreditCardCheckThenPlaceOrder]
  );

  // registering this payment method so that it will be using the paymentSubmitHandler
  // to do the place order action in the case this payment method is selected.
  useEffect(() => {
    registerPaymentAction(method.code, paymentSubmitHandler);
  }, [method, registerPaymentAction, paymentSubmitHandler]);

  // initializing the iframe and showing the card form within the payment method.
  useEffect(() => {
    if (isSelected && isFormInitialized) {
      window.iframes = new window.Payone.ClientApi.HostedIFrames(
        creditCardConfig.fieldConfig,
        creditCardConfig.request
      );
      window.iframes.setCardType('V');
    }
  }, [isSelected, isFormInitialized]);

  // if saved cards available for customer, then should show card list in the content
  useEffect(() => {
    if (isSelected && savedData) {
      const defaultSavedCard = creditCardConfig.getDefaultSavedCard();

      if (defaultSavedCard) {
        setSelectedCard(creditCardConfig.getCardPan(defaultSavedCard));
      }
    }
  }, [savedData, isSelected, setSelectedCard]);

  if (!isSelected) {
    return (
      <>
        <RadioInput
          label={method.title}
          name="paymentMethod"
          value={method.code}
          onChange={actions.change}
          checked={isSelected}
        />
        <div className="hidden">
          <CCIframe detectedCardType={cardTypeDetected} />
        </div>
      </>
    );
  }

  if (savedData) {
    return (
      <div className="w-full">
        <RadioInput
          label={method.title}
          name="paymentMethod"
          value={method.code}
          onChange={actions.change}
          checked={isSelected}
        />
        <div className="mt-4 ml-4">
          <SavedCards detectedCardType={cardTypeDetected} />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div>
        <RadioInput
          label={method.title}
          name="paymentMethod"
          value={method.code}
          onChange={actions.change}
          checked={isSelected}
        />
      </div>
      <CCForm detectedCardType={cardTypeDetected} />
    </div>
  );
}

CreditCard.propTypes = {
  method: paymentMethodShape.isRequired,
  selected: paymentMethodShape.isRequired,
  actions: shape({ change: func }),
};

export default CreditCard;
