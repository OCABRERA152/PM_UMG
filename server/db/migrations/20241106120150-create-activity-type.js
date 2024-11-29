'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ActivityTypes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Inserción masiva de tipos de actividad
    await queryInterface.bulkInsert("ActivityTypes", [
      { name: "Tarea", createdAt: new Date(), updatedAt: new Date() },
      { name: "Hito", createdAt: new Date(), updatedAt: new Date() },
      { name: "Plan de Pruebas", createdAt: new Date(), updatedAt: new Date() },
    ]);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ActivityTypes');
  }
};