'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProgressTracking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ProgressTracking.belongsTo(models.Task, {
        foreignKey: 'task_id',
        as: 'task',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      });
    }
  };
  ProgressTracking.init({
    // id: {
    //   type: DataTypes.STRING(10),
    //   primaryKey: true,
    //   allowNull: false,
    // },
    task_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    porcentajeCompleto: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      get() {
        const rawValue = this.getDataValue('porcentajeCompleto');
        return rawValue !== null ? parseInt(rawValue) : null;
      }
    },
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true,
    }
  }, {
    sequelize,
    modelName: 'ProgressTracking',
    tableName: 'ProgressTracking'
  });
  return ProgressTracking;
};