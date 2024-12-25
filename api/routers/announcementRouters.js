const express = require("express");
const AnnouncementController = require("../controllers/announcementController");
const router = express.Router();

router.get("/finance",AnnouncementController.getFinanceAnnouncement);

router.get("/registration",AnnouncementController.getRegistrationAnnouncement);

module.exports = router;