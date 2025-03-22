const { sendEmail } = require('../utils/emailSender');

const notificationController = {
  // Send notification
  async sendNotification(req, res, next) {
    try {
      const { email, template, data } = req.body;

      const result = await sendEmail(email, template, data);

      res.status(200).json({
        success: true,
        data: result,
        message: 'Notification sent successfully'
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = notificationController;