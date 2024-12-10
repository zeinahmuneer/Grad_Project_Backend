const express = require("express");
const helmet = require("helmet");
const http = require("http");
const cors = require("cors");
/**
 * server configuration
 */
const config = require("../config/");
const dbService = require("./services/db.service");

/**
 * express application
 */
const app = express();
const server = http.Server(app);
const DB = dbService().start();

//load database with initial data
const loadInitialDataFromJson = require("./data/data");

// Run the data loader
// loadInitialDataFromJson()
//   .then(() => {
//     console.log("Data initialization complete");
//     process.exit(0);
//   })
//   .catch((error) => {
//     console.error("Initialization failed:", error);
//     process.exit(1);
//   });

const {
  collegeRouter,
  majorsRouter,
  scheduleRouter,
  planCoursesRouter,
  prerequisiteRouter,
  degreeSemesterHoursRouter,
  currentSemesterRouter,
  calendarRouter,
} = require("./routers/generalRouters");

// allow cross-origin requests
app.use(cors());

// secure express app
app.use(
  helmet({
    dnsPrefetchControl: false,
    frameguard: false,
    ieNoOpen: false,
  })
);

// parsing the request body
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// API routes
app.use("/api/colleges", collegeRouter);
app.use("/api/majors", majorsRouter);
app.use("/api/schedules", scheduleRouter);
app.use("/api/plan-courses", planCoursesRouter);
app.use("/api/prerequisites", prerequisiteRouter);
app.use("/api/degree-semester-hours", degreeSemesterHoursRouter);
app.use("/api/current-semester", currentSemesterRouter);
app.use("/api/calendar", calendarRouter);
app.use("/api/students", require("./routers/studentRouter"));

server.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
  DB.then(() => {
    console.log("Database connected successfully");
  }).catch((err) => {
    console.error("Database connection failed:", err);
  });
});
// Test Pull Request
