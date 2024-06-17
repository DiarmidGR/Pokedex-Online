import { Navigate, Outlet } from "react-router-dom";
import { getToken } from "./Auth";

const PrivateRoute = () => {
  const auth = getToken(); // determine if authorized

  // If authorized, return an outlet that will render child elements
  // If not, return element that will navigate to login page
  return auth ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
