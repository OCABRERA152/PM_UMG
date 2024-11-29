const express = require("express");
const { asyncHandler } = require("./utilities/utils");
const { requireAuth } = require("./utilities/auth");
const { check, validationResult } = require("express-validator");
const { 
  TaskList, 
  Task,
  User,
  TaskStatusCatalog,
  ActivityType,
  ProgressTracking,
  TestPlan,
  AcceptanceCriteria
} = require("../../db/models");
const router = express.Router();

// router.use(requireAuth);

router.get(
  "/",
  asyncHandler(async (req, res, next) => {
    const tasklists = await TaskList.findAll({
      include: [
        {
          model: Task,
          include: [
            { model: User, attributes: ["id", "name", "email"] },
            { model: TaskStatusCatalog, attributes: ["id", "statusName", "description"] },
            { model: ActivityType, attributes: ["id", "name"] },
            { model: ProgressTracking, attributes: ["id", "fecha", "porcentajeCompleto", "observaciones"] },
            { 
              model: TestPlan, 
              attributes: ["id", "definicion_de_prueba", "casos_de_prueba"], 
              include: [{ model: AcceptanceCriteria, attributes: ["id", "description", "completed"] }]
            }
          ],
        }
      ]
    });

    res.json(tasklists);
  })
);

router.get(
  "/:id/tasks",
  asyncHandler(async (req, res, next) => {
    const tasklist_id = req.params.id;
    const tasks = await Task.findAll({
      where: {
        tasklist_id: tasklist_id,
      },
    });
    res.json(tasks);
  })
);

router.post(
  "/:id/task",
  asyncHandler(async (req, res, next) => {
    
    try
    {
      const tasklist_id = req.params.id;

      const {
        name,
        projectId,
        assigneeId,
        activityTypeId,
        due_date,
        completed,
        description,
        definicion_de_prueba,
        casos_de_prueba,
        criteriosAceptacion
      } = req.body;

      if (completed === []) {
        completed = false;
      }

      const task = await Task.create({
        name: name,
        project_id: projectId,
        assignee_id: assigneeId,
        status_id: 1,
        activity_type_id: activityTypeId,
        due_date: due_date,
        completed: completed,
        description: description,
        tasklist_id: tasklist_id,
      });

      if (!task) {
        return res.status(404).json({ error: "Task could not be created" });
      }

      // Crear el registro en ProgressTracking
      await ProgressTracking.create({
        task_id: task.id,
        fecha: new Date(),
        porcentajeCompleto: 0, // inicial con 0%
        observaciones: null,
      });

      if (definicion_de_prueba && casos_de_prueba) 
      {

        var testPlan = await TestPlan.create({
          definicion_de_prueba: definicion_de_prueba,
          casos_de_prueba: casos_de_prueba,
          task_id: task.id,
        });

        var bulkCriteriosAceptacion = criteriosAceptacion.map((criterio) => {
          return { test_plan_id: testPlan.id, description: criterio };
        });

        await AcceptanceCriteria.bulkCreate(bulkCriteriosAceptacion);
      }

      res.status(201).json(task);
    } catch (err) {
      console.log(err);
      res.status(401).send({ error: "Something went wrong" });
    }
  })
);

router.delete(
  "/:id",
  asyncHandler(async (req, res, next) => {
    const tasklist_id = req.params.id;

    const tasklist = await TaskList.destroy({
      where: { id: tasklist_id },
    });
    res.json(202);
  })
);

router.put(
  "/:id/columnindex",
  asyncHandler(async (req, res, next) => {
    const { newIndex } = req.body;
    const tasklist_id = req.params.id;
    const column_index = req.params.columnIndex;

    try {
      const updateIndex = await TaskList.update(
        {
          column_index: newIndex,
        },
        {
          where: {
            id: tasklist_id,
          },
        }
      );

      res.json(updateIndex);
    } catch (err) {
      res.status(401).send({ error: "Something went wrong" });
    }
  })
);

router.put(
  "/:id/title",
  asyncHandler(async (req, res, next) => {
    const tasklist_id = req.params.id;
    const { columnTitle } = req.body;
    const tasklist = await TaskList.update(
      { name: columnTitle },
      { where: { id: tasklist_id } }
    );
    res.json({ message: "updated" });
  })
);

module.exports = router;
