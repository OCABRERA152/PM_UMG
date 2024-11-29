import React, { useEffect, useState, useContext } from "react";
import "../../css/Task.css";
import Button from "@material-ui/core/Button";
import { Modal } from "@material-ui/core";
import { useForm } from "react-hook-form";
import apiServer from "../../config/apiServer";
import Loader from "../Loader";
import { Context as TasklistContext } from "../../context/store/TasklistStore";
import { useParams } from "react-router-dom";

//form to add task from selected project
const AddTaskProjectForm = ({
  tasklistId,

  clickClose,
  open,
  setTasklistTasks,
  setTasklists,
  showSideTaskForm,
}) => {
  const { register, handleSubmit, errors } = useForm();
  const { teamId, projectId } = useParams();
  const [projectUsers, setProjectUsers] = useState();
  const [loading, setLoading] = useState(true);
  const [activityTypes, setActivityTypes] = useState();
  const [tasklistState, tasklistdispatch] = useContext(TasklistContext);
  const [selectedActivityType, setSelectedActivityType] = useState(1);

  const [testCases, setTestCases] = useState('');
  const [testDefinition, setTestDefinition] = useState('');

  const [criteria, setCriteria] = useState([]);
  const [newCriterion, setNewCriterion] = useState("");

  const handleAddCriterion = () => {
    if (newCriterion.trim()) {
      setCriteria([...criteria, newCriterion.trim()]);
      setNewCriterion("");
    }
  };

  const { selectedTasklist } = tasklistState;
  const getProjectUsers = async (event) => {
    const res = await apiServer.get(`/team/${teamId}/users`);

    if (localStorage.getItem("roleId") === "1") {
      setProjectUsers(res.data[0].Users);
      setLoading(false);
      return;
    }
    else {

      var users = res.data[0].Users;

      users = users.filter((user) => {
        return user.id == localStorage.getItem("userId");
      });

      setProjectUsers(users);
      setLoading(false);
    }

    // setProjectUsers(res.data[0].Users);
    // setLoading(false);
  };

  const getActivityTypes = async (event) => {
    const res = await apiServer.get(`/activity-types`);
    setActivityTypes(res.data);
  };

  useEffect(() => {
    getProjectUsers();
    getActivityTypes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //Probably need dispatch here to update the task page when task is created.

  const onSubmit = async ({
    name,
    assigneeId,
    activityTypeId,
    due_date,
    completed,
    description,
    definicion_de_prueba,
    casos_de_prueba
  }) => {

    await apiServer.post(`/tasklist/${selectedTasklist}/task`, {
      name,
      projectId,
      activityTypeId,
      assigneeId,
      due_date,
      completed,
      description,
      definicion_de_prueba,
      casos_de_prueba,
      criteriosAceptacion: criteria
    });

    const resp = await apiServer.get(`/project/${projectId}/tasklists`);
    setTasklists(resp.data);
    showSideTaskForm();
  };

  if (loading) {
    return <Loader />;
  }

  const renderedUsers = projectUsers?.map((user, i) => {
    return (
      <option key={i} value={user.id}>
        {user.name}
      </option>
    );
  });

  const renderedActivityTypes = activityTypes?.map((activityType, i) => {
    return (
      <option key={i} value={activityType.id}>
        {activityType.name}
      </option>
    );
  });

  return (
    <div>
      {/* <Modal open={open} onClose={clickClose}> */}
      {/* <div className="modal-container"> */}
      <form className="form-container" onSubmit={handleSubmit(onSubmit)}>
        {/* <h2 className="form-header">Add a Task</h2> */}
        <div className="form-top-container">
          <div className="form-section" style={{ margin: "0" }}>
            <div className="input-section">
              <div className="label-container">
                <label className="form-label">Nombre de Tarea</label>
              </div>
              <div className="input-container">
                <input
                  name="name"
                  type="text"
                  placeholder={"Nombre de tarea"}
                  className="form-input"
                  ref={register({ required: true })}
                ></input>
                {errors.name?.type === "required" && (
                  <p className="error-message">Please enter a task name</p>
                )}
              </div>
            </div>

            <div className="input-section">
              <div className="label-container">
                <label className="form-label">Asignado a</label>
              </div>
              <div className="input-container">
                <select
                  id="assignee-select"
                  name="assigneeId"
                  className="form-input"
                  ref={register({ required: true })}
                >
                  {renderedUsers}
                </select>
                {errors.assigneeId?.type === "required" && (
                  <p className="error-message">Please choose an assignee</p>
                )}
              </div>
            </div>

            <div className="input-section">
              <div className="label-container">
                <label className="form-label">Tipo de Actividad</label>
              </div>
              <div className="input-container">
                <select
                  id="activity-type-select"
                  name="activityTypeId"
                  className="form-input"
                  ref={register({ required: true })}
                  value={selectedActivityType}
                  onChange={(e) => setSelectedActivityType(e.target.value)}
                >
                  {renderedActivityTypes}
                </select>
                {errors.assigneeId?.type === "required" && (
                  <p className="error-message">Please choose an assignee</p>
                )}
              </div>
            </div>
          </div>
          <div className="form-section" style={{ marginTop: "42px" }}>
            <div className="input-section">
              <div className="label-container">
                <label className="form-label">Fecha de Vencimiento</label>
              </div>
              <div className="input-container">
                <input
                  className="form-input"
                  type="date"
                  name="due_date"
                  ref={register({ required: true })}
                ></input>
                {errors.due_date?.type === "required" && (
                  <p className="error-message">Por favor selecciona una fecha de vencimiento</p>
                )}
              </div>
            </div>

            <div className="input-section">
              <div className="label-container">
                <label
                  className="form-label"
                  style={{ padding: "10px 5px 10px 0px" }}
                >
                  Marcar como Completada
                </label>
              </div>
              <div className="input-container">
                <input
                  style={{
                    margin: "0px 0px 14px 40px",
                    width: "16px",
                    height: "16px",
                  }}
                  type="checkbox"
                  name="completed"
                  //here
                  defaultChecked={false}
                  ref={register}
                ></input>
              </div>
            </div>
          </div>
        </div>

        {
          selectedActivityType === "3" ? (
            <div>
              <div className="label-container">
                <label className="form-label">Definición de la Prueba</label>
              </div>
              <div>
                <textarea
                  name="definicion_de_prueba"
                  type="text"
                  placeholder={"Definición de la Prueba"}
                  style={{ width: "100%", height: "100px" }}
                  className="textarea"
                  ref={register({ required: true })}
                  value={testDefinition}
                  onChange={(e) => setTestDefinition(e.target.value)}
                ></textarea>
              </div>
              <div className="label-container">
                <label className="form-label">Casos de Prueba</label>
              </div>
              <div>
                <textarea
                  name="casos_de_prueba"
                  type="text"
                  placeholder={"Casos de Prueba"}
                  style={{ width: "100%", height: "100px" }}
                  className="textarea"
                  ref={register({ required: true })}
                  value={testCases}
                  onChange={(e) => setTestCases(e.target.value)}>
                </textarea>
              </div>
              <div style={{ marginTop: "20px" }}>
                <h4>Criterios de Aceptación</h4>
                <ul>
                  {criteria.map((criterion, index) => (
                    <li key={index}>{criterion}</li>
                  ))}
                </ul>
                <input
                  type="text"
                  value={newCriterion}
                  onChange={(e) => setNewCriterion(e.target.value)}
                  placeholder="Añadir criterio de aceptación"
                />
                <button type="button" onClick={handleAddCriterion}>
                  Añadir
                </button>
              </div>
            </div>
          ) : null
        }
        <div>
          <textarea
            name="description"
            type="text"
            placeholder={"Descripción de la tarea"}
            className="edit-task-description textarea"
            ref={register}
          ></textarea>
        </div>

        <div className="form-button-container">
          <Button
            style={{ color: "#0093ff" }}
            onClick={showSideTaskForm}
            color="primary"
          >
            Cancelar
          </Button>
          <Button style={{ color: "#0093ff" }} type="submit" color="primary">
            Añadir
          </Button>
        </div>
      </form>
      {/* </div> */}
      {/* </Modal> */}
    </div>
  );
};

export default AddTaskProjectForm;
