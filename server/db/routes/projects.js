const express = require("express");
const { asyncHandler } = require("./utilities/utils");
const { requireAuth, getUserToken } = require("./utilities/auth");
const { check, validationResult } = require("express-validator");
const {
  Project,
  User,
  TaskList,
  Team,
  UserProject,
  Task,
  TaskStatusCatalog,
  ActivityType,
  ProgressTracking,
  TestPlan,
  AcceptanceCriteria
} = require("../../db/models");

const router = express.Router();
//Authenticates user before being able to use API
// router.use(requireAuth);

router.get(
  "/",
  asyncHandler(async (req, res, next) => {
    const projects = await Project.findAll({});

    res.json(projects);
  })
);

router.get(
  "/user/:id",
  asyncHandler(async (req, res, next) => {
    const user_id = req.params.id;
    const projects = await Team.findAll({
      include: [
        {
          model: User,
          where: {
            id: user_id,
          },
          attributes: ["name"],
        },
        { 
          model: Project,
          include: [
            { model: Team },
          ]
        },
      ],
    });

    let combinedProjects = projects.map((team) => {
      return team.Projects;
    });

    let arrays = [];
    for (i = 0; i < combinedProjects.length; i++) {
      for (j = 0; j < combinedProjects[i].length; j++) {
        arrays.push(combinedProjects[i][j]);
      }
    }

    arrays.sort(function (a, b) {
      var keyA = new Date(a.createdAt),
        keyB = new Date(b.createdAt);

      if (keyA < keyB) return -1;
      if (keyA > keyB) return 1;
      return 0;
    });
    res.json(arrays);
  })
);

router.get(
  "/:id/users",
  asyncHandler(async (req, res, next) => {
    const project_id = req.params.id;

    const users = await User.findAll({
      include: [
        {
          model: Project,
          where: { id: project_id },
        },
      ],

      attributes: ["id", "name"],
    });
    res.json(users);
  })
);

router.get(
  "/:id/tasklists",
  asyncHandler(async (req, res, next) => {

    try 
    {
      const project_id = req.params.id;
      const tasklist = await TaskList.findAll({
        where: {
          project_id: project_id,
        },
        order: [["column_index", "ASC"]],
        include: [
          {
            model: Task,
            include: [
              { model: User, attributes: ["id", "name", "email"] },
              { model: TaskStatusCatalog, attributes: ["id", "statusName", "description"] },
              { model: ActivityType, attributes: ["id", "name"] },
              { 
                model: ProgressTracking, 
                as: "progressTracking",
                attributes: ["id", "fecha", "porcentajeCompleto", "observaciones"] 
              },
              { 
                model: TestPlan, 
                as: "testPlan",
                attributes: ["id", "definicion_de_prueba", "casos_de_prueba"],
                include: [
                  { 
                    model: AcceptanceCriteria, 
                    attributes: ["id", "description", "completed"] 
                  }
                ]
              },
            ],
          }
        ],
      });
      if (!tasklist) {
        res.json({ message: "error" });
      }
      res.json(tasklist);
    } catch (err) {
      console.log(err);
      res.status(401).send({ error: "Something went wrong" });
    }
  })
);

router.get(
  "/:id/team",
  asyncHandler(async (req, res, next) => {
    const project_id = req.params.id;
    const team = await Team.findOne({
      include: [
        { model: Project, where: { id: project_id } },
        { model: User, attributes: ["name", "id"] },
      ],
    });
    res.json(team);
  })
);

router.post(
  "/:id/tasklist",
  asyncHandler(async (req, res, next) => {
    const project_id = req.params.id;
    const { name, userId } = req.body;

    const tasklist = await TaskList.create({
      name: name,
      owner_id: userId,
      project_id: project_id,
    });
    res.json(tasklist).status(201);
  })
);

router.delete(
  "/:id",
  asyncHandler(async (req, res, next) => {
    const team_id = req.params.id;
    const project_id = req.params.projectId;
    const project = await Project.delete({
      where: { id: project_id },
    });
    res.status(202);
  })
);

router.get(
  "/:id",
  asyncHandler(async (req, res, next) => {
    const user_id = req.params.userId;
    const project_name = req.params.projectName;
    const project_id = req.params.id;

    const project = await Project.findOne({
      include: [
        {
          model: TaskList,
        },
        // { model: Team },
        // { model: User, attributes: ["name", "email", "id"] },
      ],
      where: {
        id: project_id,
      },
    });

    res.json(project);
  })
);

module.exports = router;
