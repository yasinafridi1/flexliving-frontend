import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import CONSTANTS from '@data/Constants';
import { getLocalStorageValue } from '@utils/localstorageutil';

const PrivateRoutes = ({ children }) => {
  const { isLoggedIn } = useSelector(state => state.auth);
  const location = getLocalStorageValue(CONSTANTS.LOCATION);
  if (isLoggedIn) return children;
  return (
    <Navigate
      to='/signin'
      state={{
        from: location
      }}
      replace
    />
  );
};

export default PrivateRoutes;
