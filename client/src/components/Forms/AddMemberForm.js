import React, { useEffect, useState } from "react";
import "../../css/Task.css";
import Button from "@material-ui/core/Button"
import RadioGroup from "@material-ui/core/RadioGroup"
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

import { Modal } from "@material-ui/core";
import { useForm } from "react-hook-form";
import apiServer from "../../config/apiServer";
import Loader from "../Loader";

const AddMemberForm = ({ teamId, teamName, clickClose, open, setTeamUsers }) => {
  const { register, handleSubmit, errors } = useForm();
  const [users, setUsers] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState([]);
  const [radioValue, setRadioValue] = useState(0);
  const [selectedUser, setSelectedUser] = useState();

  const getRoles = async () => {
    const res = await apiServer.get("/roles");

    setRoles(res.data);
    setLoading(false);
  };

  const onSubmit = async ({ roleId, name, email }) => {
    try {

      const url = selectedUser ? `/team/${teamId}/user/${selectedUser}` : `/team/${teamId}/user`;

      var data = await apiServer.post(url, {
        teamId,
        roleId,
        name,
        email
      });

      const res = await apiServer.get(`/team/${teamId}`);
      setTeamUsers(res.data.Users);

      clickClose();
    } catch (err) {
      setError("User already on team");
    }

    // const res = await apiServer.get(`/project/${projectId}/tasklists`);
  };

  const getAllUsersByAdmin = async () => {

    const userId = localStorage.getItem("userId");

    const res = await apiServer.get("/users/admin/" + userId);

    setUsers(res.data);
    setLoading(false);
  };
  useEffect(() => {
    getAllUsersByAdmin();
    getRoles();
  }, []);

  if (loading) {
    return <Loader />;
  }

  const renderedUsers = users?.map((user, i) => {
    return (
      <option key={i} id={user.id} value={user.id}>
        {user.name} - {user.email}
      </option>
    );
  });

  const renderedRoles = roles.map((role, i) => {
    return (
      <option key={i} id={role.id} value={role.id}>
        {role.name}
      </option>
    );
  });
  return (
    <div>
      <Modal open={open} onClose={clickClose}>
        <div className="tasklist-modal-container" style={{ minWidth: "auto" }}>
          <form
            className="task-form"
            style={{}}
            onSubmit={handleSubmit(onSubmit)}
          >
            <h2 className="form-header">Añadir miembro al equipo!</h2>

            <FormControl style={{ display: "flex" }}>
              <FormLabel id="demo-radio-buttons-group-label">Seleccione una Opción</FormLabel>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue={radioValue}
                onChange={(e) => setRadioValue(e.target.value)}
                name="radio-buttons-group"
              >
                <FormControlLabel value="0" control={<Radio />} label="Nuevo Usuario" />
                <FormControlLabel value="1" control={<Radio />} label="Asignar Usuario" />
              </RadioGroup>
            </FormControl>

            {radioValue === "0" && (
              <div className="form-top-container">
                <div className="form-top-middle" style={{ marginTop: "10px" }}>

                  <label className="form-label" style={{ width: "100%" }}>
                    Nombre del Team
                    <input 
                      name="teamName"
                      type="text"
                      disabled
                      value={teamName}
                      className="form-input edit-task-form-input"
                      ref={register({ required: true })}
                    />
                  </label>

                  <label className="form-label" style={{ width: "100%" }}>
                    Selecciona un Rol
                    <select
                      id="role-select"
                      name="roleId"
                      className="form-input edit-task-form-input"
                      onChange={() => setError("")}
                      ref={register({ required: true })}>
                      <option value={0}>{"Selecciona un rol"}</option>
                      {renderedRoles}
                    </select>
                    <div className="error-message">{error}</div>
                    {errors.projectId?.type === "required" && (
                      <p className="error-message">Por favor selecciona un rol para el usuario</p>
                    )}
                  </label>
                  
                  <label className="form-label" style={{ width: "100%" }}>
                    Nombre Completo
                    <input
                      name="name"
                      type="text"
                      placeholder={"Nombre Completo"}
                      className="form-input edit-task-form-input"
                      ref={register({ required: true })}
                    />
                    {errors.name?.type === "required" && (
                      <p className="error-message">Por favor ingresa un nombre</p>
                    )}
                  </label>

                  <label className="form-label" style={{ width: "100%" }}>
                    Correo Electronico
                    <input
                      name="email"
                      type="email"
                      placeholder={"Correo Electronico"}
                      className="form-input edit-task-form-input"
                      ref={register({ required: true })}
                    />
                    {errors.name?.type === "required" && (
                      <p className="error-message">Por favor ingresa un correo</p>
                    )}
                  </label>
                </div>
                <div className="form-top-middle"></div>
                <div className="form-top-right"></div>
              </div>
            )}
            
            { radioValue === "1" && (
              <div className="form-top-container">
                <div className="form-top-middle" style={{ marginTop: "10px" }}>
                  <label className="form-label" style={{ width: "100%" }}>
                    Selecciona un Usuario
                    <select
                      id="user-select"
                      name="userId"
                      className="form-input edit-task-form-input"
                      value={selectedUser}
                      onChange={(e) => {
                        setSelectedUser(e.target.value);
                        setError("");
                      }}
                      ref={register({ required: true })}>
                      <option value={0}>{"Selecciona un usuario"}</option>
                      {renderedUsers}
                    </select>
                    <div className="error-message">{error}</div>
                    {errors.projectId?.type === "required" && (
                      <p className="error-message">Por favor selecciona un usuario</p>
                    )}
                  </label>
                </div>
              </div>
            )}

            {/* 
            <div className="form-top-container">
              <div className="form-top-middle" style={{ marginTop: "10px" }}>

                <label className="form-label" style={{ width: "100%" }}>
                  Nombre del Team
                  <input 
                    name="teamName"
                    type="text"
                    disabled
                    value={teamName}
                    className="form-input edit-task-form-input"
                    ref={register({ required: true })}
                  />
                </label>

                <label className="form-label" style={{ width: "100%" }}>
                  Selecciona un Rol
                  <select
                    id="role-select"
                    name="roleId"
                    className="form-input edit-task-form-input"
                    onChange={() => setError("")}
                    ref={register({ required: true })}>
                    <option value={0}>{"Selecciona un rol"}</option>
                    {renderedRoles}
                  </select>
                  <div className="error-message">{error}</div>
                  {errors.projectId?.type === "required" && (
                    <p className="error-message">Por favor selecciona un rol para el usuario</p>
                  )}
                </label>
                
                <label className="form-label" style={{ width: "100%" }}>
                  Nombre Completo
                  <input
                    name="name"
                    type="text"
                    placeholder={"Nombre Completo"}
                    className="form-input edit-task-form-input"
                    ref={register({ required: true })}
                  />
                  {errors.name?.type === "required" && (
                    <p className="error-message">Por favor ingresa un nombre</p>
                  )}
                </label>

                <label className="form-label" style={{ width: "100%" }}>
                  Correo Electronico
                  <input
                    name="email"
                    type="email"
                    placeholder={"Correo Electronico"}
                    className="form-input edit-task-form-input"
                    ref={register({ required: true })}
                  />
                  {errors.name?.type === "required" && (
                    <p className="error-message">Por favor ingresa un correo</p>
                  )}
                </label>
              </div>
              <div className="form-top-middle"></div>
              <div className="form-top-right"></div>
            </div> */}

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                style={{ color: "#0093ff" }}
                onClick={clickClose}
                color="primary"
              >
                Cancelar
              </Button>
              <Button
                style={{ color: "#0093ff" }}
                type="submit"
                color="primary"
              >
                Agregar
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default AddMemberForm;
