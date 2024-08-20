import { useEffect } from "react";
import AppRouter from "./components/shared/AppRouter/AppRouter";
import { useAppDispatch, useAppSelector } from "./hooks/typeHooks";
import { useUserInfo } from "./hooks/useUserInfo";
import { getMeAdmin, getMeUser } from "./store/action_creators/actionCreators";
import { setAuth } from "./store/reducers/authSlice";

function App() {
  const dispatch = useAppDispatch();
  const userJwtInfo = useUserInfo();
  const { user, isLoading, error } = useAppSelector((state) => state.userReducer);

  useEffect(() => {
    if (userJwtInfo?.userInfo) {
      if (userJwtInfo.userInfo.role === "admin") {
        dispatch(getMeAdmin(userJwtInfo.userInfo.id));
      } else {
        dispatch(getMeUser(userJwtInfo.userInfo.id));
      }
    }
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      dispatch(setAuth(true));
    } else if(error) {
      localStorage.removeItem('token')
      dispatch(setAuth(false));
    }
  }, [dispatch,user]);

  return (
    <div className="h-screen">
      {isLoading ? <div className="text text-5xl text-white">Loading...</div> : <AppRouter />}
    </div>
  );
}

export default App;
