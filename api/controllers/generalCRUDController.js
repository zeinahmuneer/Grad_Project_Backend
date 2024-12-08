const {
  College,
  Majors,
  Schedule,
  PlanCourses,
  Prerequisite,
  DegreeSemesterHours,
  CurrentSemester,
  Calendar,
} = require("../models");
// Utility function for error handling
const handleServerError = (res, error) => {
  console.error(error);
  res.status(500).json({
    message: "An error occurred while processing your request",
    error: error.message,
  });
};

// Generic CRUD Controller Generator
const generalCRUDController = (Model, modelName) => ({
  // Create a new record
  create: async (req, res) => {
    try {
      const newRecord = await Model.create(req.body);
      res.status(201).json({
        message: `${modelName} created successfully`,
        data: newRecord,
      });
    } catch (error) {
      handleServerError(res, error);
    }
  },

  // Get all records
  getAll: async (req, res) => {
    try {
      const records = await Model.findAll({
        // Optional: include associations if needed
        // include: req.query.include ? JSON.parse(req.query.include) : []
      });

      res.status(200).json({
        message: `${modelName}s retrieved successfully :)`,
        data: records,
      });
    } catch (error) {
      handleServerError(res, error);
    }
  },

  // Get a single record by ID
  getById: async (req, res) => {
    try {
      const record = await Model.findByPk(req.params.id, {
        // Optional: include associations if needed
        // include: req.query.include ? JSON.parse(req.query.include) : []
      });

      if (!record) {
        return res.status(404).json({
          message: `${modelName} not found`,
        });
      }

      res.status(200).json({
        message: `${modelName} retrieved successfully`,
        data: record,
      });
    } catch (error) {
      handleServerError(res, error);
    }
  },

  // Update a record
  update: async (req, res) => {
    try {
      const [updated] = await Model.update(req.body, {
        where: { [`${modelName}_ID`]: req.params.id },
      });

      if (updated === 0) {
        return res.status(404).json({
          message: `${modelName} not found or no changes made`,
        });
      }

      const updatedRecord = await Model.findByPk(req.params.id);
      res.status(200).json({
        message: `${modelName} updated successfully`,
        data: updatedRecord,
      });
    } catch (error) {
      handleServerError(res, error);
    }
  },

  // Delete a record
  delete: async (req, res) => {
    try {
      const deleted = await Model.destroy({
        where: { [`${modelName}_ID`]: req.params.id },
      });

      if (deleted === 0) {
        return res.status(404).json({
          message: `${modelName} not found`,
        });
      }

      res.status(200).json({
        message: `${modelName} deleted successfully`,
      });
    } catch (error) {
      handleServerError(res, error);
    }
  },
});

module.exports = {
  CollegeController: generalCRUDController(College, "College"),
  MajorsController: generalCRUDController(Majors, "Major"),
  ScheduleController: generalCRUDController(Schedule, "Schedule"),
  PlanCoursesController: generalCRUDController(PlanCourses, "PlanCourse"),
  PrerequisiteController: generalCRUDController(Prerequisite, "Prerequisite"),
  DegreeSemesterHoursController: generalCRUDController(
    DegreeSemesterHours,
    "DegreeSemesterHour"
  ),
  CurrentSemesterController: generalCRUDController(
    CurrentSemester,
    "CurrentSemester"
  ),
  CalendarController: generalCRUDController(Calendar, "Calendar"),
  generalCRUDController,
};
