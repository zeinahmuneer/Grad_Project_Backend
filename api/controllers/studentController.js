// Students Controller
const {
  generalCRUDController,
} = require("../controllers/generalCRUDController");
const { Students, Majors, AvgMark, SemesterType } = require("../models/index");
const studentService = require("../services/student.service");
const bcrypt = require('bcrypt');

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

  // Login student
  login: async (req, res) => {
    try {
      const student = await Students.findOne({
        // Hash the password before comparing
        // Don't forget to use the same hashing algorithm in the backend and in the database
        where: {
          Student_ID: req.body.Student_ID,
          Password: req.body.Password,
        },
      }
    );

      if (!student) {
        return res.status(404).json({
          message: "Student not found",
          authenticated: false,
        });
      }

      res.status(200).json({
        message: "Student logged in successfully",
        authenticated: true,
        data: student,
      });
    } catch (error) {
      handleServerError(res, error);
    }
  },

  // Is Student Graduate or not
  isGraduate: async (req, res) => {
    try {
      const student = await Students.findOne({
        where: {
          Student_ID: req.params.studentId,
        },
      });

      if (!student) {
        return res.status(404).json({
          message: "Student not found",
        });
      }
      const isStudentGraduate = await studentService.isGraduate(
        student.Student_ID,
        student.Plan_Year
      );
      res.status(200).json({
        message: "Student found",
        data: {
          isStudentGraduate,
        },
      });
    } catch (error) {
      handleServerError(res, error);
    }
  },
};

module.exports = StudentsController;
