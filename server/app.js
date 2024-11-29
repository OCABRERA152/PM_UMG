const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const { environment } = require("./config");
const cors = require("cors");
const userRouter = require("./db/routes/users");
const taskRouter = require("./db/routes/tasks");
const projectRouter = require("./db/routes/projects");
const teamRouter = require("./db/routes/teams");
const tasklistRouter = require("./db/routes/tasklists");
const commentRouter = require("./db/routes/comments");
const userteamRouter = require("./db/routes/userteams");
const taskstatusRouter = require("./db/routes/taskstatuscatalogs");
const activityTypeRouter = require("./db/routes/activitytypes");
const roles = require("./db/routes/roles");
const app = express();

app.use(bodyParser.json());

// Same as bodyParser but built in
// app.use(express.json())
// app.use(express.urlencoded({extended:true}))

app.use(morgan("dev"));
app.use(cors({ origin: true }));

app.use(userRouter);
app.use("/roles", roles);
app.use("/task", taskRouter);
app.use("/project", projectRouter);
app.use("/team", teamRouter);
app.use("/tasklist", tasklistRouter);
app.use("/comment", commentRouter);
app.use("/userteam", userteamRouter);
app.use("/task-catalog-status", taskstatusRouter);
app.use("/activity-types", activityTypeRouter);

app.get("/", (req, res) => {
  res.send("<h1>You're Connected </h1>");
});

app.use((req, res, next) => {
  const err = new Error("The requested resource couldn't be found.");
  err.status = 404;
  err.errors = ["Could not find string of resource"];
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  const isProduction = environment === "production";
  res.json({
    title: err.title || "Server Error",
    message: err.message,
    errors: err.errors,
    stack: isProduction ? null : err.stack,
  });
});

module.exports = app;
