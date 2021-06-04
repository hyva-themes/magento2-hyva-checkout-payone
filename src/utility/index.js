import { shape, string } from 'prop-types';

export const paymentMethodShape = shape({
  title: string.isRequired,
  code: string.isRequired,
});
