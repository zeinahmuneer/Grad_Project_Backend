const {
  handleServerError
} = require("../controllers/generalCRUDController");
const {
  Majors,
    PlanCourses,
    Courses,
    Students,
    Required_CH_of_Req,
    Mark,
    Calendar,
    CurrentSemester,
    PostponeRequest,
    OverloadRequest,
    Prerequisite,
    SynchronizationRequest,
    Substitute,
    Schedule,
    SubstituteRequest,
    Flags
  } = require("../models/index");
const { Op } = require("sequelize"); // Import Sequelize operators

const studentService = {


//Get the Total credited hours in each major plan
getMajorCH: async function (student) {
  try {
    const RequiredCH= await Required_CH_of_Req.sum('No_of_CH_of_req',
      {
       where:{Major_ID: student.Major_ID, Plan_Year:student.Plan_Year}
      }

    )
      return RequiredCH;

        }
        catch (error) {
    console.log(error);
        }
},

//Get the total number of credited hours passed by the student
getStudentTotalCH: async function (student) {
  try {
    const StudentMarks= await Mark.findAll(
      {
        where:{Student_ID:student.Student_ID, Grade_State:1},
        include: [{
          model:Courses, as: "CourseDetails", attributes:["Credited_Hours"]
        }],
        attributes:["Course_ID"]
      }
    )
    let StudentTotalCH= 0;
    StudentMarks.forEach((mark)=>{

      StudentTotalCH += mark?.CourseDetails?.Credited_Hours

    })
return StudentTotalCH;

        }
        catch (error) {
    console.log(error);
        }
},


//Get the total number of credited hours the student is enrolled in the current semester
getStudentCurrentCH: async function (student) {
  try {
    const StudentCH= await CurrentSemester.findAll(
      {
        where:{Student_ID:student.Student_ID, Subject_State:1},
        include: [{
          model:Courses, as: "CourseDetails", attributes:["Credited_Hours"]
        }],
        attributes:["Course_ID"]
      }
    )
    let StudentCurrentCH= 0;
    StudentCH.forEach((course)=>{

      StudentCurrentCH += course?.CourseDetails?.Credited_Hours

    })
return StudentCurrentCH;

        }
        catch (error) {
    console.log(error);
        }
},

//Get the total number of records for a student in the current semester
getStudentCurrentSemesterCount: async function (student) {
  try {
    const StudentCount= await CurrentSemester.count(
      {
        where:{Student_ID:student.Student_ID, Subject_State:1}
      }
    )
return StudentCount;

        }
        catch (error) {
    console.log(error);
        }
},

//Get current semester
getSemesterType: async function()
{
  try{
    const CurrentSemester= await Calendar.findOne( {attributes: ["Semester_Type"]});
    return CurrentSemester.Semester_Type;
  }
  catch (error) {
    console.log(error);
        }
},

// Get Current Academic Year And Semester
getCurrentAcademicYearAndSemester: async function()
{
  try{
    const currentCalendar = await Calendar.findOne({attributes: ["Academic_Year", "Semester_Type", "Postpone_Start", "Postpone_End","Reg_Start","Reg_End"]});
    return currentCalendar;
  }

  catch (error) {
    console.log(error);
        }
},

//Get student's acceptance year and semester
getStudentAcceptanceDetails: async function (student)
{
  try {
    const studentDetails = await Students.findOne({
      where: { Student_ID:student.Student_ID },
      attributes: ["Acceptance_Year", "Acceptance_Semester"]
    });
    return studentDetails;
  }
  catch (error) {
    console.log(error);
        }
},

//Get student's degree type
getStudentDegree: async function (student)
{
  try {
    const studentDegree = await Students.findOne({
      where: { Student_ID:student.Student_ID },
      attributes: ["Degree_ID"]
    });
    return studentDegree;
  }
  catch (error) {
    console.log(error);
        }
},


//Count Postponed Semesters
countPostponedSemesters: async function (student)
{
  try {
    const postponeCount = await PostponeRequest.findOne({where: { Student_ID:student.Student_ID }, attributes: ["No_of_Semesters"] });
    return postponeCount ? postponeCount.No_of_Semesters : 0;;
  }
  catch (error) {
    console.log(error);
        }
},


//Get available semesters to postpone
getAvailableSemestersForPP: async function(student)
{
  try {
    const postponeCount = await this.countPostponedSemesters(student);
    const maxPostponeSemesters=4;

    if (postponeCount >= maxPostponeSemesters) {
      return [];
    }

    const availableSemesters= Array.from(
      {length: maxPostponeSemesters - postponeCount},
      (_,i)=> i+1
    );

   console.log('Available semesters:', availableSemesters);
    return availableSemesters;
  }
  catch (error) {
    console.log(error);
        }

},

//Check if its the student's first semester
checkFirstSemester: async function(student)
{

  try {
    const currentCalendar = await this.getCurrentAcademicYearAndSemester();
    const studentDetails = await this.getStudentAcceptanceDetails(student);
  //check if its the student's first year
  if( studentDetails.Acceptance_Year == currentCalendar.Academic_Year && studentDetails.Acceptance_Semester == currentCalendar.Semester_Type )
    {
      console.log("Its the student's first semester ");
      return { eligible: true, reason: "Student is in their first semester" };
    }

    return false;
  }
  catch (error) {
    console.log(error);
        }


},

//Check is the student is expected to graduate
  isGraduate: async function (student)
  {

    const RequiredCH=await this.getMajorCH(student);
    const StudentTotalCH=await this.getStudentTotalCH(student);
    const Semester_Type=await this.getSemesterType();


const RemainingHours= RequiredCH-StudentTotalCH;
console.log(RemainingHours);
if(Semester_Type==3)
{
if(RemainingHours<=10)
  return true;
else return false;
}
else
{
  if(RemainingHours<=18)
    return true;
  else return false;
}
},


 //Check if it's the pre graduation semester
  isPreGraduate: async function (student)
  {
      const RequiredCH=await this.getMajorCH(student);
      const StudentTotalCH=await this.getStudentTotalCH(student);
      const Semester_Type=await this.getSemesterType();

  const RemainingHours= RequiredCH-StudentTotalCH;
  console.log(RemainingHours);
  if(Semester_Type==3 || Semester_Type==2)
  {
  if(RemainingHours<=28)
    return true;
  else return false;
  }
  else
  {
    if(RemainingHours<=36)
      return true;
    else return false;
  }
  },

 //Get the Prerequisite ID of a course
getPrerequisiteCourseID: async function (courseID)
{
  try {
    const prerequisite = await Prerequisite.findOne({
      where: { Course_ID: courseID },
      attributes: ["Prerequisite_Course_ID"]
    });
    console.log(prerequisite);
    return prerequisite.Prerequisite_Course_ID;
  }
  catch (error) {
    console.log(error);
        }
},

 //Get the Prerequisite name of a course
 getPrerequisiteCourseName: async function (prerequisiteCourseID)
 {
   try {
     const course= await Courses.findOne({
       where: { Course_ID: prerequisiteCourseID },
       attributes: ["Course_Name"]
     });
     return course.Course_Name;
   }
   catch (error) {
     console.log(error);
         }
 },

 //Check if student is enrolled in prerequisite course
 isStudentEnrolledInPrerequisite: async function (studentID, prerequisiteID)
 {
  try {
    const enrolled = await CurrentSemester.findOne({
      where: {
        Student_ID:studentID,
        Course_ID: prerequisiteID
      }
    });
    return enrolled!==null; // returns a boolean value
  }
  catch (error) {
    console.log(error);
        }

 },

 //--------------------------------------------------------------------------------------------------------------
 //Count the number of times a student has failed a course
 countFailedCourse: async function(studentID, courseID)
 {
  try {
const countFailedCourse= await Mark.count({
  where:{
  Student_ID:studentID,
  Course_ID: courseID,
  Grade_State:2
  } ,
});
console.log(countFailedCourse);
return countFailedCourse;
}
catch (error) {
  console.log(error);
      }
 },

//Check if course is in the semester's schedule
isCourseInSchedule: async function(courseID)
{
    try {
  const isCourseInSchedule= await Schedule.findOne({
    where:{
    Course_ID: courseID,
    }
  });
  return isCourseInSchedule !==null;//returns boolean value
  }
  catch (error) {
    console.log(error);
        }

},

//Get the schedule for a course
getCourseSchedule: async function(courseID)
{
  const checkCourse = await this.isCourseInSchedule(courseID);
  if (checkCourse) {
    const schedule = await Schedule.findAll({
      where: { Course_ID: courseID },
      attributes: ['Course_ID','Course_Section', 'Days', 'From', 'To']
    });
    return schedule;
  }
  else
  {
    return { Message: `No schedule for course: ${courseID}` };
  }

},

//Get enrolled courses and their schedule
getEnrolledCoursesWSchedule: async function(studentID)
{

    // Fetch enrolled courses for the student
    const enrolledCourses = await CurrentSemester.findAll({
      where: { Student_ID: studentID },
    });

    if (enrolledCourses.length === 0) {
      console.log("No enrolled courses found for student:", studentID);
      return [];
    }

    // Fetch the schedule for each enrolled course
    const schedules = await Promise.all(
      enrolledCourses.map(async (course) => {
        const courseSchedule = await Schedule.findAll({
          where: { Course_ID: course.Course_ID },
          attributes: ['Course_ID','Course_Section', 'Days', 'From', 'To'],
        });

        return {
          ...course.toJSON(), // Include course data
          Schedule: courseSchedule, // Attach schedule data
        };
      })
    );

    console.log("Enrolled courses with schedule:", schedules);
    return schedules;

},


//Check conflicts in the student's schedule
checkCourseConflicts:async function(studentID, orgCourseID)
{
  try{
    const orgCourseSchedule = await this.getCourseSchedule(orgCourseID);
    const enrolledCoursesSchedule = await this.getEnrolledCoursesWSchedule(studentID);

 // Iterate over enrolled courses to find conflicts
 for (const enrollment of enrolledCoursesSchedule) {
  const enrolledCourse = enrollment.Schedule;

  if (!enrolledCourse) continue; // Skip if no schedule is attached

  // Check days overlap
  const hasCommonDays = enrolledCourse.Days.split(',').some((day) =>
    orgCourseSchedule[0].Days.includes(day)
  );

  // Check time overlap
  if (
    hasCommonDays &&
    enrolledCourse.From < orgCourseSchedule[0].To &&
    enrolledCourse.To > orgCourseSchedule[0].From
  ) {
    console.log(
      `Conflict found with Course ID: ${enrollment.Course_ID}, Section: ${enrollment.Section}`
    );
    return true;
  }
}

console.log("No conflicts found");
return false;
  }
catch (error) {
  console.log(error);
      }

},

//----------------------------------------------------------------------------------------------------------------------

// Services' processing functions

  //Check if the student is eligible for postponing
  canPostponeSemester: async function(student)
  {
    const currentCalendar = await this.getCurrentAcademicYearAndSemester();
    const postponeCount = await this.countPostponedSemesters(student);
    const studentCurrentSemesterCount = await this.getStudentCurrentSemesterCount(student);
    const requestDateTime = new Date();
    const postponeStart = new Date(currentCalendar.Postpone_Start);
    const postponeEnd = new Date(currentCalendar.Postpone_End);


   //Check if it is the allotted time to make the request
    if (requestDateTime < postponeStart || requestDateTime > postponeEnd) {
      return { eligible: false, reason: "ليس موعد تقديم الطلب" };
    }

    console.log(studentCurrentSemesterCount);
  //Check if the student is enrolled in any courses
  if(studentCurrentSemesterCount>0){
    return {eligible:false, reason:"The student is enrolled in courses"};
  }
      console.log(postponeCount);
     //check if the student has already postponed 4 times
    if(postponeCount>=4)
      {
        console.log("The student has already postponed 4 times ");
        return { eligible: false, reason: "يمنع تأجيل اكثر من أربع فصول" };
      }

 const availableSemesters= await this.getAvailableSemestersForPP(student);
 // The student can postpone
  return {eligible: true, availableSemesters};
  },

  //Create a new record in the postponeRequest table
  createPostponeRecord: async function (studentID, noOfSemesters, reason)
  {
    const student = await Students.findOne({ where: { Student_ID: studentID } });
    const currentCalendar = await this.getCurrentAcademicYearAndSemester();
    const requestDateTime= new Date();

//Insert a record to PostponeRequest
    const newRequest = await PostponeRequest.create({
      Student_ID: student.Student_ID,
      From_Academic_Year: currentCalendar.Academic_Year,
      From_Semester_Type: currentCalendar.Semester_Type,
      No_of_Semesters: noOfSemesters,
      Reason: reason,
      Timestamp: requestDateTime,
    });


return {newRequest, Message:"تم قبول الطلب"};


  },


  //Check if the student can increase academic load
  canIncreaseAcademicLoad: async function(student)
  {
    const studentCurrentCH = await this.getStudentCurrentCH(student);
    const RequiredCH=await this.getMajorCH(student);
    const StudentTotalCH=await this.getStudentTotalCH(student);
    const Semester_Type=await this.getSemesterType();
    const currentCalendar = await this.getCurrentAcademicYearAndSemester();
    const requestDateTime = new Date();
    const regStart = new Date(currentCalendar.Reg_Start);
    const regEnd = new Date(currentCalendar.Reg_End);



const RemainingHours= RequiredCH-StudentTotalCH-studentCurrentCH;
console.log("Required ",RequiredCH);
console.log("Student ",StudentTotalCH);
console.log("Remaining ",RemainingHours);


   //Check if it is the allotted time to make the request
    if (requestDateTime < regStart || requestDateTime > regEnd) {
      return { eligible: false, reason: "ليس موعد تقديم الطلب" };
    }
   console.log(studentCurrentCH);
   //Check if the student is has registered the max number of CH
   if(Semester_Type==3)
    {
    if(studentCurrentCH==10)
     return {
     eligible: true,
     AllowedHours: RemainingHours
    };
    }
    else
    {
      if(studentCurrentCH==18)
       return {    eligible: true,
        AllowedHours: RemainingHours
      };
    }

    return {eligible:false , Reason:"لم تستوفي الشروط"}
  },

   //Create a new record in the Overload table
    createOverloadRecord: async function (studentID, noOfHours)
    {
      const student = await Students.findOne({ where: { Student_ID: studentID } });
      const currentCalendar = await this.getCurrentAcademicYearAndSemester();
      const requestDateTime= new Date();

  //Insert a record to OverloadRequest
      const newRequest = await OverloadRequest.create({
        Student_ID: student.Student_ID,
        Academic_Year: currentCalendar.Academic_Year,
        Semester_Type: currentCalendar.Semester_Type,
        No_of_Hours: noOfHours,
        Timestamp: requestDateTime,
      });


      return {newRequest, Message:"تم قبول الطلب"};


    },

  //Create a new record in SynchronizationRequest for one pair of courses
  synchronizeOneCourse: async function (studentID, courseID)
  {
    const student = await Students.findOne({ where: { Student_ID: studentID } });
    const currentCalendar= await this.getCurrentAcademicYearAndSemester();
    const prerequisiteID= await this.getPrerequisiteCourseID(courseID);
    const isEnrolled= await this.isStudentEnrolledInPrerequisite(prerequisiteID);
    const requestDateTime= new Date();

    if(isEnrolled==false)
      return { eligible:false, reason: "لم تسجل في المتطلب السابق للماده"};

    //Insert a record into SynchronizationRequest
    const newRequest= await SynchronizationRequest.create({
      Student_ID: student.Student_ID,
      Academic_Year: currentCalendar.Academic_Year,
      Semester_Type: currentCalendar.Semester_Type,
      CoreCourse_ID:courseID,
      Prereq_Course_ID:prerequisiteID,
      Timestamp:requestDateTime
        });

    return {newRequest, Message:"تم قبول الطلب"};


  },


  //---------------------------------------------------------------------------------------------------------------------------
  //Create a new record in the SubstituteRequest table
  SubstituteCourse: async function(studentID, courseID)
{
const student = await Students.findOne({ where: { Student_ID: studentID } });
const countFailedCourse= await this.countFailedCourse(studentID,courseID);
const checkCourse=await this.isCourseInSchedule(courseID);
const checkConflict= await this.checkCourseConflicts(studentID, courseID);
const currentCalendar= await this.getCurrentAcademicYearAndSemester();
const requestDateTime= new Date();


console.log(countFailedCourse);
console.log(checkCourse);
console.log(checkConflict);

//Check for eligibility
if(countFailedCourse >=3 || checkCourse==false || checkConflict==true )
{
const newRequest= await SubstituteRequest.create({
  Student_ID: student.Student_ID,
  Academic_Year: currentCalendar.Academic_Year,
  Semester_Type: currentCalendar.Semester_Type,
  OrgCourse_ID: courseID ,
  Flag:1,
  Timestamp:requestDateTime
});

return {newRequest, message: "تم تقديم الطلب"};
}

return {eligible: false, message:"لم تستوفي الشروط"};


},

};
module.exports = studentService;
