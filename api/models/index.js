const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

class ModelInitializer {
  static init() {
    this.initBaseTypes();
    this.initSimpleTypes();
    this.initCoreEntities();
    this.initRequestModels();
    this.initAdditionalTables();
    this.setupAssociations();
  }

  static initBaseTypes() {
    // Success Type
    class SuccessType extends Model {}
    SuccessType.init(
      {
        Success_ID: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        Success_Type: DataTypes.STRING,
      },
      {
        sequelize,
        modelName: "Success_Type",
        tableName: "Success_Type",
        timestamps: false,
      }
    );
    this.SuccessType = SuccessType;

    // Requisite Type
    class RequisiteType extends Model {}
    RequisiteType.init(
      {
        Requisite_ID: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        Requisite_Type: DataTypes.STRING,
      },
      {
        sequelize,
        modelName: "Requisite_Type",
        tableName: "Requisite_Type",
        timestamps: false,
      }
    );
    this.RequisiteType = RequisiteType;

    // Subject State
    class SubjectState extends Model {}
    SubjectState.init(
      {
        Subject_State_ID: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        Subject_State: DataTypes.STRING,
      },
      {
        sequelize,
        modelName: "Subject_State",
        tableName: "Subject_State",
        timestamps: false,
      }
    );
    this.SubjectState = SubjectState;

    // Grade State
    class GradeState extends Model {}
    GradeState.init(
      {
        Grade_State_ID: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        Grade_State: DataTypes.STRING,
      },
      {
        sequelize,
        modelName: "Grade_State",
        tableName: "Grade_State",
        timestamps: false,
      }
    );
    this.GradeState = GradeState;
  }

  static initSimpleTypes() {
    // Flags
    class Flags extends Model {}
    Flags.init(
      {
        Flag_ID: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        Flag_Type: DataTypes.STRING,
      },
      { sequelize, modelName: "Flags", tableName: "Flags", timestamps: false }
    );
    this.Flags = Flags;

    // Degree Type
    class DegreeType extends Model {}
    DegreeType.init(
      {
        Degree_Type_ID: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        Degree_Type: DataTypes.STRING,
      },
      {
        sequelize,
        modelName: "Degree_Type",
        tableName: "Degree_Type",
        timestamps: false,
      }
    );
    this.DegreeType = DegreeType;

    // Semester Type
    class SemesterType extends Model {}
    SemesterType.init(
      {
        Semester_ID: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        Semester_Type: DataTypes.STRING,
      },
      {
        sequelize,
        modelName: "Semester_Type",
        tableName: "Semester_Type",
        timestamps: false,
      }
    );
    this.SemesterType = SemesterType;
  }

  static initCoreEntities() {
    // College
    class College extends Model {}
    College.init(
      {
        College_ID: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        College_Name: DataTypes.STRING,
      },
      {
        sequelize,
        modelName: "College",
        tableName: "College",
        timestamps: false,
      }
    );
    this.College = College;

    // Majors
    class Majors extends Model {}
    Majors.init(
      {
        Major_ID: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        College_ID: DataTypes.INTEGER,
        Major_Name: DataTypes.STRING,
      },
      { sequelize, modelName: "Majors", tableName: "Majors", timestamps: false }
    );
    this.Majors = Majors;

    // Courses
    class Courses extends Model {}
    Courses.init(
      {
        Course_ID: {
          type: DataTypes.TEXT,
          primaryKey: true,
        },
        Course_Name: DataTypes.STRING,
        Credited_hours: DataTypes.INTEGER,
        Success_ID: DataTypes.INTEGER,
      },
      {
        sequelize,
        modelName: "Courses",
        tableName: "Courses",
        timestamps: false,
      }
    );
    this.Courses = Courses;

    // Students
    class Students extends Model {}
    Students.init(
      {
        Student_ID: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        Student_Name: DataTypes.STRING,
        Degree_ID: DataTypes.INTEGER,
        Major_ID: DataTypes.INTEGER,
        Plan_Year: DataTypes.INTEGER,
        Acceptance_Year: DataTypes.INTEGER,
        Acceptance_Semester: DataTypes.INTEGER,
        Password: DataTypes.STRING,
        Email: DataTypes.STRING,
      },
      {
        sequelize,
        modelName: "Students",
        tableName: "Students",
        timestamps: false,
      }
    );
    this.Students = Students;
  }

  static initRequestModels() {
    // Schedule
    class Schedule extends Model {}
    Schedule.init(
      {
        College_ID: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        Course_ID: {
          type: DataTypes.TEXT,
          primaryKey: true,
        },
        Course_Section: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        Section_Limit: DataTypes.INTEGER,
        No_of_Reg_Stud: DataTypes.INTEGER,
        Days: DataTypes.STRING,
        From: DataTypes.TIME,
        To: DataTypes.TIME,
        Hall: DataTypes.STRING,
      },
      {
        sequelize,
        modelName: "Schedule",
        tableName: "Schedule",
        timestamps: false,
      }
    );
    this.Schedule = Schedule;

    // Plan Courses
    class PlanCourses extends Model {}
    PlanCourses.init(
      {
        Major_ID: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        Plan_Year: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        Course_ID: {
          type: DataTypes.TEXT,
          primaryKey: true,
        },
        Requisite_ID: DataTypes.INTEGER,
      },
      {
        sequelize,
        modelName: "Plan_Courses",
        tableName: "Plan_Courses",
        timestamps: false,
      }
    );
    this.PlanCourses = PlanCourses;

    // Prerequisite
    class Prerequisite extends Model {}
    Prerequisite.init(
      {
        Major_ID: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        Plan_Year: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        Course_ID: {
          type: DataTypes.TEXT,
          primaryKey: true,
        },
        Prerequisite_Course_ID: {
          type: DataTypes.TEXT,
          primaryKey: true,
        },
      },
      {
        sequelize,
        modelName: "Prerequisite",
        tableName: "Prerequisite",
        timestamps: false,
      }
    );
    this.Prerequisite = Prerequisite;
  }

  static initAdditionalTables() {
    // Degree Semester Hours
    class DegreeSemesterHours extends Model {}
    DegreeSemesterHours.init(
      {
        Semester_ID: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        Degree_ID: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        Min: DataTypes.INTEGER,
        Max: DataTypes.INTEGER,
      },
      {
        sequelize,
        modelName: "Degree_Semester_Hours",
        tableName: "Degree_Semester_Hours",
        timestamps: false,
      }
    );
    this.DegreeSemesterHours = DegreeSemesterHours;

    // Mark
    class Mark extends Model {}
    Mark.init(
      {
        Student_ID: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        Academic_Year: {
          type: DataTypes.TEXT,
          primaryKey: true,
        },
        Semester_Type: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        Course_ID: DataTypes.TEXT,
        Mark: DataTypes.INTEGER,
        Grade_State: DataTypes.INTEGER,
      },
      { sequelize, modelName: "Mark", tableName: "Mark", timestamps: false }
    );
    this.Mark = Mark;

    // Current Semester
    class CurrentSemester extends Model {}
    CurrentSemester.init(
      {
        Student_ID: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        Course_ID: {
          type: DataTypes.TEXT,
          primaryKey: true,
        },
        Section: DataTypes.INTEGER,
        Semester_Type: DataTypes.INTEGER,
        Subject_State: DataTypes.INTEGER,
        First_Exam: DataTypes.INTEGER,
        Second_Exam: DataTypes.INTEGER,
        Final_Exam: DataTypes.INTEGER,
        Total: DataTypes.INTEGER,
      },
      {
        sequelize,
        modelName: "Current_Semester",
        tableName: "Current_Semester",
        timestamps: false,
      }
    );
    this.CurrentSemester = CurrentSemester;

    // Avg Mark
    class AvgMark extends Model {}
    AvgMark.init(
      {
        Student_ID: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        Academic_Year: {
          type: DataTypes.TEXT,
          primaryKey: true,
        },
        Semester_Type: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        Semester_Avg: DataTypes.INTEGER,
        Acc_Avg: DataTypes.INTEGER,
      },
      {
        sequelize,
        modelName: "Avg_Mark",
        tableName: "Avg_Mark",
        timestamps: false,
      }
    );
    this.AvgMark = AvgMark;

    // Calendar
    class Calendar extends Model {}
    Calendar.init(
      {
        Academic_Year: {
          type: DataTypes.TEXT,
          primaryKey: true,
        },
        Semester_Type: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        Reg_Start: DataTypes.DATEONLY,
        Reg_End: DataTypes.DATEONLY,
        Withdrawal_Start: DataTypes.DATEONLY,
        Withdrawal_End: DataTypes.DATEONLY,
        Postpone_Start: DataTypes.DATEONLY,
        Postpone_End: DataTypes.DATEONLY,
      },
      {
        sequelize,
        modelName: "Calendar",
        tableName: "Calendar",
        timestamps: false,
      }
    );
    this.Calendar = Calendar;

    // Postpone Request
    class PostponeRequest extends Model {}
    PostponeRequest.init(
      {
        Student_ID: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        From_Academic_Year: {
          type: DataTypes.TEXT,
          primaryKey: true,
        },
        From_Semester_Type: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        No_of_Semesters: DataTypes.INTEGER,
        Reason: DataTypes.STRING,
        Timestamp: DataTypes.DATE,
      },
      {
        sequelize,
        modelName: "Postpone_Request",
        tableName: "Postpone_Request",
        timestamps: false,
      }
    );
    this.PostponeRequest = PostponeRequest;

    // Overload Request
    class OverloadRequest extends Model {}
    OverloadRequest.init(
      {
        Student_ID: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        Academic_Year: {
          type: DataTypes.TEXT,
          primaryKey: true,
        },
        Semester_Type: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        No_of_Hours: DataTypes.INTEGER,
        Timestamp: DataTypes.DATE,
      },
      {
        sequelize,
        modelName: "Overload_Request",
        tableName: "Overload_Request",
        timestamps: false,
      }
    );
    this.OverloadRequest = OverloadRequest;

    // Synchronization Request
    class SynchronizationRequest extends Model {}
    SynchronizationRequest.init(
      {
        Student_ID: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        Academic_Year: {
          type: DataTypes.TEXT,
          primaryKey: true,
        },
        Semester_Type: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        CoreCourse_ID: {
          type: DataTypes.TEXT,
          primaryKey: true,
        },
        Prereq_Course_ID: DataTypes.TEXT,
        Timestamp: DataTypes.DATE,
      },
      {
        sequelize,
        modelName: "Synchronization_Request",
        tableName: "Synchronization_Request",
        timestamps: false,
      }
    );
    this.SynchronizationRequest = SynchronizationRequest;

    // Substitute Request
    class SubstituteRequest extends Model {}
    SubstituteRequest.init(
      {
        Student_ID: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        Academic_Year: {
          type: DataTypes.TEXT,
          primaryKey: true,
        },
        Semester_Type: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        OrgCourse_ID: {
          type: DataTypes.TEXT,
          primaryKey: true,
        },
        Flag: DataTypes.INTEGER,
        Timestamp: DataTypes.DATE,
      },
      {
        sequelize,
        modelName: "Substitute_Request",
        tableName: "Substitute_Request",
        timestamps: false,
      }
    );
    this.SubstituteRequest = SubstituteRequest;

    // Substitute
    class Substitute extends Model {}
    Substitute.init(
      {
        Student_ID: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        Academic_Year: {
          type: DataTypes.TEXT,
          primaryKey: true,
        },
        Semester_Type: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        OrgCourse_ID: {
          type: DataTypes.TEXT,
          primaryKey: true,
        },
        SubstCourse_ID: DataTypes.TEXT,
      },
      {
        sequelize,
        modelName: "Substitute",
        tableName: "Substitute",
        timestamps: false,
      }
    );
    this.Substitute = Substitute;
  }
  static setupAssociations() {
    const {
      College,
      Majors,
      Courses,
      Students,
      DegreeType,
      SemesterType,
      SuccessType,
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
      SubjectState,
      GradeState,
      Flags,
      RequisiteType,
    } = this;

    // College and Majors Associations
    College.hasMany(Majors, {
      foreignKey: "College_ID",
      as: "CollegeMajors",
    });
    Majors.belongsTo(College, {
      foreignKey: "College_ID",
      as: "ParentCollege",
    });

    // Majors and Prerequisite Associations
    Majors.hasMany(Prerequisite, {
      foreignKey: "Major_ID",
      as: "MajorPrerequisites",
    });
    Prerequisite.belongsTo(Majors, {
      foreignKey: "Major_ID",
      as: "RelatedMajor",
    });

    // Courses Prerequisite Associations
    Courses.hasMany(Prerequisite, {
      foreignKey: "Course_ID",
      as: "CoursePrerequisites",
    });
    Prerequisite.belongsTo(Courses, {
      foreignKey: "Course_ID",
      as: "MainCourseDetails",
    });

    Courses.hasMany(Prerequisite, {
      foreignKey: "Prerequisite_Course_ID",
      as: "PrerequisiteOfCourses",
    });
    Prerequisite.belongsTo(Courses, {
      foreignKey: "Prerequisite_Course_ID",
      as: "PrerequisiteCourseDetails",
    });

    // Students Associations
    Majors.hasMany(Students, {
      foreignKey: "Major_ID",
      as: "StudentsInMajor",
    });
    Students.belongsTo(Majors, {
      foreignKey: "Major_ID",
      as: "StudentMajorDetails",
    });

    DegreeType.hasMany(Students, {
      foreignKey: "Degree_ID",
      as: "StudentsWithDegree",
    });
    Students.belongsTo(DegreeType, {
      foreignKey: "Degree_ID",
      as: "StudentDegreeType",
    });

    // Semester Type Associations
    SemesterType.hasMany(DegreeSemesterHours, {
      foreignKey: "Semester_ID",
      as: "SemesterHourDetails",
    });
    DegreeSemesterHours.belongsTo(SemesterType, {
      foreignKey: "Semester_ID",
      as: "RelatedSemesterType",
    });

    DegreeType.hasMany(DegreeSemesterHours, {
      foreignKey: "Degree_ID",
      as: "DegreeHourLimits",
    });
    DegreeSemesterHours.belongsTo(DegreeType, {
      foreignKey: "Degree_ID",
      as: "RelatedDegreeType",
    });

    // Mark Associations
    Students.hasMany(Mark, {
      foreignKey: "Student_ID",
      as: "StudentMarks",
    });
    Mark.belongsTo(Students, {
      foreignKey: "Student_ID",
      as: "StudentDetails",
    });

    SemesterType.hasMany(Mark, {
      foreignKey: "Semester_Type",
      as: "SemesterMarks",
    });
    Mark.belongsTo(SemesterType, {
      foreignKey: "Semester_Type",
      as: "SemesterDetails",
    });

    Courses.hasMany(Mark, {
      foreignKey: "Course_ID",
      as: "CourseMarks",
    });
    Mark.belongsTo(Courses, {
      foreignKey: "Course_ID",
      as: "CourseDetails",
    });

    GradeState.hasMany(Mark, {
      foreignKey: "Grade_State",
      as: "MarksWithGradeState",
    });
    Mark.belongsTo(GradeState, {
      foreignKey: "Grade_State",
      as: "GradeStateDetails",
    });

    // Current Semester Associations
    Students.hasMany(CurrentSemester, {
      foreignKey: "Student_ID",
      as: "CurrentSemesterRegistrations",
    });
    CurrentSemester.belongsTo(Students, {
      foreignKey: "Student_ID",
      as: "StudentDetails",
    });

    Courses.hasMany(CurrentSemester, {
      foreignKey: "Course_ID",
      as: "CurrentSemesterCourses",
    });
    CurrentSemester.belongsTo(Courses, {
      foreignKey: "Course_ID",
      as: "CourseDetails",
    });

    SemesterType.hasMany(CurrentSemester, {
      foreignKey: "Semester_Type",
      as: "CurrentSemesterRegistrations",
    });
    CurrentSemester.belongsTo(SemesterType, {
      foreignKey: "Semester_Type",
      as: "SemesterDetails",
    });

    SubjectState.hasMany(CurrentSemester, {
      foreignKey: "Subject_State",
      as: "CurrentSemesterWithState",
    });
    CurrentSemester.belongsTo(SubjectState, {
      foreignKey: "Subject_State",
      as: "SubjectStateDetails",
    });

    // Average Mark Associations
    Students.hasMany(AvgMark, {
      foreignKey: "Student_ID",
      as: "StudentAverageMarks",
    });
    AvgMark.belongsTo(Students, {
      foreignKey: "Student_ID",
      as: "StudentDetails",
    });

    SemesterType.hasMany(AvgMark, {
      foreignKey: "Semester_Type",
      as: "SemesterAverageMarks",
    });
    AvgMark.belongsTo(SemesterType, {
      foreignKey: "Semester_Type",
      as: "SemesterDetails",
    });

    // Calendar Associations
    SemesterType.hasMany(Calendar, {
      foreignKey: "Semester_Type",
      as: "SemesterCalendars",
    });
    Calendar.belongsTo(SemesterType, {
      foreignKey: "Semester_Type",
      as: "SemesterDetails",
    });

    // Postpone Request Associations
    Students.hasMany(PostponeRequest, {
      foreignKey: "Student_ID",
      as: "StudentPostponeRequests",
    });
    PostponeRequest.belongsTo(Students, {
      foreignKey: "Student_ID",
      as: "StudentDetails",
    });

    SemesterType.hasMany(PostponeRequest, {
      foreignKey: "From_Semester_Type",
      as: "PostponeRequestsBySemester",
    });
    PostponeRequest.belongsTo(SemesterType, {
      foreignKey: "From_Semester_Type",
      as: "FromSemesterDetails",
    });

    // Overload Request Associations
    Students.hasMany(OverloadRequest, {
      foreignKey: "Student_ID",
      as: "StudentOverloadRequests",
    });
    OverloadRequest.belongsTo(Students, {
      foreignKey: "Student_ID",
      as: "StudentDetails",
    });

    SemesterType.hasMany(OverloadRequest, {
      foreignKey: "Semester_Type",
      as: "OverloadRequestsBySemester",
    });
    OverloadRequest.belongsTo(SemesterType, {
      foreignKey: "Semester_Type",
      as: "SemesterDetails",
    });

    // Synchronization Request Associations
    Students.hasMany(SynchronizationRequest, {
      foreignKey: "Student_ID",
      as: "StudentSyncRequests",
    });
    SynchronizationRequest.belongsTo(Students, {
      foreignKey: "Student_ID",
      as: "StudentDetails",
    });

    SemesterType.hasMany(SynchronizationRequest, {
      foreignKey: "Semester_Type",
      as: "SyncRequestsBySemester",
    });
    SynchronizationRequest.belongsTo(SemesterType, {
      foreignKey: "Semester_Type",
      as: "SemesterDetails",
    });

    Courses.hasMany(SynchronizationRequest, {
      foreignKey: "CoreCourse_ID",
      as: "CoreCourseSyncRequests",
    });
    SynchronizationRequest.belongsTo(Courses, {
      foreignKey: "CoreCourse_ID",
      as: "CoreCourseDetails",
    });

    Courses.hasMany(SynchronizationRequest, {
      foreignKey: "Prereq_Course_ID",
      as: "PrereqCourseSyncRequests",
    });
    SynchronizationRequest.belongsTo(Courses, {
      foreignKey: "Prereq_Course_ID",
      as: "PrereqCourseDetails",
    });

    // Substitute Request Associations
    Students.hasMany(SubstituteRequest, {
      foreignKey: "Student_ID",
      as: "StudentSubstituteRequests",
    });
    SubstituteRequest.belongsTo(Students, {
      foreignKey: "Student_ID",
      as: "StudentDetails",
    });

    SemesterType.hasMany(SubstituteRequest, {
      foreignKey: "Semester_Type",
      as: "SubstituteRequestsBySemester",
    });
    SubstituteRequest.belongsTo(SemesterType, {
      foreignKey: "Semester_Type",
      as: "SemesterDetails",
    });

    Courses.hasMany(SubstituteRequest, {
      foreignKey: "OrgCourse_ID",
      as: "OriginalCourseSubstituteRequests",
    });
    SubstituteRequest.belongsTo(Courses, {
      foreignKey: "OrgCourse_ID",
      as: "OriginalCourseDetails",
    });

    Flags.hasMany(SubstituteRequest, {
      foreignKey: "Flag",
      as: "SubstituteRequestsByFlag",
    });
    SubstituteRequest.belongsTo(Flags, {
      foreignKey: "Flag",
      as: "FlagDetails",
    });

    // Substitute Associations
    Students.hasMany(Substitute, {
      foreignKey: "Student_ID",
      as: "StudentSubstitutes",
    });
    Substitute.belongsTo(Students, {
      foreignKey: "Student_ID",
      as: "StudentDetails",
    });

    SemesterType.hasMany(Substitute, {
      foreignKey: "Semester_Type",
      as: "SubstitutesBySemester",
    });
    Substitute.belongsTo(SemesterType, {
      foreignKey: "Semester_Type",
      as: "SemesterDetails",
    });

    Courses.hasMany(Substitute, {
      foreignKey: "OrgCourse_ID",
      as: "OriginalCourseSubstitutes",
    });
    Substitute.belongsTo(Courses, {
      foreignKey: "OrgCourse_ID",
      as: "OriginalCourseDetails",
    });

    Courses.hasMany(Substitute, {
      foreignKey: "SubstCourse_ID",
      as: "SubstituteCourses",
    });
    Substitute.belongsTo(Courses, {
      foreignKey: "SubstCourse_ID",
      as: "SubstituteCourseDetails",
    });
  }

  // Synchronization method
  static async syncDatabase() {
    try {
      // Sync base and simple types
      await this.SuccessType.sync({ force: false });
      await this.RequisiteType.sync({ force: false });
      await this.SubjectState.sync({ force: false });
      await this.GradeState.sync({ force: false });
      await this.Flags.sync({ force: false });
      await this.DegreeType.sync({ force: false });
      await this.SemesterType.sync({ force: false });

      // Sync core entities
      await this.College.sync({ force: false });
      await this.Majors.sync({ force: false });
      await this.Courses.sync({ force: false });
      await this.Students.sync({ force: false });

      // Sync additional tables
      await this.Schedule.sync({ force: false });
      await this.PlanCourses.sync({ force: false });
      await this.Prerequisite.sync({ force: false });
      await this.DegreeSemesterHours.sync({ force: false });
      await this.Mark.sync({ force: false });
      await this.CurrentSemester.sync({ force: false });
      await this.AvgMark.sync({ force: false });
      await this.Calendar.sync({ force: false });
      await this.PostponeRequest.sync({ force: false });
      await this.OverloadRequest.sync({ force: false });
      await this.SynchronizationRequest.sync({ force: false });
      await this.SubstituteRequest.sync({ force: false });
      await this.Substitute.sync({ force: false });

      console.log("Database synchronized successfully");
    } catch (error) {
      console.error("Error synchronizing database:", error);
      throw error;
    }
  }
}

// Initialize all models
ModelInitializer.init();

// Sync database
// ModelInitializer.syncDatabase(); //run this if you add a new table

// Export models and sync method
module.exports = {
  College: ModelInitializer.College,
  Majors: ModelInitializer.Majors,
  Courses: ModelInitializer.Courses,
  Students: ModelInitializer.Students,
  Schedule: ModelInitializer.Schedule,
  PlanCourses: ModelInitializer.PlanCourses,
  Prerequisite: ModelInitializer.Prerequisite,
  DegreeSemesterHours: ModelInitializer.DegreeSemesterHours,
  Mark: ModelInitializer.Mark,
  CurrentSemester: ModelInitializer.CurrentSemester,
  AvgMark: ModelInitializer.AvgMark,
  Calendar: ModelInitializer.Calendar,
  PostponeRequest: ModelInitializer.PostponeRequest,
  OverloadRequest: ModelInitializer.OverloadRequest,
  SynchronizationRequest: ModelInitializer.SynchronizationRequest,
  SubstituteRequest: ModelInitializer.SubstituteRequest,
  Substitute: ModelInitializer.Substitute,
  SuccessType: ModelInitializer.SuccessType,
  RequisiteType: ModelInitializer.RequisiteType,
  SubjectState: ModelInitializer.SubjectState,
  GradeState: ModelInitializer.GradeState,
  Flags: ModelInitializer.Flags,
  DegreeType: ModelInitializer.DegreeType,
  SemesterType: ModelInitializer.SemesterType,
  syncDatabase: ModelInitializer.syncDatabase,
};
