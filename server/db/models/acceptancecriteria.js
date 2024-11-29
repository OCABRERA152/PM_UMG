'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AcceptanceCriteria extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      AcceptanceCriteria.belongsTo(models.TestPlan, { foreignKey: 'test_plan_id' });
    }
  };

  AcceptanceCriteria.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    test_plan_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'TestPlans',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    completed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    sequelize,
    modelName: 'AcceptanceCriteria',
    tableName: 'AcceptanceCriteria',
  });
  return AcceptanceCriteria;
};