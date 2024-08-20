import Login from "../pages/adminLogin/Login";
import Main from "../pages/adminMain/Main";
import userLogin from "../pages/userLogin/userLogin";
import userMain from "../pages/userMain/userMain";
import { ADMIN_LOGIN_ROUTE, ADMIN_MAIN_ROUTE, USER_LOGIN_ROUTE, USER_MAIN_ROUTE } from "./consts";

export const authRoutes = [
  { path: ADMIN_MAIN_ROUTE, Component: Main },
  { path: USER_MAIN_ROUTE, Component: userMain },
];

export const publicRoutes = [
  { path: ADMIN_LOGIN_ROUTE, Component: Login },
  { path: USER_LOGIN_ROUTE, Component: userLogin },
];
