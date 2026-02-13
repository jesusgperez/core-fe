import { Outlet, Navigate, RouteObject } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import RetrievePassword from "./RetrievePassword";
import Home from "./Home";
import AuthProvider from "../contexts/Provider";
import ChangePassword from "./ChangePassword";
import { AuthUrls as urls } from "./AuthUrls";


const AuthLayout = () => (
  <AuthProvider>
    <Outlet />
  </AuthProvider>
);

const AuthRoutes: RouteObject[] = [
  {
    element: <AuthLayout />,
    children: [
      { path: "/", element: <Navigate to="/login" /> },
      { path: urls.login, element: <Login /> },
      { path: urls.signup, element: <Signup /> },
      { path: urls.retrievePassword, element: <RetrievePassword /> },
      { path: urls.changePassword, element: <ChangePassword /> },
      { path: urls.home, element: <Home /> },
    ],
  },
];

export { AuthRoutes };
