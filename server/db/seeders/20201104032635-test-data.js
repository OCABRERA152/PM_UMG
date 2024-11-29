"use strict";
require("dotenv").config({ path: "../.env" });
const bcrypt = require("bcryptjs");
module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.bulkInsert('Roles', [
      { name: 'Admin', description: 'Acceso Completo', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Developer', description: 'Acceso a desarrolladores', createdAt: new Date(), updatedAt: new Date() },
      { name: 'QA', description: 'Acceso a QA', createdAt: new Date(), updatedAt: new Date() },
    ]);

    await queryInterface.bulkInsert('TaskStatusCatalog', [
      { statusName: 'Por Hacer', description: 'Tarea pendiente por comenzar', createdAt: new Date(), updatedAt: new Date() },
      { statusName: 'En progreso', description: 'Tarea en curso', createdAt: new Date(), updatedAt: new Date() },
      { statusName: 'Plan de Pruebas', description: 'Tarea detenida temporalmente', createdAt: new Date(), updatedAt: new Date() },
      { statusName: 'Completado', description: 'Tarea finalizada', createdAt: new Date(), updatedAt: new Date() },
      { statusName: 'Cancelado', description: 'Tarea cancelada', createdAt: new Date(), updatedAt: new Date() },
    ]);

    // Generar una contraseña encriptada
    const hashedPassword = bcrypt.hashSync(process.env.DEFAULT_USER_PASSWORD || "PassPrueba#2024", 10);

    // Insertar el usuario administrador
    await queryInterface.bulkInsert("Users", [
      {
        name: "Admin",
        email: "admin@gmail.com",
        hashed_password: hashedPassword,
        image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // Obtener el ID del usuario recién creado
    const [users] = await queryInterface.sequelize.query(
      `SELECT id FROM \`Users\` WHERE email = 'admin@gmail.com';`
    );

    const adminUserId = users[0]?.id;

    // Relacionar el usuario con el rol de admin (Role ID = 1)
    if (adminUserId) {
      await queryInterface.bulkInsert("UserRoles", [
        {
          userId: adminUserId,
          roleId: 1, // ID del rol de administrador
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
    }

    // const users = await queryInterface.bulkInsert(
    //   "Users",
    //   [
    //     {
    //       email: "demo@email.com",
    //       hashed_password: bcrypt.hashSync("password"),
    //       name: "Demo User",
    //       createdAt: new Date(),
    //       updatedAt: new Date(),
    //     },
    //     {
    //       email: "test@email.com",
    //       hashed_password: bcrypt.hashSync("password"),
    //       name: "Test User",
    //       createdAt: new Date(),
    //       updatedAt: new Date(),
    //     },
    //     {
    //       email: "engineering@email.com",
    //       hashed_password: bcrypt.hashSync("password"),
    //       name: "Engineering User",
    //       createdAt: new Date(),
    //       updatedAt: new Date(),
    //     },
    //     {
    //       email: "marketing@email.com",
    //       hashed_password: bcrypt.hashSync("password"),
    //       name: "Marketing User",
    //       createdAt: new Date(),
    //       updatedAt: new Date(),
    //     },
    //     {
    //       email: "sales@email.com",
    //       hashed_password: bcrypt.hashSync("password"),
    //       name: "Sales User",
    //       createdAt: new Date(),
    //       updatedAt: new Date(),
    //     },
    //   ],
    //   { returning: true }
    // );
    // const teams = await queryInterface.bulkInsert(
    //   "Teams",
    //   [
    //     {
    //       name: "Engineering",
    //       description: "This is the engineering team",
    //       createdAt: new Date(),
    //       updatedAt: new Date(),
    //     },
    //     {
    //       name: "Marketing",
    //       description: "This is the marketing team",
    //       createdAt: new Date(),
    //       updatedAt: new Date(),
    //     },
    //     {
    //       name: "Sales",
    //       description: "This is the marketing team",
    //       createdAt: new Date(),
    //       updatedAt: new Date(),
    //     },
    //   ],
    //   { returning: true }
    // );
    // const userteams = await queryInterface.bulkInsert(
    //   "UserTeams",
    //   [
    //     {
    //       user_id: 1,
    //       team_id: 1,
    //       createdAt: new Date(),
    //       updatedAt: new Date(),
    //     },
    //     {
    //       user_id: 2,
    //       team_id: 1,
    //       createdAt: new Date(),
    //       updatedAt: new Date(),
    //     },
    //     {
    //       user_id: 3,
    //       team_id: 1,
    //       createdAt: new Date(),
    //       updatedAt: new Date(),
    //     },
    //     {
    //       user_id: 1,
    //       team_id: 2,
    //       createdAt: new Date(),
    //       updatedAt: new Date(),
    //     },
    //     {
    //       user_id: 1,
    //       team_id: 3,
    //       createdAt: new Date(),
    //       updatedAt: new Date(),
    //     },
    //     {
    //       user_id: 4,
    //       team_id: 2,
    //       createdAt: new Date(),
    //       updatedAt: new Date(),
    //     },
    //     {
    //       user_id: 5,
    //       team_id: 3,
    //       createdAt: new Date(),
    //       updatedAt: new Date(),
    //     },
    //   ],
    //   { returning: true }
    // );

    // const projects = await queryInterface.bulkInsert(
    //   "Projects",
    //   [
    //     {
    //       name: "Database Project",
    //       team_id: 1,
    //       createdAt: new Date(),
    //       updatedAt: new Date(),
    //     },
    //     {
    //       name: "Mobile Application",
    //       team_id: 1,
    //       createdAt: new Date(),
    //       updatedAt: new Date(),
    //     },

    //     {
    //       name: "Web Application",
    //       team_id: 1,
    //       createdAt: new Date(),
    //       updatedAt: new Date(),
    //     },
    //     {
    //       name: "UI/UX Project",
    //       team_id: 1,
    //       createdAt: new Date(),
    //       updatedAt: new Date(),
    //     },

    //     {
    //       name: "SEO Campaign",
    //       team_id: 2,
    //       createdAt: new Date(),
    //       updatedAt: new Date(),
    //     },
    //     {
    //       name: "Online Marketing",
    //       team_id: 2,
    //       createdAt: new Date(),
    //       updatedAt: new Date(),
    //     },

    //     {
    //       name: "Catalina Wine Mixer",
    //       team_id: 3,
    //       createdAt: new Date(),
    //       updatedAt: new Date(),
    //     },
    //     {
    //       name: "International Sales",
    //       team_id: 3,
    //       createdAt: new Date(),
    //       updatedAt: new Date(),
    //     },
    //   ],
    //   { returning: true }
    // );

    // const userProject = await queryInterface.bulkInsert(
    //   "UserProjects",
    //   [
    //     {
    //       user_id: 1,
    //       project_id: 1,
    //       createdAt: new Date(),
    //       updatedAt: new Date(),
    //     },
    //     {
    //       user_id: 1,
    //       project_id: 2,
    //       createdAt: new Date(),
    //       updatedAt: new Date(),
    //     },
    //     {
    //       user_id: 1,
    //       project_id: 3,
    //       createdAt: new Date(),
    //       updatedAt: new Date(),
    //     },
    //     {
    //       user_id: 1,
    //       project_id: 4,
    //       createdAt: new Date(),
    //       updatedAt: new Date(),
    //     },
    //     {
    //       user_id: 1,
    //       project_id: 5,
    //       createdAt: new Date(),
    //       updatedAt: new Date(),
    //     },
    //     {
    //       user_id: 1,
    //       project_id: 6,
    //       createdAt: new Date(),
    //       updatedAt: new Date(),
    //     },
    //     {
    //       user_id: 1,
    //       project_id: 7,
    //       createdAt: new Date(),
    //       updatedAt: new Date(),
    //     },
    //     {
    //       user_id: 1,
    //       project_id: 8,
    //       createdAt: new Date(),
    //       updatedAt: new Date(),
    //     },
    //     {
    //       user_id: 2,
    //       project_id: 1,
    //       createdAt: new Date(),
    //       updatedAt: new Date(),
    //     },
    //     {
    //       user_id: 3,
    //       project_id: 1,
    //       createdAt: new Date(),
    //       updatedAt: new Date(),
    //     },
    //     {
    //       user_id: 3,
    //       project_id: 2,
    //       createdAt: new Date(),
    //       updatedAt: new Date(),
    //     },
    //     {
    //       user_id: 3,
    //       project_id: 3,
    //       createdAt: new Date(),
    //       updatedAt: new Date(),
    //     },
    //     {
    //       user_id: 3,
    //       project_id: 4,
    //       createdAt: new Date(),
    //       updatedAt: new Date(),
    //     },
    //     {
    //       user_id: 4,
    //       project_id: 5,
    //       createdAt: new Date(),
    //       updatedAt: new Date(),
    //     },
    //     {
    //       user_id: 4,
    //       project_id: 6,
    //       createdAt: new Date(),
    //       updatedAt: new Date(),
    //     },
    //     {
    //       user_id: 5,
    //       project_id: 7,
    //       createdAt: new Date(),
    //       updatedAt: new Date(),
    //     },
    //     {
    //       user_id: 5,
    //       project_id: 8,
    //       createdAt: new Date(),
    //       updatedAt: new Date(),
    //     },
    //   ],
    //   { returning: true }
    // );

    // const taskLists = [
    //   { name: "To Do", project_id: 1, owner_id: 1 },
    //   { name: "In Progress", project_id: 1, owner_id: 1 },
    //   { name: "Completed", project_id: 1, owner_id: 1 },
    //   { name: "To Do", project_id: 6, owner_id: 1 },
    //   { name: "In Progress", project_id: 6, owner_id: 1 },
    //   { name: "Completed", project_id: 6, owner_id: 1 },
    //   { name: "To Do", project_id: 8, owner_id: 1 },
    //   { name: "In Progress", project_id: 8, owner_id: 1 },
    //   { name: "Completed", project_id: 8, owner_id: 1 },
    //   { name: "To Do", project_id: 7, owner_id: 1 },
    //   { name: "In Progress", project_id: 7, owner_id: 1 },
    //   { name: "Completed", project_id: 7, owner_id: 1 },
    // ];
    
    // let currentProjectId = null;
    // let taskListIndexCounter = 1;
    
    // for (const taskList of taskLists) {
    //   // Verifica si cambia el project_id
    //   if (taskList.project_id !== currentProjectId) {
    //     currentProjectId = taskList.project_id;
    //     taskListIndexCounter = 1; // Reinicia el contador al cambiar de proyecto
    //   }
    
    //   await queryInterface.bulkInsert("TaskLists", [
    //     {
    //       ...taskList,
    //       column_index: taskListIndexCounter++, // Asigna e incrementa el índice
    //       createdAt: new Date(),
    //       updatedAt: new Date(),
    //     },
    //   ]);
    // }
  
    // const taskData = [
    //   {
    //     name: "Create schema",
    //     tasklist_id: 1,
    //     project_id: 1,
    //     assignee_id: 1,
    //     description: "create initial database schema",
    //     due_date: new Date("2021-08-13"),
    //     completed: false,
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   },
    //   {
    //     name: "Create Models",
    //     tasklist_id: 1,
    //     project_id: 1,
    //     assignee_id: 1,
    //     description: "create models",
    //     due_date: "2021-08-13",
    //     completed: false,
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   },
    //   {
    //     name: "Update new product feature",
    //     tasklist_id: 1,
    //     project_id: 1,
    //     assignee_id: 3,
    //     description: "Update client's request",
    //     due_date: "2021-08-13",
    //     completed: false,
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   },
    //   {
    //     name: "Test Functionality",
    //     tasklist_id: 2,
    //     project_id: 1,
    //     assignee_id: 1,
    //     description: "Test functionality of feature",
    //     due_date: "2021-08-13",
    //     completed: false,
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   },
    //   {
    //     name: "Product Feature XY",
    //     tasklist_id: 3,
    //     project_id: 1,
    //     assignee_id: 1,
    //     description: "Test functionality of feature",
    //     due_date: "2021-08-13",
    //     completed: true,
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   },
    //   {
    //     name: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    //     tasklist_id: 3,
    //     project_id: 1,
    //     assignee_id: 1,
    //     description:
    //       "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    //     due_date: "2021-08-13",
    //     completed: true,
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   },
    //   {
    //     name: "Create Pamphlet",
    //     tasklist_id: 4,
    //     project_id: 6,
    //     assignee_id: 1,
    //     description: "create marketing pamphlets",
    //     due_date: "2020-12-30",
    //     completed: false,
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   },
    //   {
    //     name: "Discuss marketing strategy",
    //     tasklist_id: 4,
    //     project_id: 6,
    //     assignee_id: 1,
    //     description: "discuss marketing strategy",
    //     due_date: "2021-08-13",
    //     completed: true,
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   },
    //   {
    //     name: "Meet with client",
    //     tasklist_id: 10,
    //     project_id: 7,
    //     assignee_id: 1,
    //     description: "Meet with client",
    //     due_date: "2020-12-13",
    //     completed: false,
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   },
    //   {
    //     name: "Discuss business requirements with client",
    //     tasklist_id: 11,
    //     project_id: 7,
    //     assignee_id: 1,
    //     description: "Business requirements",
    //     due_date: "2021-12-13",
    //     completed: false,
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   },
    //   {
    //     name: "Meet with stakeholders",
    //     tasklist_id: 11,
    //     project_id: 7,
    //     assignee_id: 1,
    //     description: "Stakeholder meeting at location Y",
    //     due_date: "2021-12-13",
    //     completed: false,
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   },
    // ];

    // const tasksWithIndexes = taskData.map((task, index) => ({
    //   ...task,
    //   activity_type_id: 1,
    //   status_id: 1,
    //   task_index: index + 1,
    // }));

    // var taskIds = await queryInterface.bulkInsert("Tasks", tasksWithIndexes, {
    //   returning: true,
    // });

    // var progressTrackingData = tasksWithIndexes.map((task, index) => ({
    //   task_id: index + 1,
    //   fecha: new Date(),
    //   porcentajeCompleto: 0,
    //   observaciones: null,
    //   createdAt: new Date(),
    //   updatedAt: new Date(),
    // }));

    // await queryInterface.bulkInsert("ProgressTracking", progressTrackingData);

    // let taskIndexCounter = 1; // Inicia el contador en 1

    // for (const task of taskData) {
    //   var resultTasks = await queryInterface.bulkInsert(
    //     "Tasks",
    //     [{
    //       ...task,
    //       status_id: 1,
    //       activity_type_id: 1,
    //       task_index: taskIndexCounter++, // Asigna e incrementa el índice
    //       createdAt: new Date(),
    //       updatedAt: new Date(),
    //     }]
    //   );
    // }

    // const comments = await queryInterface.bulkInsert(
    //   "Comments",
    //   [
    //     {
    //       text: "I'll work on this soon",
    //       task_id: 1,
    //       user_id: 1,
    //       createdAt: new Date(),
    //       updatedAt: new Date(),
    //     },
    //     {
    //       text: "I've heard that before",
    //       task_id: 1,
    //       user_id: 2,
    //       createdAt: new Date(),
    //       updatedAt: new Date(),
    //     },
    //   ],
    //   { returning: true }
    // );
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Users", null, {});
    await queryInterface.bulkDelete("Teams", null, {});
    await queryInterface.bulkDelete("UserTeams", null, {});
    await queryInterface.bulkDelete("Projects", null, {});
    await queryInterface.bulkDelete("UserProjects", null, {});
    await queryInterface.bulkDelete("TaskLists", null, {});
    await queryInterface.bulkDelete("Tasks", null, {});
    await queryInterface.bulkDelete("Comments", null, {});
    await queryInterface.bulkDelete("ProgressTracking", null, {});
    await queryInterface.bulkDelete("TestPlans", null, {});
    await queryInterface.bulkDelete("Roles", null, {});
    await queryInterface.bulkDelete("UserRoles", null, {});
    await queryInterface.bulkDelete("ActivityTypes", null, {});
    await queryInterface.bulkDelete("TaskStatusCatalog", null, {});
    await queryInterface.bulkDelete("AcceptanceCriteria", null, {});
  },
};
