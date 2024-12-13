const bcrypt = require('bcrypt');
const {
 Students
  } = require("../models");
  // Utility function for error handling
  const handleServerError = (res, error) => {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while processing your request",
      error: error.message,
    });
  };

  const hashPasswords = async () => {
    try {
      // Fetch all students
      const students = await Students.findAll();
  
      for (const student of students) {
        // Skip hashing if the password is already hashed (assuming bcrypt hashes start with $2b$ or $2a$)
        if (student.Password.startsWith('$2')) {
          console.log(`Password for Student_ID ${student.Student_ID} is already hashed. Skipping.`);
          continue;
        }
  
        // Hash the current plaintext password
        const hashedPassword = await bcrypt.hash(student.Password, 10);
  
        // Update the student's password in the database
        await Students.update(
          { Password: hashedPassword },
          { where: { Student_ID: student.Student_ID } }
        );
  
        console.log(`Password for Student_ID ${student.Student_ID} has been hashed and updated.`);
      }
  
      console.log('All passwords have been processed.');
    } catch (error) {
      console.error('Error hashing passwords:', error);
    }
  };
  
  module.exports=hashPasswords();
  