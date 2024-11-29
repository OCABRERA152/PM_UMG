import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import apiServer from "../../config/apiServer";
import Loader from "../Loader";
import TopNavBar from "../NavigationBar/TopNavBar";
import TaskListForm from "../Forms/TaskListForm";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import PopOutTaskDetails from "../PopOutMenu/PopOutTaskDetails";
import AddTasklistPopOut from "../PopOutMenu/AddTasklistPopOut";
import AddTaskPopOutProjectPage from "../PopOutMenu/AddTaskPopOutProjectPage";
import { Context as TaskContext } from "../../context/store/TaskStore";
import "../../css/Project.css";
import "../../css/TaskList.css";
import ColumnTasklist from "../tasks/ColumnTasklist";

const ProjectPage = ({ sidebar }) => {
  const { projectId, projectName, teamId } = useParams();
  const [taskState, taskdispatch] = useContext(TaskContext);
  const [openTasklistForm, setOpenTasklistForm] = useState(false);
  const [tasks, setTasks] = useState();
  const [project, setProject] = useState();
  const [tasklists, setTasklists] = useState();
  const [taskCatalogStatus, setTaskCatalogStatus] = useState();

  const [sideTaskForm, setSideTaskForm] = useState(false);
  const [sideTasklistForm, setSideTasklistForm] = useState(false);
  const [sideTaskDetails, setSideTaskDetails] = useState(false);

  const showSideTaskForm = () => {
    setSideTaskDetails(false);
    setSideTasklistForm(false);
    setSideTaskForm(!sideTaskForm);
  };

  const showSideTasklistForm = () => {
    setSideTaskDetails(false);
    setSideTaskForm(false);
    setSideTasklistForm(!sideTasklistForm);
  };

  const showSideTaskDetails = () => {
    setSideTasklistForm(false);
    setSideTaskForm(false);
    setSideTaskDetails(!sideTaskDetails);
  };

  const [loading, setLoading] = useState(true);

  // const openTasklistFormModal = () => {
  //   setOpenTasklistForm(true);
  // };

  const closeTasklistFormModal = () => {
    setOpenTasklistForm(false);
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

      // setTasklists(redorderedLists);

      redorderedLists.map(async (list, index) => {
        return await updateTasklist(index, list.id, list.column_index);
      });

      await getProject();
    }

    if (type === "task")
    {

      const destinationTasklistId = destination.droppableId.split("-")[0];
      const destinationIndexId = destination.droppableId.split("-")[1];
      const sourceTasklistId = source.droppableId.split("-")[0];
      const sourceIndexId = source.droppableId.split("-")[1];
      const destinationTaskIndex = destination.index;
      const sourceTaskIndex = source.index;

      const taskCatalogStatusId = parseInt(destinationIndexId) + 1;

      await apiServer.put(`/task/${draggableId}/task-catalog-status`, { taskCatalogStatusId });

      await updateTasks(source, destination, draggableId);

      let sourceTasklist = tasklists[sourceIndexId].Tasks;

      let destinationTasklist = tasklists[destinationIndexId].Tasks;

      // reorderTasks(sourceTasklist, destinationTasklist, source, destination);

      await getProject();
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

    const destinationIndex = destination.index;
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

  useEffect(() => {
    getProject();
    taskdispatch({ type: "get_selected_task", payload: null });
  }, [setProject, setTasklists, setTasks]);

  if (loading) {
    return <Loader />;
  }

  //Task list creation
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
      <ColumnTasklist
        key={index}
        tasklist={tasklist}
        index={index}
        setTasklists={setTasklists}
        showSideTaskDetails={showSideTaskDetails}
        sideTaskDetails={sideTaskDetails}
        showSideTaskForm={showSideTaskForm}
      />
    );
  });

  return (
    <>
      <TopNavBar
        name={project.name}
        setTasklists={setTasklists}
        sidebar={sidebar}
      />
      <div className="project-page-container">
        <div className="project-page-main-content">
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
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          {sideTaskDetails && taskState.selectedTask ? (
            <PopOutTaskDetails
              showSideTaskDetails={showSideTaskDetails}
              sideTaskDetails={sideTaskDetails}
              setTasklists={setTasklists}
            />
          ) : null}
          {sideTasklistForm ? (
            <AddTasklistPopOut
              showSideTasklistForm={showSideTasklistForm}
              title={"Añadir Lista de Tareas"}
              setTasklists={setTasklists}
            />
          ) : null}
          {sideTaskForm ? (
            <AddTaskPopOutProjectPage
              showSideTaskForm={showSideTaskForm}
              title={"Añadir Tarea"}
              setTasklists={setTasklists}
            />
          ) : null}
        </div>
      </div>
    </>
  );
};

export default ProjectPage;
