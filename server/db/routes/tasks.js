const express = require("express");
const { asyncHandler } = require("./utilities/utils");
const { requireAuth } = require("./utilities/auth");
const { check, validationResult } = require("express-validator");
const { 
  Task, 
  Comment, 
  TaskList, 
  Project, 
  User, 
  TaskStatusCatalog, 
  ActivityType, 
  ProgressTracking, 
  TestPlan, 
  AcceptanceCriteria 
} = require("../models");
const comment = require("../../db/models/comment");
const tasklist = require("../models/tasklist");

const router = express.Router();
// router.use(requireAuth);

router.get(
  "/",
  asyncHandler(async (req, res, next) => {
    const tasks = await Task.findAll({});

    res.json(tasks);
  })
);

router.get(
  "/user/:id",
  asyncHandler(async (req, res, next) => {
    const user_id = req.params.id;
    const tasks = await Task.findAll({
      where: {
        assignee_id: user_id,
      },
      include: [
        { model: Project }, 
        { model: User }, 
        { model: TaskStatusCatalog }, 
        { model: ActivityType }, 
        { model: ProgressTracking, as: "progressTracking" }
      ],
    });
    res.json(tasks);
  })
);

router.post(
  "/:id/comment",
  asyncHandler(async (req, res, next) => {
    const task_id = req.params.id;
    const { text, user_id } = req.body;
    const comment = await Comment.create({
      text: text,
      task_id: task_id,
      user_id: user_id,
    });

    if (!comment) {
      res.status(404);
    } else {
      res.json(comment).status(201);
    }
  })
);

router.get(
  "/:id/comment",
  asyncHandler(async (req, res, next) => {
    const task_id = req.params.id;
    const comments = await Comment.findAll({
      where: {
        task_id: task_id,
      },
      include: [{ model: User, attributes: ["id", "name", "email", "image"] }],
      order: [["id", "ASC"]],
    });
    res.json(comments);
  })
);

router.put(
  "/:id",
  asyncHandler(async (req, res, next) => {
    const task_id = req.params.id;
    const { name, due_date, description, completed } = req.body;
    try {
      const updateTask = await Task.update(
        {
          name: name,
          due_date: due_date,
          description: description,
          completed: completed,
        },
        {
          where: {
            id: task_id,
          },
        }
      );

      res.json(updateTask);
    } catch (err) {
      res.status(401).send({ error: "Something went wrong" });
    }
  })
);

router.get(
  `/:id`,
  asyncHandler(async (req, res, next) => {
    const task_id = req.params.id;
    const task = await Task.findOne({
      where: {
        id: task_id,
      },
      include: [
        {
          model: Project,
          include: {
            model: User,
            attributes: ["id", "name", "email", "image"],
          },
        },
        { model: User, attributes: ["id", "name", "email", "image"] },
        {
          model: Comment,
          include: {
            model: User,
            attributes: ["id", "name", "email", "image"],
          },
        },
        { model: TaskStatusCatalog, attributes: ["id", "statusName", "description"] },
        { model: ActivityType, attributes: ["id", "name"] },
        { model: ProgressTracking, as: "progressTracking", attributes: ["id", "fecha", "porcentajeCompleto", "observaciones"] },
        { 
          model: TestPlan, 
          attributes: ["id", "definicion_de_prueba", "casos_de_prueba"], 
          as: "testPlan",
          include: [
            { 
              model: AcceptanceCriteria, 
              attributes: ["id", "description", "completed"],
              as: "AcceptanceCriteria"
            }
          ]
        }
      ],
    });
    res.json(task);
  })
);

router.put(
  `/:id/tasklist`,
  asyncHandler(async (req, res, next) => {
    const task_id = req.params.id;
    const { destinationTasklistId } = req.body;
    try {
      const updateTasklist = await Task.update(
        {
          tasklist_id: destinationTasklistId,
        },
        {
          where: {
            id: task_id,
          },
        }
      );
      const task = await Task.findOne({ where: { id: task_id } });
      res.json(task);
    } catch (err) {
      res.status(401).send({ error: "Something went wrong" });
    }
  })
);

router.put(
  `/:id/project/:projectId`,
  asyncHandler(async (req, res, next) => {
    const task_id = req.params.id;
    const project_id = req.params.projectId;
    try {
      const updateTask = await Task.update(
        {
          project_id: project_id,
        },
        {
          where: {
            id: task_id,
          },
        }
      );
      const task = await Task.findOne({ where: { id: task_id } });
      res.json(task);
    } catch (err) {
      res.send({ error: "Something went wrong" });
    }
  })
);

router.put(
  `/:id/assignee/:assigneeId`,
  asyncHandler(async (req, res, next) => {
    const task_id = req.params.id;
    const assignee_id = req.params.assigneeId;
    try {
      const updateTask = await Task.update(
        {
          assignee_id: assignee_id,
        },
        {
          where: {
            id: task_id,
          },
        }
      );
      const task = await Task.findOne({
        where: {
          id: task_id,
        },
        include: [
          { model: Project },
          { model: User, attributes: ["id", "name", "email", "image"] },
        ],
      });
      res.json(task);
    } catch (err) {
      res.send({ error: "Something went wrong" });
    }
  })
);

router.put(
  `/:id/dueDate`,
  asyncHandler(async (req, res, next) => {
    const task_id = req.params.id;
    const { date } = req.body;
    try {
      const updateTask = await Task.update(
        {
          due_date: date,
        },
        {
          where: {
            id: task_id,
          },
        }
      );
      const task = await Task.findOne({ where: { id: task_id } });
      res.json(task);
    } catch (err) {
      res.send({ error: "Something went wrong" });
    }
  })
);

router.put(
  `/:id/description`,
  asyncHandler(async (req, res, next) => {
    const task_id = req.params.id;
    const { description } = req.body;
    try {
      const updateTask = await Task.update(
        {
          description: description,
        },
        {
          where: {
            id: task_id,
          },
        }
      );
      const task = await Task.findOne({ where: { id: task_id } });
      res.json(task);
    } catch (err) {
      res.send({ error: "Something went wrong" });
    }
  })
);

router.put(
  `/:id/complete`,
  asyncHandler(async (req, res, next) => {
    const task_id = req.params.id;
    const { completed } = req.body;
    try {
      const updateTask = await Task.update(
        {
          completed: completed,
        },
        {
          where: {
            id: task_id,
          },
        }
      );
      const task = await Task.findOne({
        where: {
          id: task_id,
        },
        include: [
          {
            model: Project,
            include: {
              model: User,
              attributes: ["id", "name", "email", "image"],
            },
          },
          { model: User, attributes: ["id", "name", "email", "image"] },
          {
            model: Comment,
            include: {
              model: User,
              attributes: ["id", "name", "email", "image"],
            },
          },
        ],
      });
      res.json(task);
    } catch (err) {
      res.send({ error: "Something went wrong" });
    }
  })
);

router.put(
  `/:id/taskindex`,
  asyncHandler(async (req, res, next) => {
    const task_id = req.params.id;
    const { destinationIndex } = req.body;
    try {
      const updateTaskIndex = await Task.update(
        {
          task_index: destinationIndex,
        },
        {
          where: {
            id: task_id,
          },
        }
      );
      const task = await Task.findOne({ where: { id: task_id } });
      res.json(task);
    } catch (err) {
      res.status(401).send({ error: "Something went wrong" });
    }
  })
);

router.put(
  `/:id/task-catalog-status`,
  asyncHandler(async (req, res, next) => {

    const task_id = req.params.id;
    const { taskCatalogStatusId } = req.body;
    
    try
    {

      const _task = await Task.findOne({ 
        where: { id: task_id },
        include: [
          { 
            model: TaskList, attributes: ["id", "name", "project_id"],
          },
        ]
      });

      const columnIndex = taskCatalogStatusId;

      const taskList = await TaskList.findAll({ 
        where: {
          project_id: _task.TaskList.project_id,
          column_index: columnIndex
        }
      });

      var completed = false;
      var completed_at = null;

      if (taskCatalogStatusId == 4) 
      {
        completed = true;
        completed_at = new Date();
      }

      const updateTaskStatus = await Task.update(
        {
          status_id: taskCatalogStatusId,
          task_index: 0,
          tasklist_id: taskList[0].id,
          completed: completed,
          completed_at: completed_at
        },
        {
          where: {
            id: task_id,
          },
        }
      );

      await ProgressTracking.update({
          porcentajeCompleto: 100,
          fecha: new Date(),
        },
        {
          where: {
            task_id: task_id,
          },
        }
      );
      
      const task = await Task.findOne({ where: { id: task_id } });
      res.json(task);
    } catch (err) {
      console.log(err);
      res.status(401).send({ error: "Something went wrong" });
    }
  })
);

router.put(
  `/:id/progresstracking`,
  asyncHandler(async (req, res, next) => {
    const task_id = req.params.id;
    const { progressLevel } = req.body;
    try {

      const updateProgressTracking = await ProgressTracking.update(
        {
          porcentajeCompleto: progressLevel,
        },
        {
          where: {
            task_id: task_id,
          },
        }
      );

      const progressTracking = await ProgressTracking.findOne({
        where: {
          task_id: task_id,
        },
      });

      res.json(progressTracking);
    } catch (err) {
      res.send({ error: "Something went wrong" });
    }
  })
);

router.put(
  `/:id/activitytype`,
  asyncHandler(async (req, res, next) => {
    const task_id = req.params.id;
    const { activityTypeId } = req.body;
    try {
      const updateActivityType = await Task.update(
        {
          activity_type_id: activityTypeId,
        },
        {
          where: {
            id: task_id,
          },
        }
      );
      const task = await Task.findOne({ where: { id: task_id } });
      res.json(task);
    } catch (err) {
      res.send({ error: "Something went wrong" });
    }
  })
);

router.put(
  `/:id/criterios-aceptacion/:acceptanceCriteriaId`,
  asyncHandler(async (req, res, next) => {
    
    const task_id = req.params.id;
    var completed = req.body.completed;
    const { acceptanceCriteriaId } = req.params;

    try {
      
      const updateAcceptanceCriteria = await AcceptanceCriteria.update(
        {
          completed,
        },
        {
          where: {
            id: acceptanceCriteriaId,
          },
        }
      );
      const task = await Task.findOne({ where: { id: task_id } });
      res.json(task);
    } catch (err) {
      console.log(err);
      res.send({ error: "Something went wrong" });
    }
  })
);

router.delete(
  "/:id",
  asyncHandler(async (req, res, next) => {
    const task_id = req.params.id;

    const task = await Task.destroy({
      where: { id: task_id },
    });
    res.json(202);
  })
);

module.exports = router;
