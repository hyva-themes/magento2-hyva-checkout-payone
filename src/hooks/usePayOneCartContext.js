import { useContext } from 'react';
import _get from 'lodash.get';

import CartContext from '../../../../context/Cart/CartContext';

export default function usePayOneCartContext() {
  const [cartData, { setRestPaymentMethod }] = useContext(CartContext);
  const cartId = _get(cartData, 'cart.id');

  return {
    cartId,
    setRestPaymentMethod,
  };
}
