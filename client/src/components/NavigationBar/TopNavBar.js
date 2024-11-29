import React, { useContext, useState } from "react";
import AuthContext from "../../context/AuthContext";
import "../../css/Navbar.css";
import UserAvatar from "./UserAvatar";
import { Menu, MenuItem } from "@material-ui/core";
import { Context as UserContext } from "../../context/store/UserStore";

const TopNavBar = ({ name, setTeamProjects, setTasklists, sidebar }) => {
  const { logout } = useContext(AuthContext);

  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorEle, setAnchorEle] = useState(null);
  const [openProject, setOpenProject] = useState(false);
  const [openTask, setOpenTask] = useState(false);
  const [userState, userdispatch] = useContext(UserContext);

  const handleNewClose = () => {
    setAnchorEl(null);
  };

  const handleProfClick = (event) => {
    setAnchorEle(event.currentTarget);
  };

  const handleProfClose = () => {
    setAnchorEle(null);
  };

  return (
    <div className="top-nav-bar-container">
      <div className="top-nav-bar-left">
        <h2>{name}</h2>
      </div>
      <div className="top-nav-bar-right" style={{}}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <div style={{ padding: "0" }}>
            <UserAvatar id={localStorage.getItem("userId")} />
          </div>
          <div>{userState.user.name}</div>
          <div
            onClick={handleProfClick}
            style={{ padding: "0", cursor: "pointer" }}
          >
            <i className="arrow"></i>
          </div>
        </div>

        <Menu
          style={{ marginTop: "40px" }}
          anchorEl={anchorEle}
          keepMounted
          open={Boolean(anchorEle)}
          onClose={handleProfClose}>
          <MenuItem onClick={logout}>Cerrar Sesión</MenuItem>
        </Menu>
      </div>
    </div>
  );
};

export default TopNavBar;
