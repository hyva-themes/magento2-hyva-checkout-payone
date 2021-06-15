import { config } from '../../../../../../config';

export function redirectToOneKlickController() {
  window.location.replace(`${config}/payone/paydirekt/agreement/`);
}
