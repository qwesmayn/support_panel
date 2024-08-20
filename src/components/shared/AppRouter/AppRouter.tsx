import { FC } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { authRoutes, publicRoutes } from "../../../utils/routes";
import {
  ADMIN_LOGIN_ROUTE,
  ADMIN_MAIN_ROUTE,
  USER_LOGIN_ROUTE,
  USER_MAIN_ROUTE,
} from "../../../utils/consts";
import { useAppSelector } from "../../../hooks/typeHooks";
import { useUserInfo } from "../../../hooks/useUserInfo";

const AppRouter: FC = () => {
  const { isAuth } = useAppSelector((state) => state.authReducer);
  const UserInfo = useUserInfo();

  return (
    <Routes>
      {isAuth &&
        authRoutes.map(({ path, Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ))}

      {publicRoutes.map(({ path, Component }) => (
        <Route
          key={path}
          path={path}
          element={
            isAuth &&
            (path === ADMIN_LOGIN_ROUTE || path === USER_LOGIN_ROUTE) ? (
              <Navigate
                to={
                  UserInfo.userInfo?.role === "admin"
                    ? ADMIN_MAIN_ROUTE
                    : USER_MAIN_ROUTE
                }
                replace
              />
            ) : (
              <Component />
            )
          }
        />
      ))}

      <Route
        path="*"
        element={
          <Navigate
            to={
              isAuth
                ? UserInfo.userInfo?.role === "admin"
                  ? ADMIN_MAIN_ROUTE
                  : USER_MAIN_ROUTE
                : USER_LOGIN_ROUTE
            }
            replace
          />
        }
      />
    </Routes>
  );
};

export default AppRouter;
