const fs = require("fs");
const path = require("path");
const {
  College,
  Majors,
  Courses,
  Students,
  Schedule,
  PlanCourses,
  Prerequisite,
  DegreeSemesterHours,
  Mark,
  CurrentSemester,
  AvgMark,
  Calendar,
  PostponeRequest,
  OverloadRequest,
  SynchronizationRequest,
  SubstituteRequest,
  Substitute,
  SuccessType,
  RequisiteType,
  SubjectState,
  GradeState,
  Flags,
  DegreeType,
  SemesterType,
  syncDatabase,
} = require("../models/index"); // Adjust the path to your models file

async function loadInitialDataFromJson() {
  try {
    // Read the JSON file
    const dataFilePath = path.join(__dirname, "data.json");
    const rawData = fs.readFileSync(dataFilePath, "utf8");
    const data = JSON.parse(rawData);

    // Load Colleges
    if (data.colleges) {
      await College.bulkCreate(data.colleges, { ignoreDuplicates: true });
    }

    // Load Majors
    if (data.majors) {
      await Majors.bulkCreate(data.majors, { ignoreDuplicates: true });
    }

    // Load Requisite Types
    if (data.requisiteTypes) {
      await RequisiteType.bulkCreate(data.requisiteTypes, {
        ignoreDuplicates: true,
      });
    }

    // Load Subject States
    if (data.subjectStates) {
      await SubjectState.bulkCreate(data.subjectStates, {
        ignoreDuplicates: true,
      });
    }

    // Load Grade States
    if (data.gradeStates) {
      await GradeState.bulkCreate(data.gradeStates, { ignoreDuplicates: true });
    }

    // Load Degree Types
    if (data.degreeTypes) {
      await DegreeType.bulkCreate(data.degreeTypes, { ignoreDuplicates: true });
    }

    if (data.courses) {
      await Courses.bulkCreate(data.courses, { ignoreDuplicates: true });
    }

    if (data.plan_courses) {
      await PlanCourses.bulkCreate(data.plan_courses, {
        ignoreDuplicates: true,
      });
    }

    // Load Semester Types
    if (data.semesterTypes) {
      await SemesterType.bulkCreate(data.semesterTypes, {
        ignoreDuplicates: true,
      });
    }

    // Load Success Types
    if (data.successTypes) {
      await SuccessType.bulkCreate(data.successTypes, {
        ignoreDuplicates: true,
      });
    }

    // Load Colleges
    if (data.majors) {
      await Majors.bulkCreate(data.majors, { ignoreDuplicates: true });
    }

    if (data.degree_semester_hours) {
      await DegreeSemesterHours.bulkCreate(data.degree_semester_hours, {
        ignoreDuplicates: true,
      });
    }

    if (data.prerequisite) {
      await Prerequisite.bulkCreate(data.prerequisite, {
        ignoreDuplicates: true,
      });
    }

    if (data.students) {
      await Students.bulkCreate(data.students, { ignoreDuplicates: true });
    }
    console.log("Initial data loaded successfully from JSON");
  } catch (error) {
    console.error("Error loading initial data from JSON:", error);
    throw error;
  }
}
module.exports = loadInitialDataFromJson;
