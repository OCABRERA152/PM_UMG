const express = require("express");
const { asyncHandler } = require("./utilities/utils");
const { TaskStatusCatalog } = require("../models");

const router = express.Router();

router.get(
  "/",
  asyncHandler(async (req, res, next) => {

    const statusCatalog = await TaskStatusCatalog.findAll({});

    res.json(statusCatalog);
  })
);

module.exports = router;