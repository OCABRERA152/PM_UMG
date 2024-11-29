const express = require("express");
const { asyncHandler } = require("./utilities/utils");
// const { requireAuth } = require("./utilities/auth");
const { check, validationResult } = require("express-validator");
const { Role } = require("../../db/models");


const router = express.Router();
//Authenticates user before being able to use API
// router.use(requireAuth);

router.get(
    "/",
    asyncHandler(async (req, res, next) => {
        const roles = await Role.findAll({});

        res.json(roles);
    })
);

module.exports = router;