const {
  handleServerError
} = require("../controllers/generalCRUDController");
const { Majors, PlanCourses, Courses, Students, Required_CH_of_Req, Mark, Calendar, CurrentSemester} = require("../models/index");
const { Op } = require("sequelize"); // Import Sequelize operators

const studentService = {

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


  isGraduate: async function (student) {

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


    isPreGraduate: async function (student) {

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
};
module.exports = studentService;
