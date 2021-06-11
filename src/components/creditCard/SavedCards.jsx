import React from 'react';
import _get from 'lodash.get';
import { string } from 'prop-types';
import { useFormikContext } from 'formik';

import CCForm from './CCForm';
import RadioInput from '../../../../../components/common/Form/RadioInput';
import creditCardConfig from './creditCardConfig';
import { selectedCardField } from './utility';

function formatCardExpireDate(expireDate) {
  return `${expireDate.substring(2, 4)}/${expireDate.substring(0, 2)}`;
}

function getCardImage(cardType) {
  return `https://cdn.pay1.de/cc/${cardType.toLowerCase()}/s/default.png`;
}

function SavedCards({ detectedCardType }) {
  const { values } = useFormikContext();
  const selectedCard = _get(values, selectedCardField);

  return (
    <table className="w-full text-sm">
      <tbody>
        {creditCardConfig.savedPaymentData.map(payment => (
          <tr
            key={payment.id}
            className="h-20 bg-white border-t border-gray-400"
          >
            <td className="pl-2">
              <RadioInput
                name={selectedCardField}
                checked={selectedCard === creditCardConfig.getCardPan(payment)}
                value={creditCardConfig.getCardPan(payment)}
              />
            </td>
            <td>
              <img
                className="w-auto h-3"
                alt={payment.payment_data.masked}
                src={getCardImage(payment.payment_data.cardtype)}
              />
            </td>
            <td>
              {`ends-${payment.payment_data.masked.substring(
                payment.payment_data.masked.length - 4
              )}`}
            </td>
            <td>{payment.payment_data.cardholder}</td>
            <td>{formatCardExpireDate(payment.payment_data.cardexpiredate)}</td>
          </tr>
        ))}

        <tr className="h-20 bg-white border-t border-gray-400">
          <td colSpan={5}>
            <>
              <div className="pl-2">
                <RadioInput
                  name={selectedCardField}
                  label="Add new creditcard"
                  checked={selectedCard === 'new'}
                  value="new"
                />
              </div>
              <div
                className={`px-4 py-4 ${
                  selectedCard !== 'new' ? 'hidden' : ''
                }`}
              >
                <CCForm detectedCardType={detectedCardType} />
              </div>
            </>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

SavedCards.propTypes = {
  detectedCardType: string.isRequired,
};

export default SavedCards;
