'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ProgressTracking', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
      },
      task_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Tasks', // Asegúrate de que 'Tasks' es el nombre correcto de la tabla de tareas
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      fecha: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      porcentajeCompleto: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
      },
      observaciones: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ProgressTracking');
  }
};
