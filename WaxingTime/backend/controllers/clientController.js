const User = require('../models/User');

const clientController = {
  // Get client profile
  async getClientProfile(req, res, next) {
    try {
      const { id } = req.params;
      const client = await User.findById(id).populate('visitHistory');

      if (!client) {
        return res.status(404).json({ success: false, message: 'Client not found' });
      }

      res.status(200).json({
        success: true,
        data: client,
        message: 'Client profile retrieved successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  // Update client notes
  async updateClientNotes(req, res, next) {
    try {
      const { id } = req.params;
      const { notes } = req.body;

      const client = await User.findByIdAndUpdate(
        id,
        { $set: { preferences: { notes } } },
        { new: true }
      );

      if (!client) {
        return res.status(404).json({ success: false, message: 'Client not found' });
      }

      res.status(200).json({
        success: true,
        data: client,
        message: 'Client notes updated successfully'
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = clientController;