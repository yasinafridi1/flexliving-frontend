import { RouterProvider } from 'react-router-dom';
import routes from '@routes';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { checkSession } from '@utils/axiosInstance';
import MainLoader from '@maincomponents/loaders/MainLoader';
import { storeTokens } from '@utils/localstorageutil';
import { forceLogout, setUserLogin } from '@redux/slice/authSlice';

function App() {
  let Once = true;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  async function checkLogin() {
    return;
    try {
      setLoading(true);
      const data = await checkSession();
      storeTokens(data);
      dispatch(setUserLogin(data));
      setLoading(false);
    } catch (error) {
      dispatch(forceLogout());
      setLoading(false);
    }
  }

  useEffect(() => {
    if (Once) {
      Once = false;
      checkLogin();
    }
  }, []);
  return <>{loading ? <MainLoader /> : <RouterProvider router={routes} />}</>;
}

export default App;
