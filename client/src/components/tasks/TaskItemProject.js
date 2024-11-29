import React, { useState } from "react";
import { Modal } from "@material-ui/core";
import { Draggable } from "react-beautiful-dnd";
import TaskDetailsForm from "../tasks/TaskDetailsForm";
import "../../css/Modal.css";

const TaskItemProject = ({ task, index, setTasklistTasks }) => {
  const [openTaskDetailForm, setOpenTaskDetailForm] = useState(false);

  const openTaskDetailFormModal = () => {
    setOpenTaskDetailForm(true);
  };

  const closeTaskDetailFormModal = () => {
    setOpenTaskDetailForm(false);
  };
  const taskDetailModalBody = (
    <div className="modal-container">
      <TaskDetailsForm
        setTasklistTasks={setTasklistTasks}
        task={task}
        closeModal={closeTaskDetailFormModal}
      />
    </div>
  );
  return (
    <div>
      <Draggable
        draggableId={`${task.id.toString()}`}
        type="task"
        index={index}
      >
        {(provided, snapshot) => (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            className="task-project-item"
            onClick={openTaskDetailFormModal}
          >
            {task.name}
          </div>
        )}
      </Draggable>
      <div>
        <Modal open={openTaskDetailForm} onClose={closeTaskDetailFormModal}>
          {taskDetailModalBody}
        </Modal>
      </div>
    </div>
  );
};

export default TaskItemProject;
