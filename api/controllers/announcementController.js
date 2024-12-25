const { Announcement, AnnouncementType} = require("../models/index");

const AnnouncementController= {
    getFinanceAnnouncement: async (req, res) => {
        try {
            const announcement = await Announcement.findAll({
              where: { Announcement_Type_ID: 1 },
            });
            res.status(200).json({
              message: "Finance Announcement retrieved successfully",
              data: announcement,
            });
          } catch (error) {
            handleServerError(res, error);
          }
        
    },

    getRegistrationAnnouncement: async (req, res) => {
        try {
            const announcement = await Announcement.findAll({
              where: { Announcement_Type_ID: 2 },
            });
            res.status(200).json({
              message: "Registration Announcement retrieved successfully",
              data: announcement,
            });
          } catch (error) {
            handleServerError(res, error);
          }
        
    }
}

module.exports = AnnouncementController;