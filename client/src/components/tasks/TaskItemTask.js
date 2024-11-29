import React, { useState, useContext } from "react";
import moment from "moment";
import "../../css/Modal.css";
import TaskDetailsForm from "../tasks/TaskDetailsForm";
import {
  RiCheckboxBlankCircleLine,
  RiCheckboxCircleLine,
} from "react-icons/ri";
import { Context as TaskContext } from "../../context/store/TaskStore";
import apiServer from "../../config/apiServer";

const TaskItemTask = ({
  task,
  showSideTaskDetails,
  sideTaskDetails,
  setInitialLoad,
}) => {
  const [taskState, taskdispatch] = useContext(TaskContext);
  const [open, setOpen] = useState(false);

  const date = moment(
    task.due_date.substring(0, 10).replace("-", ""),
    "YYYYMMDD"
  );

  const closeModal = () => {
    setOpen(false);
  };

  const setTaskPopOut = async () => {
    if (sideTaskDetails === false) {
      showSideTaskDetails();
      taskdispatch({ type: "get_selected_task", payload: null });
      const res = await apiServer.get(`/task/${task.id}`);
      await taskdispatch({ type: "get_selected_task", payload: res.data });
      setInitialLoad(false);
    } else {

      taskdispatch({ type: "get_selected_task", payload: null });
      const res = await apiServer.get(`/task/${task.id}`);
      await taskdispatch({ type: "get_selected_task", payload: res.data });
      setInitialLoad(false);
    }
  };

  const body = (
    <div className="modal-container">
      <TaskDetailsForm task={task} closeModal={closeModal} />
    </div>
  );
  return (
    <>
      <li className="task-task-item" onClick={setTaskPopOut}>
        <div style={{ display: "flex", alignItems: "center" }}>
          {task.completed ? (
            <RiCheckboxCircleLine
              style={{ color: "green", fontSize: "16px" }}
            />
          ) : (
            <RiCheckboxBlankCircleLine style={{ fontSize: "16px" }} />
          )}
          <p
            style={{
              paddingLeft: "5px",
              color: "gray",
              WebkitUserSelect: "none",
              MozUserSelect: "none",
              msUserSelect: "none",
            }}
          >
            {task.name}
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            className={`task-project-home-name-container task-project-${task.Project.id}`}
          >
            <p
              style={{
                margin: "0px",
                padding: "5px",
                fontSize: "12px",
                fontWeight: "500",
                WebkitUserSelect: "none",
                MozUserSelect: "none",
                msUserSelect: "none",
              }}
            >
              {task.Project.name}
            </p>
          </div>
          <div
            style={{
              width: "73px",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <p
              style={{
                color: "gray",
                WebkitUserSelect: "none",
                MozUserSelect: "none",
                msUserSelect: "none",
              }}
            >
              {date.format("MMM D YYYY")}
            </p>
          </div>
        </div>
      </li>
    </>
  );
};

export default TaskItemTask;
