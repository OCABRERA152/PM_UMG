'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      CREATE TRIGGER before_insert_task_list
      BEFORE INSERT ON TaskLists
      FOR EACH ROW
      BEGIN
        SET NEW.column_index = (SELECT COALESCE(MAX(column_index), 0) + 1 FROM TaskLists WHERE project_id = NEW.project_id);
      END;
    `);
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS before_insert_task_list;
    `);
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
