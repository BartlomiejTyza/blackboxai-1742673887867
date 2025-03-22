const User = require('../models/User');

const staffController = {
  // Get all staff members
  async getAllStaff(req, res, next) {
    try {
      const staff = await User.find({ role: 'staff' })
        .select('-password')
        .sort('name');

      res.status(200).json({
        success: true,
        data: staff,
        message: 'Staff members retrieved successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  // Add new staff member
  async addStaff(req, res, next) {
    try {
      const { name, email, password, schedule } = req.body;

      // Check if email already exists
      const existingStaff = await User.findOne({ email });
      if (existingStaff) {
        return res.status(400).json({
          success: false,
          message: 'Email already registered'
        });
      }

      const newStaff = new User({
        name,
        email,
        password, // Note: Should be hashed before saving
        role: 'staff',
        schedule
      });

      await newStaff.save();

      // Remove password from response
      const staffResponse = newStaff.toObject();
      delete staffResponse.password;

      res.status(201).json({
        success: true,
        data: staffResponse,
        message: 'Staff member added successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  // Update staff member
  async updateStaff(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Remove sensitive fields from update data
      delete updateData.role;
      delete updateData.password;

      const staff = await User.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true }
      ).select('-password');

      if (!staff) {
        return res.status(404).json({
          success: false,
          message: 'Staff member not found'
        });
      }

      res.status(200).json({
        success: true,
        data: staff,
        message: 'Staff member updated successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  // Update staff schedule
  async updateSchedule(req, res, next) {
    try {
      const { id } = req.params;
      const { schedule } = req.body;

      const staff = await User.findByIdAndUpdate(
        id,
        { $set: { schedule } },
        { new: true }
      ).select('-password');

      if (!staff) {
        return res.status(404).json({
          success: false,
          message: 'Staff member not found'
        });
      }

      res.status(200).json({
        success: true,
        data: staff,
        message: 'Schedule updated successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  // Track staff performance
  async getStaffPerformance(req, res, next) {
    try {
      const { id } = req.params;
      const { startDate, endDate } = req.query;

      // Get completed services by staff member
      const completedServices = await Queue.find({
        assignedStaff: id,
        status: 'completed',
        completedAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      });

      // Calculate performance metrics
      const metrics = {
        totalServices: completedServices.length,
        averageServiceTime: 0,
        clientSatisfaction: 0
      };

      if (completedServices.length > 0) {
        // Calculate average service time
        const totalTime = completedServices.reduce((acc, service) => {
          return acc + (service.completedAt - service.startedAt);
        }, 0);
        metrics.averageServiceTime = totalTime / completedServices.length;

        // Calculate client satisfaction if available
        const feedback = await Feedback.find({
          serviceId: { $in: completedServices.map(s => s._id) }
        });
        if (feedback.length > 0) {
          const totalRating = feedback.reduce((acc, f) => acc + f.rating, 0);
          metrics.clientSatisfaction = totalRating / feedback.length;
        }
      }

      res.status(200).json({
        success: true,
        data: metrics,
        message: 'Staff performance metrics retrieved successfully'
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = staffController;