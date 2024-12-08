const database = require("../../config/database");

const dbService = () => {
  const authenticateDB = () => database.authenticate();

  const errorDBStart = (err) =>
    console.info("unable to connect to the database:", err);

  const startProd = async () => {
    try {
      await authenticateDB();
    } catch (err) {
      errorDBStart(err);
    }
  };

  const start = async () => {
    await startProd();
  };

  return {
    start,
  };
};

module.exports = dbService;
