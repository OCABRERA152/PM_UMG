import React, { useContext, useState } from "react";
import AuthContext from "../../context/AuthContext";
import apiServer from "../../config/apiServer";
import { useForm } from "react-hook-form";
import "../../css/LoginPage.css";

const Onboard = (props) => {
  const { register, handleSubmit, errors } = useForm();
  const { setAuth } = useContext(AuthContext);

  const [errorMessage, setErrorMessage] = useState("");
  const onboard = async ({ teamName }) => {
    
    const email = localStorage.getItem("email");

    if (teamName) {
      try {
        const res = await apiServer.put("/register/onboard", {
          email,
          teamName,
        });

        localStorage.setItem("token", res.data.token);
        setErrorMessage("");
        setAuth(res.data.token);
      } catch (err) {
        console.log(err.status);
        setErrorMessage("Something went wrong");
      }
    }
  };

  const onSkip = () => {
    //sets initial token
    localStorage.setItem("token", localStorage.getItem("onboard"));
    //for component to refresh to redirect webpage
    setAuth(localStorage.getItem("onboard"));
    localStorage.removeItem("onboard");
  };
  return (
    <div className="onboard-page-container">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "200px",
        }}
      >
        <div className="onboard-page-header">
          <h1
            style={{
              fontWeight: "500",
              marginBottom: "20px",
              marginTop: "1px",
              fontSize: "24px",
            }}
          >
            ¿En qué equipo trabajarás?
          </h1>
        </div>
        <form className="onboard-page--form" onSubmit={handleSubmit(onboard)}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label htmlFor="teamName">Nombre del Team</label>
            <input name="teamName" ref={register({ minLength: 2 })}></input>
            {errors.teamName?.type === "minLengh" && (
              <p style={{ color: "red", margin: "1px" }}>
                El nombre del equipo debe tener más de 1 carácter
              </p>
            )}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            {/* <button
              style={{
                width: "150px",
                border: "1px solid #0093ff",
                backgroundColor: "transparent",
                borderRadius: "5px",
                color: "black",
                outline: "none",
                cursor: "pointer",
              }}
              onClick={onSkip}
            >
              Skip
            </button> */}
            <button
              style={{
                width: "150px",
              }}
              type="submit"
            >
              Continuar
            </button>
          </div>
          {errorMessage ? (
            <p style={{ color: "red", margin: "1px" }}>{errorMessage}</p>
          ) : null}
        </form>
      </div>
    </div>
  );
};

export default Onboard;
