const Queue = require('../models/Queue');
const User = require('../models/User');

const queueController = {
  // Join the queue
  async joinQueue(req, res, next) {
    try {
      const { clientId, service, estimatedTime } = req.body;

      // Verify client exists
      const client = await User.findById(clientId);
      if (!client) {
        return res.status(404).json({ success: false, message: 'Client not found' });
      }

      // Create queue entry
      const queueEntry = new Queue({
        client: clientId,
        service,
        estimatedTime,
        status: 'waiting'
      });

      await queueEntry.save();

      res.status(201).json({
        success: true,
        data: queueEntry,
        message: 'Successfully joined the queue'
      });
    } catch (error) {
      next(error);
    }
  },

  // Get current queue status
  async getQueueStatus(req, res, next) {
    try {
      const queue = await Queue.find({ 
        status: { $in: ['waiting', 'in-progress'] } 
      })
      .populate('client', 'name')
      .populate('assignedStaff', 'name')
      .sort('joinedAt');

      res.status(200).json({
        success: true,
        data: queue,
        message: 'Queue status retrieved successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  // Toggle queue system (enable/disable)
  async toggleQueue(req, res, next) {
    try {
      const { isEnabled } = req.body;

      // Update all active queue entries if disabling
      if (!isEnabled) {
        await Queue.updateMany(
          { status: 'waiting' },
          { $set: { isActive: false } }
        );
      }

      res.status(200).json({
        success: true,
        data: { isEnabled },
        message: `Queue system ${isEnabled ? 'enabled' : 'disabled'} successfully`
      });
    } catch (error) {
      next(error);
    }
  },

  // Update queue entry status
  async updateQueueStatus(req, res, next) {
    try {
      const { queueId } = req.params;
      const { status, assignedStaff } = req.body;

      const queueEntry = await Queue.findByIdAndUpdate(
        queueId,
        { 
          status,
          assignedStaff,
          ...(status === 'in-progress' && { startedAt: Date.now() }),
          ...(status === 'completed' && { completedAt: Date.now() })
        },
        { new: true }
      ).populate('client assignedStaff');

      if (!queueEntry) {
        return res.status(404).json({
          success: false,
          message: 'Queue entry not found'
        });
      }

      res.status(200).json({
        success: true,
        data: queueEntry,
        message: 'Queue status updated successfully'
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = queueController;