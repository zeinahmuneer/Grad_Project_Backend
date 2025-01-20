const express = require("express");
const StudentsController = require("../controllers/studentController");
const router = express.Router();

//General
router.post("/", StudentsController.create); // Create
router.get("/", StudentsController.getAll); // Get All
router.get("/:id", StudentsController.getById); // Get by ID
router.put("/:id", StudentsController.update); // Update
router.delete("/:id", StudentsController.delete); // Delete
router.get("/major/:majorId", StudentsController.getStudentsByMajor); // Get students by major
router.get("/performance/:studentId", StudentsController.getStudentPerformance); // Get student's academic performance

//Specific
router.post("/login", StudentsController.login); // Login student

router.get("/isFirstSemester/:studentId", StudentsController.isFirstSemester); // Check if its the student's first semester
router.get("/isExpectedToGraduate/:studentId", StudentsController.isGraduate); // Check if student is graduate
router.get("/isPreGraduate/:studentId", StudentsController.isPreGraduate); // Check if student is pregraduate
router.get("/initialOverloadCheck/:studentId", StudentsController.initialOverloadCheck); // initialOverloadCheck immediately after login

router.get("/isAllowedToPostpone/:studentId", StudentsController.canPostponeSemester); // Check if student can postpone
router.post("/createPostponeRecord",StudentsController.createPostponeRequest)//Adds new record to PostponeRequest
router.get("/isAllowedToIncreaseAL/:studentId", StudentsController.canIncreaseAcademicLoad); // Check if student can increase academic load
router.post("/createOverloadRecord",StudentsController.createOverloadRequest)//Adds new record to OverloadRequest
router.get("/prerequisiteName/:courseID", StudentsController.getPrerequisiteCourseName); // Gets prerequisite course name
router.post("/createSynchronizationRecord",StudentsController.createSynchronizationRequest)//Checks and Adds new record to SynchronizationRequest
router.post("/createSubstituteRecord",StudentsController.createSubstituteRequest)//Checks and Adds new record to SubstituteRequest

module.exports = router;
