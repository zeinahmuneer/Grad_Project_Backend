// Students Controller
const {
  generalCRUDController,
} = require("../controllers/generalCRUDController");
const { Students, Majors, AvgMark, SemesterType } = require("../models/index");

const StudentsController = {
  ...generalCRUDController(Students, "Student"),

  // Get students by major
  getStudentsByMajor: async (req, res) => {
    try {
      const students = await Students.findAll({
        where: { Major_ID: req.params.majorId },
        include: [{ model: Majors, as: "StudentMajorDetails" }],
      });
      res.status(200).json({
        message: "Students retrieved successfully",
        data: students,
      });
    } catch (error) {
      handleServerError(res, error);
    }
  },

  // Get student's academic performance
  getStudentPerformance: async (req, res) => {
    try {
      const performance = await AvgMark.findAll({
        where: { Student_ID: req.params.studentId },
        include: [
          { model: Students, as: "StudentDetails" },
          { model: SemesterType, as: "SemesterDetails" },
        ],
      });
      res.status(200).json({
        message: "Student performance retrieved successfully",
        name: " fadsfa ",
        data: performance,
      });
    } catch (error) {
      handleServerError(res, error);
    }
  },
};

module.exports = StudentsController;
