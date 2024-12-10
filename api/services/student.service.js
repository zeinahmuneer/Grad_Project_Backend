const { Majors, PlanCourses, Courses, Students } = require("../models/index");
const { Op } = require("sequelize"); // Import Sequelize operators

const studentService = {
  isGraduate: async function (studentId, planYear) {
    const student = await Students.findOne({
      where: {
        Student_ID: studentId,
      },
    });
    // Get MajorID
    const major = await Majors.findOne({
      where: {
        Major_ID: student.Major_ID,
      },
    });
    if (!major.Major_ID) {
      return false;
    }
    const coursesPlan = await PlanCourses.findAll({
      where: {
        Major_ID: major.Major_ID,
        Plan_Year: planYear,
      },
    });
    const requisiteMapLimit = {
      0: 0,
      1: 0,
      2: 6,
      3: 1,
      4: 1,
      5: 1,
      6: 9,
      7: 28,
      8: 3,
    };
    const requisiteMap = {
      0: 0,
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0,
    };
    const courseIds = coursesPlan.map((coursePlan) => {
      const requisiteId = coursePlan.Requisite_ID;
      requisiteMap[requisiteId] = requisiteMap[requisiteId] + 1;
      if (requisiteMap[requisiteId] >= requisiteMapLimit[requisiteId]) {
        return;
      } else {
        return coursePlan.Course_ID;
      }
    });
    // Fetch Courses from the Courses table
    const courses = await Courses.findAll({
      where: {
        Course_ID: {
          [Op.in]: courseIds,
        },
      },
    });
    const majorRequiredHours = courses.reduce((acc, course) => {
      return acc + course.Credited_Hours;
    }, 0);
    console.log("majorRequiredHours", majorRequiredHours);
    return true;
  },
};
module.exports = studentService;
