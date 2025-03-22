const Feedback = require('../models/Feedback');
const User = require('../models/User');

const feedbackController = {
  // Submit feedback
  async submitFeedback(req, res, next) {
    try {
      const { clientId, rating, comments } = req.body;

      // Verify client exists
      const client = await User.findById(clientId);
      if (!client) {
        return res.status(404).json({
          success: false,
          message: 'Client not found'
        });
      }

      const feedback = new Feedback({
        client: clientId,
        rating,
        comments
      });

      await feedback.save();

      res.status(201).json({
        success: true,
        data: feedback,
        message: 'Feedback submitted successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  // Get feedback
  async getFeedback(req, res, next) {
    try {
      const { startDate, endDate, clientId } = req.query;

      let query = {};

      // Add date range to query if provided
      if (startDate && endDate) {
        query.createdAt = {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        };
      }

      // Add client filter if provided
      if (clientId) {
        query.client = clientId;
      }

      const feedback = await Feedback.find(query)
        .populate('client', 'name email')
        .sort('-createdAt');

      // Calculate average rating
      const averageRating = feedback.reduce((acc, curr) => acc + curr.rating, 0) / feedback.length || 0;

      res.status(200).json({
        success: true,
        data: {
          feedback,
          averageRating,
          totalCount: feedback.length
        },
        message: 'Feedback retrieved successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  // Get feedback statistics
  async getFeedbackStats(req, res, next) {
    try {
      const stats = await Feedback.aggregate([
        {
          $group: {
            _id: null,
            averageRating: { $avg: '$rating' },
            totalFeedback: { $sum: 1 },
            ratingDistribution: {
              $push: '$rating'
            }
          }
        },
        {
          $project: {
            _id: 0,
            averageRating: 1,
            totalFeedback: 1,
            ratingDistribution: {
              1: {
                $size: {
                  $filter: {
                    input: '$ratingDistribution',
                    as: 'rating',
                    cond: { $eq: ['$$rating', 1] }
                  }
                }
              },
              2: {
                $size: {
                  $filter: {
                    input: '$ratingDistribution',
                    as: 'rating',
                    cond: { $eq: ['$$rating', 2] }
                  }
                }
              },
              3: {
                $size: {
                  $filter: {
                    input: '$ratingDistribution',
                    as: 'rating',
                    cond: { $eq: ['$$rating', 3] }
                  }
                }
              },
              4: {
                $size: {
                  $filter: {
                    input: '$ratingDistribution',
                    as: 'rating',
                    cond: { $eq: ['$$rating', 4] }
                  }
                }
              },
              5: {
                $size: {
                  $filter: {
                    input: '$ratingDistribution',
                    as: 'rating',
                    cond: { $eq: ['$$rating', 5] }
                  }
                }
              }
            }
          }
        }
      ]);

      res.status(200).json({
        success: true,
        data: stats[0] || {
          averageRating: 0,
          totalFeedback: 0,
          ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        },
        message: 'Feedback statistics retrieved successfully'
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = feedbackController;