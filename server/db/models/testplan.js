'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TestPlan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      TestPlan.belongsTo(models.Task, { foreignKey: 'task_id' });
      TestPlan.hasMany(models.AcceptanceCriteria, { foreignKey: 'test_plan_id' });
    }
  };
  TestPlan.init({
    definicion_de_prueba: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    casos_de_prueba: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    task_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Tasks',  // nombre de la tabla de tareas
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
  }, {
    sequelize,
    modelName: 'TestPlan',
    tableName: 'TestPlans',
  });
  return TestPlan;
};