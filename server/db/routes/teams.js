require("dotenv").config({ path: "../.env" });
const express = require("express");
const bcrypt = require("bcryptjs");
const { asyncHandler } = require("./utilities/utils");
const { requireAuth } = require("./utilities/auth");
const { check, validationResult } = require("express-validator");
const { Team, UserTeam, User, Project, UserProject, Role, UserRole } = require("../../db/models");

const router = express.Router();
//Authenticates user before being able to use API
// router.use(requireAuth);

//Gets all Teams
router.get(
  "/",
  asyncHandler(async (req, res, next) => {
    const teams = await Team.findAll({});

    res.json(teams);
  })
);

//get all users in a Team
router.get(
  "/:id/users",
  asyncHandler(async (req, res, next) => {
    const team_id = req.params.id;

    const users = await Team.findAll({
      include: [
        {
          model: User,
          attributes: ["id", "name", "email"],
        },
      ],
      where: { id: team_id },
    });

    res.json(users);
  })
);

// router.get(
//   "/:id/users",
//   asyncHandler(async (req, res, next) => {
//     // const project_id = req.params.id;
//     const team_id = req.params.id;

//     const users = await User.findAll({
//       include: [{ model: Team, where: { id: team_id } }],
//       attributes: ["id", "name"],
//     });
//     res.json(users);
//   })
// );

//Obtener todos los teams de un user
router.get(
  "/user/:id",
  asyncHandler(async (req, res, next) => {
    const user_id = req.params.id;

    const teams = await Team.findAll({
      include: [
        {
          model: User,
          where: {
            id: user_id,
          },
          attributes: ["name", "id"],
        },
      ],
    });

    res.json(teams);
  })
);

//Obtener todos los proyectos de un equipo
router.get(
  "/:id/projects",
  asyncHandler(async (req, res, next) => {
    const team_id = req.params.id;
    const projects = await Project.findAll({
      where: {
        team_id: team_id,
      },
    });
    res.json(projects);
  })
);

//Obtener toda la información de un team
router.get(
  "/:id",
  asyncHandler(async (req, res, next) => {
    const team_id = req.params.id;
    const team = await Team.findOne({
      include: [
        { model: Project },
        { model: User, attributes: ["name", "email", "id"], include: { model: Role, as: "Roles" } },
      ],
      where: { id: team_id },
    });

    console.log(team);

    if (!team) {
      res.send({ error: "No team exists" });
    }
    res.json(team);
  })
);

//Create team
router.post(
  "/user/:userId",
  asyncHandler(async (req, res, next) => {
    const user_id = req.params.userId;
    const { description, name } = req.body;

    if (description) {
      const team = await Team.create({
        description: description,
        name: name,
      });
      //Adds user to team
      const userteam = await UserTeam.create({
        team_id: team.id,
        user_id: user_id,
      });
      res.json(team).status(201);
    } else if (!description) {
      const team = await Team.create({
        name: name,
      });
      //Adds user to team
      const userteam = await UserTeam.create({
        team_id: team.id,
        user_id: user_id,
      });
      res.json(team).status(201);
    }
  })
);

// Add other users to team
router.post(
  "/:teamId/user/:userId?",
  asyncHandler(async (req, res, next) => {
    const team_id = req.params.teamId;
    let user_id = req.params.userId;
    const { email, name, roleId } = req.body; // Obtén los datos del cuerpo de la solicitud

    var userRoleId;

    // Si no se proporciona un userId, crear un usuario con valores predeterminados
    if (!user_id) {

      // Verifica si el email ya existe
      const existingUser = await User.findOne({ where: { email } });
      
      if (existingUser) {
        return res.status(400).send({ error: 'Ya existe un usuario con este correo' });
      }

      // Crea la contraseña por defecto
      const hashedPassword = await bcrypt.hash(process.env.DEFAULT_USER_PASSWORD || 'PassPrueba#2024', 10); // Encriptación de la contraseña

      // Crea el nuevo usuario
      const newUser = await User.create({
        email,
        name,
        hashed_password: hashedPassword, // Asume que el campo es `hashed_password`
      });

      user_id = newUser.id; // Obtén el `user_id` del nuevo usuario

      // Asocia el usuario al rol (UserRoles)
      const newUserRole = await UserRole.create({
        userId: user_id,
        roleId: roleId,
      });

      // userRoleId = newUserRole.roleId;
    }

    // Verifica si el usuario ya está asociado con el equipo
    const userteam = await UserTeam.findOne({
      where: {
        team_id: team_id,
        user_id: user_id,
      },
    });

    if (userteam) {
      return res.status(404).send({ error: "Usuario ya pertenece al equipo" });
    }

    // Si el usuario no está asociado, crea la relación
    const newUserTeam = await UserTeam.create({
      team_id: team_id,
      user_id: user_id,
    });

    var userRole = await UserRole.findOne({
      where: {
        userId: user_id,
      },
    });

    userRoleId = userRole.roleId;

    res.status(201).json({
      message: 'Usuario agregado al equipo y al rol exitosamente',
      userTeam: newUserTeam,
      userRole: userRoleId,
    });
  })
);

//Add other users to team
// router.post(
//   "/:teamId/user/:userId",
//   asyncHandler(async (req, res, next) => {
//     const team_id = req.params.teamId;
//     const user_id = req.params.userId;
//     const userteam = await UserTeam.findOne({
//       where: {
//         team_id: team_id,
//         user_id: user_id,
//       },
//     });
//     if (userteam) {
//       res.status(404).send({ error: "user already exists" });
//     } else if (!userteam) {
//       const newUserTeam = await UserTeam.create({
//         team_id: team_id,
//         user_id: user_id,
//       });
//       res.json(newUserTeam).status(201);
//     }
//   })
// );

//Edit team description
router.put(
  "/:teamId/description",
  asyncHandler(async (req, res, next) => {
    const team_id = req.params.teamId;
    const { description } = req.body;
    await Team.update(
      {
        description: description,
      },
      {
        where: {
          id: team_id,
        },
      }
    );
  })
);

//Create Project for team
router.post(
  "/:id/project",
  asyncHandler(async (req, res, next) => {
    try 
    {
      //need to add owner for project
      const team_id = req.params.id;
      const { name, userId } = req.body;
      const project = await Project.create({
        name: name,
        team_id: team_id,
      });

      if (project) {
        
        const userproject = await UserProject.create({
          user_id: userId,
          project_id: project.id,
        });

        res.json(userproject).status(201);
      } else {
        res.status(404);
      }
    } catch (error) {
      console.log(error);
      res.status(401).send({ error: "Something went wrong" });
    }
  })
);

//Delete team
router.delete(
  "/:teamId/",
  asyncHandler(async (req, res, next) => {
    const team_id = req.params.teamId;
    const project_id = req.params.projectId;
    const team = await Team.destroy({
      where: { id: team_id },
    });
    res.status(202);
  })
);

module.exports = router;
