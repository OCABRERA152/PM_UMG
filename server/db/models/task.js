"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Task.belongsTo(models.TaskList, {
        foreignKey: "tasklist_id",
      });

      Task.belongsTo(models.User, {
        foreignKey: "assignee_id",
      });

      Task.belongsTo(models.Project, {
        foreignKey: "project_id",
      });

      Task.belongsTo(models.TaskStatusCatalog, {
        foreignKey: "status_id",
      });

      Task.belongsTo(models.ActivityType, {
        foreignKey: "activity_type_id",
      });

      Task.hasMany(models.Comment, {
        foreignKey: "task_id",
        onDelete: "cascade",
        hooks: true,
      });

      // Nueva relación con ProgressTracking
      Task.hasOne(models.ProgressTracking, {
        foreignKey: "task_id",
        as: "progressTracking",  // Nombre del alias
      });

      Task.hasOne(models.TestPlan, {
        foreignKey: 'task_id',
        as: 'testPlan', // Usa "testPlans" como alias
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }
  Task.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      tasklist_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      assignee_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      project_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      activity_type_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      task_index: {
        type: DataTypes.INTEGER,
      },
      description: DataTypes.TEXT,
      due_date: DataTypes.DATE,
      completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      completed_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Task",
      tableName: "Tasks",
    }
  );
  return Task;
};
