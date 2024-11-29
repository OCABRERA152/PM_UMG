import React, { useState, useContext, useEffect, useParams } from "react";
import { useForm } from "react-hook-form";
import { RiCloseLine } from "react-icons/ri";
import { Context as TaskContext } from "../../context/store/TaskStore";
import { Context as ProjectContext } from "../../context/store/ProjectStore";
import moment from "moment";
import UserAvatar from "../NavigationBar/UserAvatar";
import apiServer from "../../config/apiServer";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { BiCheck } from "react-icons/bi";

const PopOutTaskDetails = ({ showSideTaskDetails, sideTaskDetails, setTasklists }) => {
  const [taskState, taskdispatch] = useContext(TaskContext);
  const { selectedTask: task } = taskState;
  const [projectState, projectdispatch] = useContext(ProjectContext);
  const [teamDescription, setTeamDescription] = useState(task.description);
  const [projectUsers, setProjectUsers] = useState(task.Project.Users);
  const [assigneeUser, setAssigneeUser] = useState(task.User);
  const [taskComments, setTaskComments] = useState(task.Comments);
  const [dueDate, setDueDate] = useState(new Date(task.due_date));
  const [activityTypes, setActivityTypes] = useState([]);
  const [progressLevel, setProgressLevel] = useState([
    0,
    25,
    50,
    75,
    100
  ]);

  const [selectedStatus, setSelectedStatus] = useState(task.TaskStatusCatalog.id);
  const [selectedProgress, setSelectedProgress] = useState(task.progressTracking.porcentajeCompleto);
  const [selectedActivityType, setSelectedActivityType] = useState(task.ActivityType.id);

  const [testCases, setTestCases] = useState(task?.testPlan?.casos_de_prueba);
  const [testDefinition, setTestDefinition] = useState(task?.testPlan?.definicion_de_prueba);

  const [criteriosAceptacion, setCriteriosAceptacion] = useState(task?.testPlan?.AcceptanceCriteria);

  const [commentBox, setCommentBox] = useState(false);
  const [taskCatalogStatus, setTaskCatalogStatus] = useState();

  var completed = task.completed;
  
  const date = moment(
    task.due_date.substring(0, 10).replace("-", ""),
    "YYYYMMDD"
  );

  const taskId = task.id;

  const { register, handleSubmit, clearErrors } = useForm();

  const refreshTaskList = async () => {
    const resp = await apiServer.get(`/project/${task.Project.id}/tasklists`);
    setTasklists(resp.data);
  };

  const getTaskCatalogStatus = async () => {
    try {
      const res = await apiServer.get(`/task-catalog-status`);
      setTaskCatalogStatus(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getActivityTypes = async () => {
    try {
      const res = await apiServer.get(`/activity-types`);
      setActivityTypes(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getProjectUsers = async (event) => {
    var projectSelect = document.getElementById("project-select");

    clearErrors(projectSelect.name);

    const res = await apiServer.get(`/project/${projectSelect.value}/team`);
    const userList = res.data.Users.filter((user) => {
      return user.id !== task.User.id;
    });

    setProjectUsers(userList);
    updateProject();
  };

  const updateProject = async (e) => {
    var projectId = document.getElementById("project-select").value;
    const userId = localStorage.getItem("userId");
    await apiServer.put(`/task/${task.id}/project/${projectId}`);
    const res = await apiServer.get(`/task/user/${userId}`);
    await taskdispatch({ type: "get_user_tasks", payload: res.data });
  };

  const updateTaskCatalogStatus = async (catalogStatusId) => {

    // var taskCatalogStatusId = selectedStatus;
    const userId = localStorage.getItem("userId");
    var task = await apiServer.put(`/task/${taskId}/task-catalog-status`, { taskCatalogStatusId: catalogStatusId });
    const res = await apiServer.get(`/task/user/${userId}`);

    await taskdispatch({ type: "get_user_tasks", payload: res.data });
    await refreshTaskList();
  };

  const handleUpdateTaskCatalogStatus = async (event) => {

    setSelectedStatus(event.target.value);

    await updateTaskCatalogStatus(event.target.value);
  };

  const updateActivityType = async (activityTypeId) => {
    
    await apiServer.put(`/task/${task?.id}/activitytype`, { activityTypeId });

    const userId = localStorage.getItem("userId");

    const res = await apiServer.get(`/task/user/${userId}`);
    await taskdispatch({ type: "get_user_tasks", payload: res.data });
    await refreshTaskList();
  };

  const handleActivityChange = async (event) => {
    setSelectedActivityType(event.target.value);
    await updateActivityType(event.target.value);
  };

  const updateAssignee = async (e) => {
    var assigneeId = document.getElementById("assignee-select").value;

    await apiServer.put(`/task/${task.id}/assignee/${assigneeId}`);
    const assignee = await apiServer.get(`/task/${task.id}`);
    setAssigneeUser(assignee.data.User);
    const userId = localStorage.getItem("userId");
    const res = await apiServer.get(`/task/user/${userId}`);
    await taskdispatch({ type: "get_user_tasks", payload: res.data });
  };

  const handleProgressChange = (event) => {
    setSelectedProgress(event.target.value);
};

  const updateProgressLevel = async (e) => {
    
    await apiServer.put(`/task/${task.id}/progresstracking`, {
      progressLevel: selectedProgress
    });

    const userId = localStorage.getItem("userId");

    const res = await apiServer.get(`/task/user/${userId}`);
    await taskdispatch({ type: "get_user_tasks", payload: res.data });
  };

  const updateDueDate = async (date) => {
    setDueDate(date);
    await apiServer.put(`/task/${task.id}/dueDate`, { date });
  };
  const updateDescription = async (e) => {
    const description = e.target.value;
    await apiServer.put(`/task/${task.id}/description`, { description });
  };

  const handleDescriptionUpdate = (e) => {
    setTeamDescription(e.target.value);
  };

  const handleCommentSubmit = async ({ text }) => {
    const user_id = localStorage.getItem("userId");
    await apiServer.post(`/task/${task.id}/comment`, {
      text,
      user_id,
    });

    const comments = await apiServer.get(`/task/${task.id}/comment`);
    setTaskComments(comments.data);
    updateScroll();
  };


  const handleCheckboxChange = async (id) => {

    const criterio = criteriosAceptacion.find(criterion => criterion.id === id);

    if (!criterio) return;

    // Actualiza el estado local de forma optimista
    const updatedCriterios = criteriosAceptacion.map(criterion =>
      criterion.id === id ? { ...criterion, completed: !criterion.completed } : criterion
    );

    setCriteriosAceptacion(updatedCriterios);

    await apiServer.put(`/task/${task.id}/criterios-aceptacion/${id}`, {
      completed: !criterio.completed
    });
  };

  const handleMarkComplete = async () => {
    await updateComplete();
  };

  const updateComplete = async () => {

    completed = !completed;

    const userId = localStorage.getItem("userId");

    const updatedTask = await apiServer.put(`/task/${task.id}/complete`, {
      completed,
    });
    
    await taskdispatch({
      type: "get_selected_task",
      payload: updatedTask.data,
    });

    const res = await apiServer.get(`/task/user/${userId}`);
    await taskdispatch({ type: "get_user_tasks", payload: res.data });
  };
  const expandCommentBox = () => {
    setCommentBox(!commentBox);
  };

  function updateScroll() {
    var element = document.getElementById("scrollable");
    element.scrollTop = element.scrollHeight;
  }

  useEffect(() => {

    getProjectUsers();
    getTaskCatalogStatus();
    getActivityTypes();
  }, []);

  const renderedProjects = projectState.projects
    .filter((project) => {
      return project.id !== task.Project.id;
    })
    .map((project, i) => {
      return (
        <option key={i} id={project.id} value={project.id}>
          {project.name}
        </option>
      );
    });

  const renderedtaskStatusCatalog = taskCatalogStatus?.map((status, i) => {
    return (
      <option key={i} value={status.id} selected={status.id === task.status_id}>
        {status.statusName}
      </option>
    );
  });

  const renderedActivityTypes = activityTypes?.filter(item => {
    if (localStorage.getItem("roleId") === "1") {
      return item;
    }
    else {
      return item.id === task.ActivityType.id;
    }
  }).map((type, i) => {
    return (
      <option
        key={i}
        value={type.id}
        selected={type.id === task.activity_type_id}
      >
        {type.name}
      </option>
    );
  });

  const renderedUsers = projectUsers
    .filter((user) => {
      return user.id !== task.User.id;
    })
    .map((user, i) => {
      return (
        <option key={i} value={user.id}>
          {user.name}
        </option>
      );
    });

  const renderedProgressLevels = progressLevel?.map((level, i) => {
    return (
      <option key={i} value={level}>
        {level}%
      </option>
    );
  });

  const renderedComments = taskComments.map((comment, i) => {
    const commentDate = moment(
      comment.createdAt.substring(0, 10).replace("-", ""),
      "YYYYMMDD"
    ).format("MMM D");

    return (
      <div className="comment-container">
        <div className="comment-header">
          <div
            className="user-avatar"
            style={{
              width: "25px",
              height: "25px",
              marginRight: "10px",
            }}
          >
            {(comment.User.name[0] + comment.User.name[1]).toUpperCase()}
          </div>

          <div>
            <p
              style={{ fontWeight: 500, marginRight: "10px", fontSize: "15px" }}
            >
              {comment.User.name}
            </p>
          </div>
          <div>
            <p style={{ color: "gray", fontSize: "12px" }}>{commentDate}</p>
          </div>
        </div>
        <div className="comment-text">
          <p style={{ fontSize: "15px", margin: "0px" }}>{comment.text}</p>
        </div>
      </div>
    );
  });

  return (
    <>
      <div className={"task-detail-menu active"}>
        <div
          style={{
            display: "flex",
            flex: "1 1 auto",
            flexDirection: "column",
            minHeight: "1px",
            overflow: "hidden",
          }}
        >
          <div className="task-detail-menu-container">
            <div className="task-detail-menu-top">
              <div
                className={
                  completed
                    ? "mark-complete-container__completed"
                    : "mark-complete-container__incompleted"
                }
                onClick={handleMarkComplete}
              >
                <div
                  className={
                    completed
                      ? "complete-button__completed"
                      : "complete-button__incompleted"
                  }
                >
                  <div
                    className="check-mark-container"
                    style={{ margin: "0px 5px" }}
                  >
                    <BiCheck
                      className={
                        completed
                          ? "check-mark-icon__completed"
                          : "check-mark-icon__incompleted"
                      }
                    />
                  </div>
                  <div
                    className={
                      completed
                        ? "mark-complete__completed"
                        : "mark-complete__incompleted"
                    }
                  >
                    Mark Complete
                  </div>
                </div>
              </div>
              <div className="task-detail-close-icon">
                <RiCloseLine
                  style={{
                    color: "black",
                    fontSize: "24px",
                    cursor: "pointer",
                  }}
                  onClick={showSideTaskDetails}
                />
              </div>
            </div>

            {/* <div style={{ height: "80%" }}> */}
            <div
              id="scrollable"
              style={{
                display: "flex",
                flex: "1 1 auto",
                flexDirection: "column",
                minHeight: "1px",
                zIndex: "100",
                padding: "0 24px",
                overflowY: "auto",
                borderBottom: "1px solid lightgrey",
                marginBottom: "5px",
              }}
            >
              <div>
                <form className="task-detail-menu-main-content">
                  <div className="task-detail-title">
                    <h2>{task.name}</h2>
                  </div>
                  <div className="task-details-container">
                    <div className="task-details-subtitles">
                      <p>Asignado a</p>
                      <p>Fecha de Vencimiento</p>
                      <p>Proyecto</p>
                      <p>Status</p>
                      <p>Tipo de Actividad</p>
                      <p>Progreso</p>
                      <p>Descripción</p>
                    </div>
                    <div className="task-details-data">
                      <div
                        className="assignee-select-container"
                        style={{ display: "flex" }}
                      >
                        <div
                          className="user-avatar"
                          style={{
                            width: "25px",
                            height: "25px",
                            marginRight: "10px",
                          }}
                        >
                          {(
                            assigneeUser.name[0] + assigneeUser.name[1]
                          ).toUpperCase()}
                        </div>
                        <select
                          id="assignee-select"
                          name="assigneeId"
                          className="form-input"
                          ref={register({ required: true })}
                          onChange={updateAssignee}
                          style={{ width: "150px" }}
                        >
                          <option
                            value={task.User.id}
                            id={task.User.id}
                            selected
                          >
                            {task.User.name}
                          </option>
                          {localStorage.getItem("roleId") === "1" && renderedUsers}
                        </select>
                      </div>
                      <div
                        className="dueDate-container"
                        style={{ marginTop: "20px" }}
                      >
                        <DatePicker
                          selected={dueDate}
                          onChange={(date) => updateDueDate(date)}
                          // customInput={<DateButton />}
                        />
                      </div>

                      <div
                        className="project-select-container"
                        style={{
                          height: "25px",
                          borderRadius: "20px",
                          alignItems: "center",
                          justifyContent: "center",
                          marginTop: "20px",
                        }}
                      >
                        <select
                          id="project-select"
                          name="projectId"
                          className={`form-input`}
                          onChange={getProjectUsers}
                          defaultValue={task.Project.name}
                          ref={register({ required: true })}
                          onBlur={updateProject}
                          style={{
                            height: "25px",
                            borderRadius: "20px",
                            display: "flex",
                            alignItems: "center",
                            background: "transparent",
                            justifyContent: "center",
                          }}
                        >
                          <option
                            value={task.Project.id}
                            id={task.Project.id}
                            selected
                          >
                            {task.Project.name}
                          </option>
                          {/* {renderedProjects} */}
                        </select>
                      </div>

                      <div
                        className="catalog-status-select-container"
                        style={{
                          height: "25px",
                          borderRadius: "20px",
                          alignItems: "center",
                          justifyContent: "center",
                          marginTop: "20px",
                        }}
                      >
                        <select
                          id="catalog-status-select"
                          name="catalogStatusId"
                          className={`form-input `}
                          onChange={handleUpdateTaskCatalogStatus}
                          value={selectedStatus}
                          ref={register({ required: true })}
                          // onBlur={updateTaskCatalogStatus}
                          style={{
                            height: "25px",
                            borderRadius: "20px",
                            display: "flex",
                            alignItems: "center",
                            background: "transparent",
                            justifyContent: "center",
                          }}
                        >
                          {renderedtaskStatusCatalog}
                        </select>
                      </div>

                      <div
                        className="activity-type-select-container"
                        style={{
                          height: "25px",
                          borderRadius: "20px",
                          alignItems: "center",
                          justifyContent: "center",
                          marginTop: "20px",
                        }}
                      >
                        <select
                          id="activity-type-select"
                          name="activityTypeId"
                          className={`form-input `}
                          onChange={handleActivityChange}
                          ref={register({ required: true })}
                          // onBlur={updateActivityType}
                          value={selectedActivityType}
                          style={{
                            height: "25px",
                            borderRadius: "20px",
                            display: "flex",
                            alignItems: "center",
                            background: "transparent",
                            justifyContent: "center",
                          }}
                        >
                          {renderedActivityTypes}
                        </select>
                      </div>

                      <div
                            className="progress-level-select-container"
                            style={{
                              height: "25px",
                              borderRadius: "20px",
                              alignItems: "center",
                              justifyContent: "center",
                              marginTop: "20px",
                            }}
                          >
                            <select
                              id="progress-level-select"
                              name="progressLevelId"
                              className={`form-input `}
                              onChange={handleProgressChange}
                              // defaultValue={task.Project.name}
                              ref={register({ required: true })}
                              onBlur={updateProgressLevel}
                              value={selectedProgress}
                              style={{
                                height: "25px",
                                borderRadius: "20px",
                                display: "flex",
                                alignItems: "center",
                                background: "transparent",
                                justifyContent: "center",
                              }}
                            >
                              {renderedProgressLevels}
                            </select>
                          </div>

                      {/* {
                        task.ActivityType.id !== 3 ? (
                          <div
                            className="progress-level-select-container"
                            style={{
                              height: "25px",
                              borderRadius: "20px",
                              alignItems: "center",
                              justifyContent: "center",
                              marginTop: "20px",
                            }}
                          >
                            <select
                              id="progress-level-select"
                              name="progressLevelId"
                              className={`form-input `}
                              onChange={handleProgressChange}
                              // defaultValue={task.Project.name}
                              ref={register({ required: true })}
                              onBlur={updateProgressLevel}
                              value={selectedProgress}
                              style={{
                                height: "25px",
                                borderRadius: "20px",
                                display: "flex",
                                alignItems: "center",
                                background: "transparent",
                                justifyContent: "center",
                              }}
                            >
                              {renderedProgressLevels}
                            </select>
                          </div>
                        ) : null
                      } */}

                      <div 
                        className="task-detail-description-container"
                        style={{
                          marginLeft: "0px",
                        }}
                        >
                        <textarea
                          className="task-detail-edit-description"
                          placeholder="Haga clic para agregar una descripción del equipo..."
                          value={teamDescription}
                          onChange={handleDescriptionUpdate}
                          onBlur={updateDescription}
                        ></textarea>
                      </div>
                    </div>
                  </div>
                  {
                    task.ActivityType.id === 3 ? (
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
                            onChange={(e) => setTestCases(e.target.value)}
                            >
                          </textarea>
                        </div>
                        <div style={{ marginTop: "20px" }}>
                          <h4>Criterios de Aceptación</h4>
                          <ul>
                            {criteriosAceptacion.map((criterio) => (
                              <li key={criterio.id}>
                                <label>
                                  <input
                                    type="checkbox"
                                    checked={criterio.completed}
                                    onChange={() => handleCheckboxChange(criterio.id)}
                                  />
                                  {criterio.description}
                                </label>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ) : (
                      null
                    )
                  }
                </form>

                {/* {
                  task.ActivityType.id !== 3 && (
                    <div className="task-detail-user-comments-container">
                      {taskComments.length !== 0 ? (
                        renderedComments
                      ) : (
                        <div>Sin comentarios aún.. </div>
                      )}
                    </div>
                  )
                } */}
              </div>
            </div>
            {/* <div
              className="task-detail-comment-container"
            >
              <div
                className="task-detail-user-comment"
              >
                <div
                  className="task-detail-comment-avatar"
                  style={{ width: "25px", height: "25px", fontSize: "10px" }}
                >
                  <UserAvatar id={localStorage.getItem("userId")} />
                </div>
                <div className="task-detail-comment-box">
                  <form
                    className="task-detail-comment-form"
                    onSubmit={handleSubmit(handleCommentSubmit)}
                    onFocus={expandCommentBox}
                    onBlur={expandCommentBox}
                  >
                    <div style={{ width: "100%", height: "100%" }}>
                      <textarea
                        name="text"
                        className="comment-textarea"
                        placeholder="Haga una pregunta o publique una actualización..."
                        ref={register({ required: true })}
                      ></textarea>
                    </div>
                    <div style={{ alignSelf: "flex-end", marginTop: "10px" }}>
                      <button
                        className="comment-button"
                        style={{ height: "30px", width: "80px" }}
                        type="submit"
                      >
                        Comentar
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default PopOutTaskDetails;
