"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserProject extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UserProject.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      project_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "UserProject",
      tableName: "UserProjects",
      hooks: {
        afterCreate: async (userProject, options) => {
          
          const { TaskList } = sequelize.models;

          // Define los estados iniciales
          var initialStates = [
            { name: "Por Hacer", column_index: 0 },
            { name: "En Progreso", column_index: 1 },
            { name: "Plan Pruebas", column_index: 2 },
            { name: "Completado", column_index: 3 },
            { name: "Cancelado", column_index: 4 },
          ];

          initialStates = initialStates.map((state) => ({
              name: state.name,
              project_id: userProject.project_id,
              column_index: state.column_index,
              owner_id: userProject.user_id, // Asegúrate de definir el propietario según tu lógica
            }));

          await TaskList.bulkCreate(initialStates);
        },
      }
    }
  );
  return UserProject;
};
