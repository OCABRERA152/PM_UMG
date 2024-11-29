import React, { useState } from "react";
import { FiPlus } from "react-icons/fi";
import "../../css/Project.css";
const NewProjectTile = ({ showSideProjectForm }) => {
  return (
    <div className="project-tile-container" onClick={showSideProjectForm}>
      <div className="project-tile-box">
        <div className="new-project-tile-icon-container">
          <FiPlus className="new-project-tile-icon" />
        </div>
      </div>
      <div className="project-tile-name">Nuevo Proyecto</div>
    </div>
  );
};

export default NewProjectTile;
