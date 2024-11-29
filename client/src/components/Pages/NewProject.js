import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { Modal } from "@material-ui/core";
import apiServer from "../../config/apiServer";
import Loader from "../Loader";
import TopNavBar from "../NavigationBar/TopNavBar";
import TaskListForm from "../Forms/TaskListForm";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import AddTaskProjectForm from "../Forms/AddTaskProjectForm";
import TaskDetailsForm from "../tasks/TaskDetailsForm";

import "../../css/Project.css";
import "../../css/TaskList.css";

const ProjectPage = () => {
  const { projectId, projectName, teamId } = useParams();
  const [openTasklistForm, setOpenTasklistForm] = useState(false);
  const [tasks, setTasks] = useState();
  const [project, setProject] = useState();
  const [tasklists, setTasklists] = useState();

  const [openTaskProjectForm, setOpenTaskProjectForm] = useState(false);
  const [tasklistTasks, setTasklistTasks] = useState();
  const [openTaskDetailForm, setOpenTaskDetailForm] = useState(false);

  const [loading, setLoading] = useState(true);

  const openTasklistFormModal = () => {
    setOpenTasklistForm(true);
  };

  const closeTasklistFormModal = () => {
    setOpenTasklistForm(false);
  };

  const openTaskDetailFormModal = () => {
    setOpenTaskDetailForm(true);
  };

  const closeTaskDetailFormModal = () => {
    setOpenTaskDetailForm(false);
  };

  const onDragEnd = async (result) => {

    const { destination, source, draggableId, type } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (type === "column") {
      const redorderedLists = reorderTasklists(
        tasklists,
        source.index,
        destination.index
      );

      setTasklists(redorderedLists);

      redorderedLists.map((list, index) => {
        return updateTasklist(index, list.id, list.column_index);
      });
    }

    if (type === "task") {
      updateTasks(source, destination, draggableId);
      const destinationTasklistId = destination.droppableId.split("-")[0];
      const destinationIndexId = destination.droppableId.split("-")[1];
      const sourceTasklistId = source.droppableId.split("-")[0];
      const sourceIndexId = source.droppableId.split("-")[1];
      const destinationTaskIndex = destination.index;
      const sourceTaskIndex = source.index;

      let sourceTasklist = tasklists[sourceIndexId].Tasks;

      let destinationTasklist = tasklists[destinationIndexId].Tasks;

      reorderTasks(sourceTasklist, destinationTasklist, source, destination);
    }
  };

  const reorderTasklists = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const reorderTasks = (
    sourceTasklist,
    destinationTasklist,
    source,
    destination
  ) => {
    let sourceTask = sourceTasklist.splice(source.index, 1);
    destinationTasklist.splice(destination.index, 0, sourceTask[0]);

  };

  const updateTasklist = async (newIndex, tasklistId, columnIndex) => {
    await apiServer.put(`/tasklist/${tasklistId}/columnindex/`, { newIndex });
  };

  const updateTasks = async (source, destination, draggableId) => {
    const sourceColumnId = source.droppableId;
    const destinationTasklistId = destination.droppableId.split("-")[0];
    const destinationIndexId = destination.droppableId.split("-")[1];
    const sourceTasklistId = source.droppableId.split("-")[0];
    const sourceIndexId = source.droppableId.split("-")[1];
    const taskId = draggableId;
    const updatedTasklist = await apiServer.put(`/task/${taskId}/tasklist`, {
      destinationTasklistId,
    });

    const destinationIndex = destination.index; //index of task in tasklist
    const updatedTaskIndex = await apiServer.put(`/task/${taskId}/taskindex`, {
      destinationIndex,
    });
  };

  const getProject = async () => {
    try {
      const res = await apiServer.get(`/project/${projectId}`);
      const resp = await apiServer.get(`/project/${projectId}/tasklists`);
      setProject(res.data);
      setTasklists(resp.data);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  //----------------------------------------------------------------------------
  const openTaskProjectFormModal = () => {
    setOpenTaskProjectForm(true);
  };

  const closeTaskProjectFormModal = () => {
    setOpenTaskProjectForm(false);
  };

  useEffect(() => {
    getProject();
  }, [setProject, setTasklists, setTasks]);

  if (loading) {
    return <Loader />;
  }

  const tasklistFormModal = (
    <div className="modal-container">
      <TaskListForm
        setTasklists={setTasklists}
        projectId={projectId}
        clickClose={closeTasklistFormModal}
        open={openTasklistForm}
      ></TaskListForm>
    </div>
  );

  const renderedTasklists = tasklists.map((tasklist, index) => {

    return (
      <div key={tasklist.id}>
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
              <Droppable
                type="task"
                droppableId={`${tasklist.id.toString()}-${index.toString()}`}
              >
                {(provided) => (
                  <div
                    className="tasklist-task--list"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {tasklist.Tasks.map((task, index) => {
                      return (
                        <div key={task.id}>
                          <Draggable
                            draggableId={`${task.id.toString()}`}
                            type="task"
                            key={`${task.id}`}
                            //this index needs to pull from tasksArray
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
                            <Modal
                              open={openTaskDetailForm}
                              onClose={closeTaskDetailFormModal}
                              style={{ backgroundColor: "white" }}
                            >
                              <div className="modal-container">
                                <TaskDetailsForm
                                  // setTasks={setTasks}
                                  setTasklistTasks={setTasklistTasks}
                                  task={task}
                                  closeModal={closeTaskDetailFormModal}
                                />
                              </div>
                            </Modal>
                          </div>
                        </div>
                      );
                    })}
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
          <Modal
            className="modal"
            style={{ backgroundColor: "white" }}
            open={openTaskProjectForm}
            onClose={closeTaskProjectFormModal}
          >
            <div className="modal-container">
              <AddTaskProjectForm
                setTasklists={setTasklists}
                setTasklistTasks={setTasklistTasks}
                tasklistId={tasklist.id}
                projectId={tasklist.project_id}
                clickClose={closeTaskProjectFormModal}
                open={openTaskProjectForm}
              ></AddTaskProjectForm>
            </div>
          </Modal>
        </div>
      </div>
    );
  });

  return (
    <div>
      <div>
        <TopNavBar name={project.name} setTasklists={setTasklists} />
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable
            droppableId="all-columns"
            direction="horizontal"
            type="column"
          >
            {(provided) => (
              <div
                className="project-container"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {renderedTasklists}
                <div
                  className="tasklist-new-tasklist--button"
                  onClick={openTasklistFormModal}
                >
                  + Add List
                </div>
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
      <Modal open={openTasklistForm} onClose={closeTasklistFormModal}>
        {tasklistFormModal}
      </Modal>
    </div>
  );
};

export default ProjectPage;
