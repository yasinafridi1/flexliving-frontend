import CONSTANTS from '@data/Constants';
import { getLocalStorageValue } from '@utils/localstorageutil';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const RedirectRoutes = ({ children }) => {
  const { isLoggedIn } = useSelector(state => state.auth);
  const location = getLocalStorageValue(CONSTANTS.LOCATION);
  if (isLoggedIn) return <Navigate to={location || '/'} />;
  return children;
};

export default RedirectRoutes;
