import React, { useContext } from "react";
import AuthContext from "../context/AuthContext";
import LandingRoutes from "./LandingPage/LandingRoutes";
import AuthRoutes from "./AuthRoutes";

const Routes = () => {
  const { auth } = useContext(AuthContext);
  return <>{auth ? <AuthRoutes /> : <LandingRoutes />}</>;
};

export default Routes;
