import React, { useEffect, useState, useContext } from "react";
import { Redirect, useParams } from "react-router-dom";
import TopNavBar from "../NavigationBar/TopNavBar";
import apiServer from "../../config/apiServer";
import Loader from "../Loader";
import "../../css/TeamPage.css";
import { Menu, MenuItem } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { Context as TeamContext } from "../../context/store/TeamStore";
import TeamMemberIcon from "../teams/TeamMemberIcon";
import ProjectTile from "../projects/ProjectTile";
import NewProjectTile from "../projects/NewProjectTile";
import NewTeamMemberIcon from "../teams/NewTeamMemberIcon";
import AddProjectPopOut from "../PopOutMenu/AddProjectPopOut";
import { AiOutlineEllipsis } from "react-icons/ai";

const TeamPage = () => {
  const { teamId, teamName } = useParams();
  const [team, setTeam] = useState();
  const [teamProjects, setTeamProjects] = useState();
  const [teamUsers, setTeamUsers] = useState(null);
  const [teamDescription, setTeamDescription] = useState();
  const [loading, setLoading] = useState(true);
  const [anchorMenu, setAnchorMenu] = useState(null);
  const [sideProjectForm, setSideProjectForm] = useState(false);
  const [teamState, teamdispatch] = useContext(TeamContext);
  let history = useHistory();

  const roleId = localStorage.getItem("roleId");

  const showSideProjectForm = () => {
    setSideProjectForm(!sideProjectForm);
  };

  const getTeam = async () => {
    try {
      const res = await apiServer.get(`/team/${teamId}`);

      setTeam(res.data);
      setTeamProjects(res.data.Projects);
      setTeamUsers(res.data.Users);
      setTeamDescription(res.data.description);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleMenuClick = (event) => {
    setAnchorMenu(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorMenu(null);
  };

  const leaveTeam = async () => {
    const userId = localStorage.getItem("userId");
    handleMenuClose();
    await apiServer.delete(`/userteam/${teamId}/user/${userId}`);
    const res = await apiServer.get(`/team/user/${userId}`);
    await teamdispatch({ type: "get_user_teams", payload: res.data });
    history.push("/");
  };

  const handleUpdate = (e) => {
    setTeamDescription(e.target.value);
  };

  const updateDescription = async (e) => {
    const description = e.target.value;
    await apiServer.put(`/team/${teamId}/description`, { description });
    console.log(e.target.value);
  };

  useEffect(() => {
    getTeam();
  }, [teamId, teamName, setTeam, setTeamProjects, setTeamUsers]);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <TopNavBar name={teamName} setTeamProjects={setTeamProjects} />
      <div className="team-page-container">
        <div className="team-page-content-container">
          <div className="team-page-content-left">
            <div className="team-content-left-description-container">
              <div className="team-content-left-description-header">
                <div className="team-content-title">Descripción</div>
              </div>
              <form className="team-content-left-description-form">
                <textarea
                  className="edit-description"
                  placeholder="Click para añadir una descripción del equipo..."
                  value={teamDescription}
                  onChange={handleUpdate}
                  onBlur={updateDescription}
                  disabled={roleId == "1" ? false : true}
                ></textarea>
              </form>
            </div>
            <div className="team-content-left-members-container">
              <div className="team-content-left-members-header">
                <div className="team-content-title">Miembros</div>
                <div>
                  <AiOutlineEllipsis onClick={handleMenuClick} />
                  <Menu
                    style={{ marginTop: "40px" }}
                    anchorEl={anchorMenu}
                    keepMounted
                    open={Boolean(anchorMenu)}
                    onClose={handleMenuClose}
                  >
                    <MenuItem onClick={leaveTeam}>Salir del Team</MenuItem>
                  </Menu>
                </div>
              </div>
              <div className="team-content-left-members--list">
                {teamUsers === undefined ? (
                  <Redirect to="/" />
                ) : (
                  teamUsers.map((user, i) => {
                    return <TeamMemberIcon user={user} key={i} />;
                  })
                )}

                {roleId == "1" && (
                  <NewTeamMemberIcon
                    setTeamUsers={setTeamUsers}
                    teamId={teamId}
                    teamName={teamName}
                  />
                )}
              </div>
            </div>
          </div>
          <div className="team-page-content-right">
            <div className="team-content-right-header">
              <div className="team-content-title">Proyectos</div>
            </div>
            <div className="team-content-right-projects--list">
              {teamProjects === undefined ? (
                <Redirect to="/" />
              ) : (
                teamProjects.map((project, i) => {
                  return (
                    <ProjectTile
                      teamId={teamId}
                      project={project}
                      key={i}
                      id={project.id}
                    />
                  );
                })
              )}
              {/* {projectsList} */}
              {roleId == "1" && <NewProjectTile showSideProjectForm={showSideProjectForm} />}
              {/* <NewProjectTile showSideProjectForm={showSideProjectForm} /> */}
            </div>
          </div>
        </div>
        {sideProjectForm ? (
          <AddProjectPopOut
            showSideProjectForm={showSideProjectForm}
            setTeamProjects={setTeamProjects}
            title={"Añadir Proyecto"}
          />
        ) : null}
      </div>
    </>
  );
};

export default TeamPage;
