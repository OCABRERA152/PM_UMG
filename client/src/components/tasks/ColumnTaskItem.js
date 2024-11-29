import React, { useContext } from "react";
import { Draggable } from "react-beautiful-dnd";
import Pin from "../../assets/pin";
import Comments from "../../assets/comments";
import moment from "moment";
import { Context as TaskContext } from "../../context/store/TaskStore";
import apiServer from "../../config/apiServer";

const ColumnTaskItem = ({
  task,
  index,
  showSideTaskDetails,
  sideTaskDetails,
}) => {
  const [taskState, taskdispatch] = useContext(TaskContext);
  
  const actividadBackground = {
    "1": "#f7f8fa", // Color para tipo de actividad 1
    "2": "#ffe0e0", // Color para tipo de actividad 2
    "3": "#B3E5FC", // Color para tipo de actividad 3
  };

  const backgroundColor = actividadBackground[task.activity_type_id] || "#ffffff";

  const date = moment(
    task.due_date.substring(0, 10).replace("-", ""),
    "YYYYMMDD"
  );

  const setTaskPopOut = async () => {
    if (sideTaskDetails === false) {
      showSideTaskDetails();
      taskdispatch({ type: "get_selected_task", payload: null });
      const res = await apiServer.get(`/task/${task.id}`);
      await taskdispatch({ type: "get_selected_task", payload: res.data });
    } else {
      taskdispatch({ type: "get_selected_task", payload: null });
      const res = await apiServer.get(`/task/${task.id}`);
      await taskdispatch({ type: "get_selected_task", payload: res.data });
    }
  };

  return (
    <div key={task?.id}>
      <Draggable
        draggableId={`${task?.id.toString()}`}
        type="task"
        key={`${task?.id}`}
        index={index}
      >
        {(provided, snapshot) => (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            className="task-project-item"
            style={{ ...provided.draggableProps.style,  backgroundColor }}
            // onClick={openTaskDetailFormModal}
            onClick={setTaskPopOut}
          >
            <div className="task-project-container-left">
              <div className="task-project-name">{task.name}</div>
              <div className="task-project-icons">
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Pin />{" "}
                  <p style={{ color: "darkgray", marginLeft: "5px" }}>8</p>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Comments />{" "}
                  <p style={{ color: "darkgray", marginLeft: "5px" }}>9</p>
                </div>
              </div>
            </div>
            <div className="task-project-container-right">
              <div className="task-project-assignee-avatar">
                <div className="user-avatar">
                  {(task.User.name[0] + task.User.name[1]).toUpperCase()}
                </div>
              </div>
              <div className="task-project-due_date">
                <p style={{ color: "darkgray" }}>{date.format("MMM D")}</p>
              </div>
            </div>
          </div>
        )}
      </Draggable>
    </div>
  );
};

export default ColumnTaskItem;
