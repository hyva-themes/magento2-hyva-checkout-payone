import { useContext } from 'react';

import AppContext from '../../../../context/App/AppContext';

export default function usePayOneAppContext() {
  const [, { setErrorMessage, setPageLoader }] = useContext(AppContext);

  return {
    setPageLoader,
    setErrorMessage,
  };
}
