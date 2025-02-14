const express = require("express");
const { asyncHandler } = require("./utilities/utils");
const { ActivityType } = require("../models");

const router = express.Router();

router.get(
  "/",
  asyncHandler(async (req, res, next) => {

    const activityTypes = await ActivityType.findAll({});

    res.json(activityTypes);
  })
);

module.exports = router;