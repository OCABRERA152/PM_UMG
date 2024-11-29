import React, { useEffect, useState } from "react";
import TaskItemProject from "./TaskItemProject";
import apiServer from "../../config/apiServer";
import "../../css/TaskList.css";
import Loader from "../Loader";
import { Modal } from "@material-ui/core";
import { Draggable, Droppable } from "react-beautiful-dnd";
import AddTaskProjectForm from "../Forms/AddTaskProjectForm";

const TaskListItem = ({ index, tasklist, tasks, setTasks }) => {
  const [tasklistTasks, setTasklistTasks] = useState();
  const [loading, setLoading] = useState(true);
  const [openTaskProjectForm, setOpenTaskProjectForm] = useState(false);

  const openTaskProjectFormModal = () => {
    setOpenTaskProjectForm(true);
  };

  const closeTaskProjectFormModal = () => {
    setOpenTaskProjectForm(false);
  };

  const updateTasks = async () => {
    const res = await apiServer.get(`/tasklist/${tasklist.id}/tasks`);
    setTasklistTasks(res.data);
    setLoading(false);
  };
  useEffect(() => {
    updateTasks();
  }, [setTasklistTasks]);

  if (loading) {
    return <Loader />;
  }

  const renderedTasks = tasklistTasks.map((task, i) => {
    return (
      <TaskItemProject
        setTasklistTasks={setTasklistTasks}
        task={task}
        key={task.id}
        index={i}
      />
    );
  });

  const taskProjectFormModal = (
    <div className="modal-container">
      <AddTaskProjectForm
        setTasklistTasks={setTasklistTasks}
        tasklistId={tasklist.id}
        projectId={tasklist.project_id}
        clickClose={closeTaskProjectFormModal}
        open={openTaskProjectForm}
      ></AddTaskProjectForm>
    </div>
  );

  return (
    <div>
      <Draggable
        type="tasklist"
        draggableId={`Column-${tasklist.column_index.toString()}`}
        index={index}
        key={`Column-${tasklist.id.toString()}`}
      >
        {(provided) => (
          <div
            className="tasklist-container"
            {...provided.draggableProps}
            ref={provided.innerRef}
            {...provided.dragHandleProps}
          >
            <div className="tasklist-header">{tasklist.name}</div>
            <div className="tasklist-add-task--button"></div>
            <Droppable type="task" droppableId={`${tasklist.id.toString()}`}>
              {(provided) => (
                <div
                  className="tasklist-task--list"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {renderedTasks}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            <div
              className="tasklist-new-task--button"
              onClick={openTaskProjectFormModal}
            >
              + Añadir Tarea
            </div>
          </div>
        )}
      </Draggable>
      <div>
        <Modal open={openTaskProjectForm} onClose={closeTaskProjectFormModal}>
          {taskProjectFormModal}
        </Modal>
      </div>
    </div>
  );
};

export default TaskListItem;
