const {
  handleServerError
} = require("../controllers/generalCRUDController");
const { Majors, PlanCourses, Courses, Students, Required_CH_of_Req, Mark, Calendar, CurrentSemester,PostponeRequest,OverloadRequest} = require("../models/index");
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
    return postponeCount;
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
    const availableSemesters= Array.from(
      {length: maxPostponeSemesters - postponeCount},
      (_,i)=> i+1
    );
    return availableSemesters;
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


  //Check if the student is eligible for postponing
  canPostponeSemester: async function(student)
  {
    const currentCalendar = await this.getCurrentAcademicYearAndSemester();
    const postponeCount = await this.countPostponedSemesters(student);
    const studentDetails = await this.getStudentAcceptanceDetails(student);
    const requestDateTime = new Date();
    const postponeStart = new Date(currentCalendar.Postpone_Start);
    const postponeEnd = new Date(currentCalendar.Postpone_End);


   //Check if it is the allotted time to make the request
    if (requestDateTime < postponeStart || requestDateTime > postponeEnd) {
      return { eligible: false, reason: "Request made outside the allotted postponing time" };
    }

    //check if its the student's first year 
    if( studentDetails.Acceptance_Year == currentCalendar.Academic_Year && studentDetails.Acceptance_Semester == currentCalendar.Semester_Type )
      {
        console.log("Its the student's first semester ");
        return { eligible: false, reason: "Student is in their first semester" };
      } 

      console.log(postponeCount);
     //check if the student has already postponed 4 times
    if(postponeCount+1>4)
      {
        console.log("The student has already postponed 4 times ");
        return { eligible: false, reason: "Exceeded maximum number of postponements" };
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


    const newRequest = await PostponeRequest.create({
      Student_ID: student.Student_ID,
      From_Academic_Year: currentCalendar.Academic_Year,
      From_Semester_Type: currentCalendar.Semester_Type,
      No_of_Semesters: noOfSemesters,
      Reason: reason,
      Timestamp: requestDateTime,
    });


return newRequest;


  },

    //Create a new record in the Overload table
    createOverloadRecord: async function (studentID, noOfHours)
    {
      const student = await Students.findOne({ where: { Student_ID: studentID } });
      const currentCalendar = await this.getCurrentAcademicYearAndSemester();
      const requestDateTime= new Date();
  
  
      const newRequest = await OverloadRequest.create({
        Student_ID: student.Student_ID,
        Academic_Year: currentCalendar.Academic_Year,
        Semester_Type: currentCalendar.Semester_Type,
        No_of_Hours: noOfHours,
        Timestamp: requestDateTime,
      });
  
  
  return newRequest;
  
  
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



const RemainingHours= RequiredCH-StudentTotalCH;
console.log(RemainingHours);


   //Check if it is the allotted time to make the request
    if (requestDateTime < regStart || requestDateTime > regEnd) {
      return { eligible: false, reason: "Request made outside the allotted Registration time" };
    }
   console.log(studentCurrentCH);
   //Check if the student is has registered the max number of CH
   if(Semester_Type==3)
    {
    if(studentCurrentCH==10)
     return {
     eligible: true, 
     AllowedHours: RemainingHours-10 
    };
    }
    else 
    {
      if(studentCurrentCH==18)
       return {    eligible: true, 
        AllowedHours: RemainingHours-18  };
    }

    return {eligible:false , Reason:"The student hasn't fulfilled the requirements"}
  },


};
module.exports = studentService;
