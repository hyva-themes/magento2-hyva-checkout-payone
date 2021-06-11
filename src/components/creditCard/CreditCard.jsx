import React, { useCallback, useEffect } from 'react';
import { func, shape, string } from 'prop-types';

import CCForm from './CCForm';
import CCIframe from './CCIframe';
import SavedCards from './SavedCards';
import RadioInput from '../../../../../components/common/Form/RadioInput';
import usePayOneCC from './hooks/usePayOneCC';
import paymentConfig from './paymentConfig';
import usePayOneCheckoutFormContext from '../../hooks/usePayOneCheckoutFormContext';
import useCardTypeDetection from './hooks/useCardTypeDetection';
import usePayOneCCFormInitialize from './hooks/usePayOneCCFomInitialize';

function CreditCard({ method, selected, actions }) {
  const savedData = paymentConfig.useSavedData();
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
        paymentConfig.fieldConfig,
        paymentConfig.request
      );
      window.iframes.setCardType('V');
    }
  }, [isSelected, isFormInitialized]);

  // if saved cards available for customer, then should show card list in the content
  useEffect(() => {
    if (isSelected && savedData) {
      const defaultSavedCard = paymentConfig.getDefaultSavedCard();

      if (defaultSavedCard) {
        setSelectedCard(paymentConfig.getCardPan(defaultSavedCard));
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

const methodShape = shape({
  title: string.isRequired,
  code: string.isRequired,
});

CreditCard.propTypes = {
  method: methodShape.isRequired,
  selected: methodShape.isRequired,
  actions: shape({ change: func }),
};

export default CreditCard;
