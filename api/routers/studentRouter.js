const express = require("express");
const StudentsController = require("../controllers/studentController");
const router = express.Router();

router.post("/", StudentsController.create); // Create
router.get("/", StudentsController.getAll); // Get All
router.get("/:id", StudentsController.getById); // Get by ID
router.put("/:id", StudentsController.update); // Update
router.delete("/:id", StudentsController.delete); // Delete
router.get("/major/:majorId", StudentsController.getStudentsByMajor); // Get students by major
router.get("/performance/:studentId", StudentsController.getStudentPerformance); // Get student's academic performance

module.exports = router;
