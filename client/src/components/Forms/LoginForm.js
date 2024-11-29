import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import AuthContext from "../../context/AuthContext";
import "../../css/LoginPage.css";
import apiServer from "../../config/apiServer";
const LoginForm = () => {
  const { register, handleSubmit, errors } = useForm();

  const [errorMessage, setErrorMessage] = useState("");
  const { setAuth, setEmail, setUserId, setUser } = useContext(AuthContext);
  const [formEmail, setFormEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const onSubmit = async ({ email, password }) => {
    // if (!email && !password) {
    //   email = "demo@email.com";
    //   password = "password";
    //   setFormEmail(email);
    //   setPassword(password);
    // }
    setLoading(true);
    try {
      const res = await apiServer.post("/login", { email, password });

      localStorage.setItem("email", res.data.email);
      localStorage.setItem("userId", res.data.id);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("roleId", res.data.roleId);

      setErrorMessage("");
      setAuth(res.data.token);
      // setUserId(res.data.id);
      // setEmail(res.data.email);
      // setUser(res.data);
    } catch (err) {
      setLoading(false);
      setErrorMessage("The provided credentials were invalid");
    }
  };

  const handleEmailChange = (e) => {
    setFormEmail(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  return (
    <form className="login-page--form" onSubmit={handleSubmit(onSubmit)} style={{
      backgroundColor: "white",
    }}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label htmlFor="email">Correo Electrónico</label>
        <input
          name="email"
          type="email"
          value={formEmail}
          onChange={handleEmailChange}
          ref={register({ required: true })}
        ></input>
        {errors.email?.type === "required" && (
          <p style={{ color: "red", margin: "1px" }}>
            Por favor ingresa un correo electrónica
          </p>
        )}
      </div>
      <div>
        <label htmlFor="password">Contraseña</label>
        <input
          name="password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
          ref={register({ required: true })}
        ></input>
        {errors.password?.type === "required" && (
          <p style={{ color: "red", margin: "1px" }}>Por favor ingresar una contraseña</p>
        )}
      </div>
      <button type="submit">{loading ? "Autenticando..." : "Ingresar"}</button>
      {errorMessage ? (
        <p style={{ color: "red", margin: "1px" }}>{errorMessage}</p>
      ) : null}
      {/* <button onClick={demoLogin}>
        {demoLoading ? "Logging in as demo user" : "Demo User"}
      </button> */}
    </form>
  );
};

export default LoginForm;
