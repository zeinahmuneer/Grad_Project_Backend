// Students Controller
const {
  generalCRUDController, handleServerError
} = require("../controllers/generalCRUDController");
const { Students, Majors, AvgMark, SemesterType,PostponeRequest,Calendar, Courses, Prerequisite } = require("../models/index");
const studentService = require("../services/student.service");
const bcrypt = require('bcrypt');

const StudentsController = {
  ...generalCRUDController(Students, "Student"),

// Get a single record by ID
getById: async (req, res) => {
  try {
    const student = await Students.findByPk(req.params.id, {
      // Optional: include associations if needed
      // include: req.query.include ? JSON.parse(req.query.include) : []
    });

    if (!student) {
      return res.status(404).json({
        message: `Student not found`,
      });
    }

    res.status(200).json({
      message: `Student retrieved successfully`,
      data: {
        Student_ID:  student.Student_ID,
       Student_Name:student.Student_Name,
       Degree_ID:student.Degree_ID,
       Major_ID:student.Major_ID,
       Plan_Year:student.Plan_Year,
       Acceptance_Year:student.Acceptance_Year,
       Acceptance_Semester:student.Acceptance_Semester,
       Email:student.Email
      }
    });
  } catch (error) {
    handleServerError(res, error);
  }
},

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
        where: {
          Student_ID: req.body.Student_ID,
        },
      });
  
      // Check if student exists
      if (!student) {
        return res.status(404).json({
          message: "Student not found",
          authenticated: false,
        });
      }
  
      // Compare the provided password with the hashed password in the database
      const passwordMatch =  bcrypt.compareSync(req.body.Password, student.Password);
  
      // Handle incorrect password
      if (!passwordMatch) {
        return res.status(401).json({
          message: "Incorrect password",
          authenticated: false,
        });
      }

      // If everything is correct, return success response
      res.status(200).json({
        message: "Student logged in successfully",
        authenticated: true,
        data: {
         Student_ID:  student.Student_ID,
        Student_Name:student.Student_Name,
        Student_Gender:student.Student_Gender,
        Degree_ID:student.Degree_ID,
        Major_ID:student.Major_ID,
        Plan_Year:student.Plan_Year,
        Acceptance_Year:student.Acceptance_Year,
        Acceptance_Semester:student.Acceptance_Semester,
        Email:student.Email
        }
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
      const isExpectedToGraduate = await studentService.isGraduate(
        student
      );
      res.status(200).json({
        message: "Student found",
        data: {
          isExpectedToGraduate,
        },
      });
    } catch (error) {
      handleServerError(res, error);
    }
  },

   // Is is the student's first semester
   isFirstSemester: async (req, res) => {
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
      const isFirstSemester = await studentService.checkFirstSemester(student);
      res.status(200).json({
        message: "Student found",
        data: {
          isFirstSemester,
        },
      });
    } catch (error) {
      handleServerError(res, error);
    }
  },


// Is Student PreGraduate or not
isPreGraduate: async (req, res) => {
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
    const isStudentPreGraduate = await studentService.isPreGraduate(
      student
    );
    res.status(200).json({
      message: "Student found",
      data: {
        isStudentPreGraduate,
      },
    });
  } catch (error) {
    handleServerError(res, error);
  }
},

// Is the student eligible for postponing
canPostponeSemester: async (req, res) => {
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
    const isAllowedToPostpone = await studentService.canPostponeSemester(student);
    res.status(200).json({
      message: "Student found",
      data: {
        isAllowedToPostpone,
      },
    });
  } catch (error) {
    handleServerError(res, error);
  }
},

// Is the student eligible for increasing academic load
canIncreaseAcademicLoad: async (req, res) => {
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
    const isAllowedToIncrease = await studentService.canIncreaseAcademicLoad(student);
    res.status(200).json({
      message: "Student found",
      data: {
        isAllowedToIncrease,
      },
    });
  } catch (error) {
    handleServerError(res, error);
  }
},

//Create a new record in the postponeRequest table
createPostponeRequest: async (req, res) => {
 
  try {
    const { studentId, noOfSemesters, reason } = req.body;
    const result = await studentService.createPostponeRecord(studentId,noOfSemesters,reason);
    res.status(201).json(result);

    if(!result)
      res.status(400).json(result);

  } catch (error) {
    handleServerError(res, error);
  }
},

//Create a new record in the Overload table
createOverloadRequest: async (req, res) => {
 
  try {
    const { studentId, noOfHours } = req.body;
    const result = await studentService. createOverloadRecord(studentId,noOfHours);
    res.status(201).json(result);

    if(!result)
      res.status(400).json(result);

  } catch (error) {
    handleServerError(res, error);
  }
},

//Create a new record in the Synchronization table
createSynchronizationRequest: async (req,res)=>{
  try {
    const { studentId, courseID } = req.body;
    const result = await studentService. synchronizeOneCourse(studentId,courseID);
    res.status(201).json(result);

    if(!result)
      res.status(400).json(result);

  } catch (error) {
    handleServerError(res, error);
  }

},

//Get prerequisite course name
getPrerequisiteCourseName: async (req,res)=>{
try {
  const courseID= req.params.courseID;
  const course= await Courses.findOne(
{where:{ Course_ID: courseID },
attributes: ["Course_ID"]
 })

if (!course) {
  return res.status(404).json({
    message: "Course not found",
  });}
  
  const prerequisiteCourseID= await  studentService.getPrerequisiteCourseID( course.Course_ID);
  if (!prerequisiteCourseID) {
    return res.status(404).json({
      message: "No prerequisite found for this course",
    });
  }

  const PrerequisiteCourseName= await studentService.getPrerequisiteCourseName(prerequisiteCourseID);
  res.status(200).json({
    message: "Course found",
    data: {
      PrerequisiteCourseName,
    },
  });
} 
 catch (error) {
    handleServerError(res, error);
  }
},  

};

module.exports = StudentsController;
