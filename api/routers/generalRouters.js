const express = require("express");
const {
  CollegeController,
  MajorsController,
  ScheduleController,
  PlanCoursesController,
  PrerequisiteController,
  DegreeSemesterHoursController,
  CurrentSemesterController,
  CalendarController,
} = require("../controllers/generalCRUDController"); // Adjust the path as needed

// Generic function to create a router
const createRouter = (controller) => {
  const router = express.Router();

  router.post("/", controller.create); // Create
  router.get("/", controller.getAll); // Get All
  router.get("/:id", controller.getById); // Get by ID
  router.put("/:id", controller.update); // Update
  router.delete("/:id", controller.delete); // Delete

  return router;
};

// Create routers for each controller
const collegeRouter = createRouter(CollegeController);
const majorsRouter = createRouter(MajorsController);
const scheduleRouter = createRouter(ScheduleController);
const planCoursesRouter = createRouter(PlanCoursesController);
const prerequisiteRouter = createRouter(PrerequisiteController);
const degreeSemesterHoursRouter = createRouter(DegreeSemesterHoursController);
const currentSemesterRouter = createRouter(CurrentSemesterController);
const calendarRouter = createRouter(CalendarController);

module.exports = {
  collegeRouter,
  majorsRouter,
  scheduleRouter,
  planCoursesRouter,
  prerequisiteRouter,
  degreeSemesterHoursRouter,
  currentSemesterRouter,
  calendarRouter,
};
