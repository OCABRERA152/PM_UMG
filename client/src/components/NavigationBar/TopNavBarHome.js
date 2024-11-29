import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/AuthContext";
import "../../css/Navbar.css";
import UserAvatar from "./UserAvatar";
import { Menu, MenuItem } from "@material-ui/core";
import { Context as UserContext } from "../../context/store/UserStore";

const TopNavBarHome = () => {
  const { logout } = useContext(AuthContext);
  const [userState, userdispatch] = useContext(UserContext);

  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorEle, setAnchorEle] = useState(null);
  const [openProject, setOpenProject] = useState(false);
  const [openTask, setOpenTask] = useState(false);

  const handleProfClick = (event) => {
    setAnchorEle(event.currentTarget);
  };
  const handleProfClose = () => {
    setAnchorEle(null);
  };
  return (
    <div className="top-nav-bar-container" style={{}}>
      <div
        className="top-nav-bar-left"
        style={{ display: "flex", flexDirection: "column" }}
      ></div>
      <div className="top-nav-bar-middle"></div>
      <div className="top-nav-bar-right" style={{}}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}>
          <div style={{ padding: "0" }}>
            <UserAvatar id={localStorage.getItem("userId")} />
          </div>
          <div>
            <p style={{ fontWeight: 500 }}>{userState.user.name}</p>
          </div>
          <div
            onClick={handleProfClick}
            style={{ padding: "0", cursor: "pointer" }}>
            <i className="arrow"></i>
          </div>
        </div>

        <Menu
          style={{ marginTop: "40px" }}
          anchorEl={anchorEle}
          keepMounted
          open={Boolean(anchorEle)}
          onClose={handleProfClose}
        >
          <MenuItem onClick={logout}>Cerrar Sesión</MenuItem>
        </Menu>
      </div>
    </div>
  );
};

export default TopNavBarHome;
