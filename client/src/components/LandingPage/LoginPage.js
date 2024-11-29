import React from "react";

import logo from "../../assets/logo.png";
import backgroundImage from "../../assets/Campus_Central.png";
import "../../css/LoginPage.css";
import LoginForm from "../Forms/LoginForm";
import { MdKeyboardBackspace } from "react-icons/md";
const LoginPage = () => {
  return (
    <div className="login-page-container" style={{ 
        position: "absolute",
        top: "0px",
        left: "0px",
        right: "0px",
        bottom: "0px",
        backgroundImage: `url(${backgroundImage})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        zIndex: "-1",         
      }}>
      <div className="login-page-header">
        <a href="/">
          <img src={logo} alt="logo" style={{ width: "70px" }} />
        </a>
        <h1
          style={{
            fontWeight: "500",
            marginBottom: "20px",
            marginTop: "1px",
            fontSize: "24px",
          }}
        >
          Bienvenido!{" "}
        </h1>
      </div>
      <div>
        <a href="/" style={{ textDecoration: "none" }}>
          <div style={{ marginRight: "225px", display: "flex" }}>
            <div style={{ display: "flex", marginTop: "3px" }}>
              <MdKeyboardBackspace />
            </div>
            <div>
              <p style={{ margin: "0", fontSize: "14px" }}>Regresar al Home</p>
            </div>
          </div>
        </a>
      </div>
      <LoginForm />

      <div className="register-container" style={{ color: "white" }}>
        No tienes usuario?{" "}
        <a style={{ textDecoration: "none", color: "white", backgroundColor: "#18537e", padding: "4px 5px", borderRadius: "8px" }} href="/register">
          Click aquí y registrate
        </a>
      </div>
    </div>
  );
};

export default LoginPage;
