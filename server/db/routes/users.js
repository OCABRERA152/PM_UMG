const express = require("express");
const bcrypt = require("bcryptjs");
const { asyncHandler } = require("./utilities/utils");
const { check, validationResult } = require("express-validator");
const { User, Team, UserTeam, Role, UserRole } = require("../../db/models");
const { getUserToken, requireAuth } = require("./utilities/auth");

const router = express.Router();

validateUserFields = [
  check("email")
    .exists({ checkFalsy: true })
    .withMessage("Por favor ingresa un correo valido"),
  check("password")
    .exists({ checkFalsy: true })
    .withMessage("Por favor ingresar una contraseña valida"),
];

const validateTeamName = [
  check("teamName")
    .exists({ checkFalsy: true })
    .withMessage("Necesitas ingresar un nombre de equipo"),
];

const validateEmailPassword = [
  check("email")
    .exists({ checkFalsy: true })
    .withMessage("Por favor ingresa un correo valido"),
  check("password")
    .exists({ checkFalsy: true })
    .withMessage("Por favor ingresar una contraseña valida"),
];

//Obtener informacion de un usuario especifico
router.get(
  "/user/:id",
  // requireAuth,
  asyncHandler(async (req, res, next) => {
    const user_id = req.params.id;
    const user = await User.findOne({
      where: {
        id: user_id,
      },
      attributes: ["name", "email"],
    });

    res.json(user);
  })
);

// Obtener todos los usuarios
router.get(
  "/users",
  requireAuth,
  asyncHandler(async (req, res, next) => {
    const users = await User.findAll({
      attributes: ["id", "name", "email"],
    });
    res.json(users);
  })
);

// Get users by admin id
router.get(
  "/users/admin/:id",
  // requireAuth,
  asyncHandler(async (req, res, next) => {
    
    const admin_id = req.params.id;

    const teams = await UserTeam.findAll({
      where: {
        user_id: admin_id,
      },
    });

    const teamsUsers = await UserTeam.findAll({
      where: {
        team_id: teams.map((team) => team.team_id),
      }
    });

    const users = await User.findAll({
      where: {
        id: teamsUsers.map((team) => team.user_id),
      },
      attributes: ["id", "name", "email"],
    })

    return res.json(users);
  })
);

//Registro
router.post(
  "/register",
  validateUserFields,
  asyncHandler(async (req, res) => {
    const validatorErr = validationResult(req);

    if (!validatorErr.isEmpty()) {
      const errors = validatorErr.array().map((error) => error.msg);
      res.status(422).json(["Errors", ...errors]);
      return;
    }

    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    // try {
    const existingUser = await User.findOne({
      where: {
        email: email,
      },
    });
    if (existingUser) {
      res.status(422).send({ Error: "User already exists" });
      return;
    }

    const user = await User.create({
      name: name,
      email: email,
      hashed_password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const userRole = await UserRole.create({
      userId: user.id,
      roleId: 1
    });

    const token = getUserToken(user);

    res.status(200).json({
      id: user.id,
      token,
      email: user.email,
      roleId: userRole.roleId
    });
    // } catch (err) {
    //   res.status(422).send({ error: err.errors[0].message });
    // }
  })
);

//Onboard information
router.put(
  "/register/onboard",
  validateTeamName,
  asyncHandler(async (req, res, next) => {
    const validatorErr = validationResult(req);

    if (!validatorErr.isEmpty()) {
      const errors = validatorErr.array().map((error) => error.msg);
      res.json(["ERRORS", ...errors]);
      return;
    }

    const { email, teamName } = req.body;
    // try {

    const user = await User.findOne({
      where: {
        email: email,
      },
    });
    const token = getUserToken(user);
    res.status(200).json({
      token,
    });

    //Create initial Team
    const team = await Team.create({
      name: teamName,
    });
    //Tie user to team
    const userTeam = await UserTeam.create({
      user_id: user.id,
      team_id: team.id,
    });

    // } catch (err) {
    //   res.status(422).send(err.message);
    // }
  })
);

//Log in
router.post(
  "/login",
  validateEmailPassword,
  asyncHandler(async (req, res, next) => {

    const validatorErr = validationResult(req);

    if (!validatorErr.isEmpty()) {
      const errors = validatorErr.array().map((error) => error.msg);
      res.json(["ERRORS", ...errors]);
      return;
    }
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(422).send({ error: "Debes ingresar un correo y una contraseña" });
    }
    const user = await User.findOne({
      include: {
        model: Role,
        as: "Roles"
      },
      where: {
        email,
      },
    });

    if (!user || !user.validatePassword(password)) {
      const err = new Error("Login fallido");
      err.status = 401;
      err.title = "Login fallido";
      err.errors = ["Las credenciales son incorrectas"];
      res.status(401).json(err);
      return;
    } else {
      const token = getUserToken(user);

      console.log(user.Roles);

      res.json({
        id: user.id,
        token,
        email: user.email,
        roleId: user.Roles[0].id
      });
    }
  })
);

module.exports = router;
