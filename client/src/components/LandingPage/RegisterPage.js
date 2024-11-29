import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import AuthContext from "../../context/AuthContext";
import logo from "../../assets/logo.png";
import backgroundImage from "../../assets/Campus_Central.png";
import "../../css/LoginPage.css";
import apiServer from "../../config/apiServer";
import { MdKeyboardBackspace } from "react-icons/md";
const RegisterPage = () => {
  const { register, handleSubmit, errors } = useForm();
  const { setAuth, setEmail, setUserId, setUser } = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const onSubmit = async ({ name, email, password }) => {
    setLoading(true);
    try {
      const res = await apiServer.post("/register", { name, email, password });
      localStorage.setItem("onboard", res.data.token);
      localStorage.setItem("email", res.data.email);
      localStorage.setItem("userId", res.data.id);
      localStorage.setItem("roleId", res.data.roleId);
      window.location.href = "/register/onboard";
      setErrorMessage("");
      setUser(res.data);
      setAuth(res.data.token);
      setEmail(res.data.email);
      setUserId(res.data.id);
    } catch (err) {
      setLoading(false);
      console.log(err.status);
      setErrorMessage("Something went wrong with registering");
    }
  };

  return (
    <div className="register-page-container">
      <div
        style={{
          position: "absolute",
          top: "0px",
          left: "0px",
          right: "0px",
          bottom: "0px",
          backgroundImage: `url(${backgroundImage})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          zIndex: "-1",
        }}
      ></div>
      <div className="register-page-header">
        <a href="/">
          <img src={logo} alt="logo" style={{ width: "70px" }} />
        </a>
        <h1
          style={{
            fontWeight: "500",
            marginBottom: "10px",
            marginTop: "1px",
            fontSize: "24px",
          }}
        >
          Bienvenido a Project Management - UMG!{" "}
        </h1>
        {/* <h1
          style={{
            fontWeight: "500",
            marginBottom: "20px",
            marginTop: "1px",
            fontSize: "20px",
          }}
        >
          First things first, let's set up your account...
        </h1> */}
      </div>
      <div>
        <a href="/" style={{ textDecoration: "none" }}>
          <div style={{ marginRight: "225px", display: "flex" }}>
            <div style={{ display: "flex", marginTop: "3px" }}>
              <MdKeyboardBackspace />
            </div>
            <div>
              <p style={{ margin: "0", fontSize: "14px" }}>Regresar a la página de inicio</p>
            </div>
          </div>
        </a>
      </div>
      <form className="register-page--form" onSubmit={handleSubmit(onSubmit)} >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label htmlFor="name">Nombre Completo</label>
          <input
            name="name"
            ref={register({ required: true })}
          ></input>
          {errors.name?.type === "required" && (
            <p style={{ color: "red", margin: "1px" }}>
              Por favor ingresa tu nombre completo
            </p>
          )}
        </div>
        <div>
          <label htmlFor="email">Correo Electronico</label>
          <input
            name="email"
            type="email"
            ref={register({ required: true })}
          ></input>
          {errors.email?.type === "required" && (
            <p style={{ color: "red", margin: "1px" }}>
              Por favor ingresa un correo electronico
            </p>
          )}
        </div>

        <div>
          <label htmlFor="password">Contraseña</label>
          <input
            name="password"
            type="password"
            ref={register({ required: true })}
          ></input>
          {errors.password?.type === "required" && (
            <p style={{ color: "red", margin: "1px" }}>
              Por favor ingresa una contraseña
            </p>
          )}
        </div>
        <button type="submit">{loading ? "Registering.." : "Register"}</button>
        {errorMessage ? (
          <p style={{ color: "red", margin: "1px" }}>{errorMessage}</p>
        ) : null}
      </form>
      <div className="login-container" style={{ color: "white" }}>
        Ya tienes una cuenta?{" "}
        <a style={{ textDecoration: "none", color: "white" }} href="/login">
          Click aqui para ingresar
        </a>
      </div>
    </div>
  );
};

export default RegisterPage;
