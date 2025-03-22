const Queue = require('../models/Queue');
const User = require('../models/User');
const Feedback = require('../models/Feedback');

const reportController = {
  // Get revenue report
  async getRevenueReport(req, res, next) {
    try {
      const { startDate, endDate } = req.query;
      
      const completedServices = await Queue.find({
        status: 'completed',
        completedAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      });

      // Calculate total revenue and daily breakdown
      const revenue = {
        total: 0,
        dailyBreakdown: {}
      };

      completedServices.forEach(service => {
        const date = service.completedAt.toISOString().split('T')[0];
        revenue.total += service.estimatedTime; // Assuming price is based on time
        revenue.dailyBreakdown[date] = (revenue.dailyBreakdown[date] || 0) + service.estimatedTime;
      });

      res.status(200).json({
        success: true,
        data: revenue,
        message: 'Revenue report generated successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  // Get popular services report
  async getPopularServices(req, res, next) {
    try {
      const { startDate, endDate } = req.query;

      const services = await Queue.aggregate([
        {
          $match: {
            status: 'completed',
            completedAt: {
              $gte: new Date(startDate),
              $lte: new Date(endDate)
            }
          }
        },
        {
          $group: {
            _id: '$service',
            count: { $sum: 1 },
            totalTime: { $sum: '$estimatedTime' }
          }
        },
        {
          $sort: { count: -1 }
        }
      ]);

      res.status(200).json({
        success: true,
        data: services,
        message: 'Popular services report generated successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  // Get team efficiency report
  async getTeamEfficiency(req, res, next) {
    try {
      const { startDate, endDate } = req.query;

      const staffEfficiency = await Queue.aggregate([
        {
          $match: {
            status: 'completed',
            completedAt: {
              $gte: new Date(startDate),
              $lte: new Date(endDate)
            }
          }
        },
        {
          $group: {
            _id: '$assignedStaff',
            servicesCompleted: { $sum: 1 },
            totalTime: { $sum: '$estimatedTime' },
            averageTime: { $avg: '$estimatedTime' }
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'staffInfo'
          }
        },
        {
          $unwind: '$staffInfo'
        },
        {
          $project: {
            staffName: '$staffInfo.name',
            servicesCompleted: 1,
            totalTime: 1,
            averageTime: 1
          }
        }
      ]);

      res.status(200).json({
        success: true,
        data: staffEfficiency,
        message: 'Team efficiency report generated successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  // Get dashboard summary
  async getDashboardSummary(req, res, next) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Today's statistics
      const todayStats = await Promise.all([
        Queue.countDocuments({ 
          status: 'completed',
          completedAt: { $gte: today }
        }),
        Queue.countDocuments({ 
          status: 'waiting'
        }),
        Feedback.aggregate([
          {
            $match: {
              createdAt: { $gte: today }
            }
          },
          {
            $group: {
              _id: null,
              averageRating: { $avg: '$rating' }
            }
          }
        ])
      ]);

      const summary = {
        todayCompletedServices: todayStats[0],
        currentQueueLength: todayStats[1],
        todayAverageRating: todayStats[2][0]?.averageRating || 0,
      };

      res.status(200).json({
        success: true,
        data: summary,
        message: 'Dashboard summary generated successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  // Get custom report
  async getCustomReport(req, res, next) {
    try {
      const { startDate, endDate, metrics } = req.body;

      const reportData = {};

      // Dynamically generate requested metrics
      if (metrics.includes('revenue')) {
        const revenue = await Queue.aggregate([
          {
            $match: {
              status: 'completed',
              completedAt: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
              }
            }
          },
          {
            $group: {
              _id: null,
              total: { $sum: '$estimatedTime' }
            }
          }
        ]);
        reportData.revenue = revenue[0]?.total || 0;
      }

      if (metrics.includes('customerSatisfaction')) {
        const satisfaction = await Feedback.aggregate([
          {
            $match: {
              createdAt: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
              }
            }
          },
          {
            $group: {
              _id: null,
              averageRating: { $avg: '$rating' }
            }
          }
        ]);
        reportData.customerSatisfaction = satisfaction[0]?.averageRating || 0;
      }

      res.status(200).json({
        success: true,
        data: reportData,
        message: 'Custom report generated successfully'
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = reportController;