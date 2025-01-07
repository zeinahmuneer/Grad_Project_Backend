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
  Required_CH_of_Req,
  AnnouncementType,
  Announcement,
  syncDatabase,
} = require("../models/index"); // Adjust the path to your models file

async function loadInitialDataFromJson() {
  try {
    // Read the JSON file
    const dataFilePath = path.join(__dirname, "data.json");
    const rawData = fs.readFileSync(dataFilePath, "utf8");
    const data = JSON.parse(rawData);
    // data.courses.forEach((course) => {
    //   course.Success_ID = course.Success_type;
    //   course.Credited_Hours = course.Credited_hours;
    //   delete course.Success_type;
    //   delete course.Credited_hours;
    // });
    // data.plan_courses.forEach((plan_course) => {
    //   plan_course.Requisite_ID = plan_course.Requisite_id;
    //   plan_course.Plan_Year = plan_course.Plan_year;
    //   delete plan_course.Requisite_id;
    //   delete plan_course.Plan_year;
    // });
    // data.prerequisite.forEach((prerequisite) => {
    //   prerequisite.Plan_Year = prerequisite.Plan_year;
    //   prerequisite.Course_ID = prerequisite.Course_ID.toString();
    //   prerequisite.Prerequisite_Course_ID =
    //     prerequisite.Prerequisite_course_ID.toString();
    //   delete prerequisite.Plan_year;
    //   delete prerequisite.Prerequisite_course_ID;
    // });
    // // Write the modified data back to the JSON file
    // fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), "utf8");

    // return;

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

       // Load Required_CH_of_Req
       if (data.Required_CH_of_Req) {
        await Required_CH_of_Req.bulkCreate(data.Required_CH_of_Req, {
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
  //load degree semester hours
    if (data.degree_semester_hours) {
      await DegreeSemesterHours.bulkCreate(data.degree_semester_hours, {
        ignoreDuplicates: true,
      });
    }
  //load prerequisite
    if (data.prerequisite) {
      await Prerequisite.bulkCreate(data.prerequisite, {
        ignoreDuplicates: true,
      });
    }
   //loading students
    if (data.students) {
      await Students.bulkCreate(data.students, { ignoreDuplicates: true });
    }
   //load marks
    if (data.mark) {
      await Mark.bulkCreate(data.mark, { ignoreDuplicates: true });
    }

    //load calendar
    if (data.calendar) {
      await Calendar.bulkCreate(data.calendar, { ignoreDuplicates: true });
    }

     //load currentSemester
     if (data.calendar) {
      await CurrentSemester.bulkCreate(data.currentSemester, { ignoreDuplicates: true });
    }

    //load announcementType
    if (data.announcementType) {
      await AnnouncementType.bulkCreate(data.announcementType, { ignoreDuplicates: true });
    }


      //load announcement
      if (data.announcement) {
        await Announcement.bulkCreate(data.announcement, { ignoreDuplicates: true });
      }


      //load schedule
      if (data.Schedule) {
        await Schedule.bulkCreate(data.Schedule, { ignoreDuplicates: true });
      }

        //load Flags
        if (data.flags) {
          await Flags.bulkCreate(data.flags, { ignoreDuplicates: true });
        }



    console.log("Initial data loaded successfully from JSON");
  } catch (error) {
    console.error("Error loading initial data from JSON:", error);
    throw error;
  }
}
module.exports = loadInitialDataFromJson;
