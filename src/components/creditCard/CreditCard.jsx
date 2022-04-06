import React, { useCallback, useEffect } from 'react';
import { func, shape } from 'prop-types';

import CCForm from './CCForm';
import CCIframe from './CCIframe';
import SavedCards from './SavedCards';
import Card from '../../../../../components/common/Card';
import RadioInput from '../../../../../components/common/Form/RadioInput';
import usePayOneCC from './hooks/usePayOneCC';
import creditCardConfig from './creditCardConfig';
import { paymentMethodShape } from '../../utility';
import useCardTypeDetection from './hooks/useCardTypeDetection';
import usePayOneCCFormInitialize from './hooks/usePayOneCCFomInitialize';
import usePayOneCheckoutFormContext from '../../hooks/usePayOneCheckoutFormContext';

function CreditCard({ method, selected, actions }) {
  const savedData = creditCardConfig.useSavedData();
  const { cardTypeDetected } = useCardTypeDetection();
  const { registerPaymentAction } = usePayOneCheckoutFormContext();
  const { handleCreditCardCheckThenPlaceOrder } = usePayOneCC(method.code);
  const { isFormInitialized, setSelectedCard } = usePayOneCCFormInitialize();
  const isSelected = method.code === selected.code;

  /**
   * This will be fired when user placing the order and this payment method
   * is selected by the user.
   */
  const paymentSubmitHandler = useCallback(
    async (values) => {
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

  const radioInputElement = (
    <RadioInput
      value={method.code}
      label={method.title}
      name="paymentMethod"
      checked={isSelected}
      onChange={actions.change}
    />
  );

  if (!isSelected) {
    return (
      <>
        {radioInputElement}
        <div className="hidden">
          <CCIframe detectedCardType={cardTypeDetected} />
        </div>
      </>
    );
  }

  if (savedData) {
    return (
      <div className="w-full">
        {radioInputElement}
        <div className="mt-4 ml-4">
          <SavedCards detectedCardType={cardTypeDetected} />
        </div>
      </div>
    );
  }

  return (
    <>
      <div>{radioInputElement}</div>
      <div className="mx-4 my-4">
        <Card bg="darker">
          <div className="container flex flex-col justify-center w-4/5">
            <CCForm detectedCardType={cardTypeDetected} />
          </div>
        </Card>
      </div>
    </>
  );
}

CreditCard.propTypes = {
  method: paymentMethodShape.isRequired,
  selected: paymentMethodShape.isRequired,
  actions: shape({ change: func }).isRequired,
};

export default CreditCard;
