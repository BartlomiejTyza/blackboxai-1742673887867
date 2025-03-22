const Loyalty = require('../models/Loyalty');
const User = require('../models/User');

const loyaltyController = {
  // Get loyalty points
  async getLoyaltyPoints(req, res, next) {
    try {
      const { clientId } = req.params;

      const loyalty = await Loyalty.findOne({ client: clientId })
        .populate('client', 'name email');

      if (!loyalty) {
        return res.status(404).json({
          success: false,
          message: 'Loyalty record not found'
        });
      }

      // Check if eligible for discount
      const isEligibleForDiscount = loyalty.isEligibleForDiscount();

      res.status(200).json({
        success: true,
        data: {
          ...loyalty.toObject(),
          isEligibleForDiscount
        },
        message: 'Loyalty points retrieved successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  // Earn loyalty points
  async earnLoyaltyPoints(req, res, next) {
    try {
      const { clientId, spentAmount } = req.body;

      // Verify client exists
      const client = await User.findById(clientId);
      if (!client) {
        return res.status(404).json({
          success: false,
          message: 'Client not found'
        });
      }

      // Calculate points (50zł = 0.5pt)
      const pointsEarned = Loyalty.calculatePoints(spentAmount);

      // Find or create loyalty record
      let loyalty = await Loyalty.findOne({ client: clientId });
      
      if (!loyalty) {
        loyalty = new Loyalty({
          client: clientId,
          points: 0,
          totalSpent: 0
        });
      }

      // Update points and total spent
      loyalty.points += pointsEarned;
      loyalty.totalSpent += spentAmount;
      
      // Add to points history
      loyalty.pointsHistory.push({
        amount: pointsEarned,
        transactionType: 'earn',
        description: `Points earned for spending ${spentAmount}zł`
      });

      await loyalty.save();

      // Check if eligible for discount after update
      const isEligibleForDiscount = loyalty.isEligibleForDiscount();

      res.status(200).json({
        success: true,
        data: {
          pointsEarned,
          totalPoints: loyalty.points,
          isEligibleForDiscount
        },
        message: 'Loyalty points earned successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  // Redeem points for discount
  async redeemPoints(req, res, next) {
    try {
      const { clientId, serviceId } = req.body;

      const loyalty = await Loyalty.findOne({ client: clientId });
      
      if (!loyalty) {
        return res.status(404).json({
          success: false,
          message: 'Loyalty record not found'
        });
      }

      // Check if enough points for discount (10 points = 10% discount)
      if (!loyalty.isEligibleForDiscount()) {
        return res.status(400).json({
          success: false,
          message: 'Not enough points for discount'
        });
      }

      // Deduct points and record discount usage
      loyalty.points -= 10; // Deduct points needed for discount
      loyalty.discountsUsed.push({
        amount: 10, // 10% discount
        serviceId
      });

      // Add to points history
      loyalty.pointsHistory.push({
        amount: -10,
        transactionType: 'redeem',
        description: 'Points redeemed for 10% discount'
      });

      await loyalty.save();

      res.status(200).json({
        success: true,
        data: {
          remainingPoints: loyalty.points,
          discountApplied: 10 // 10% discount
        },
        message: 'Points redeemed successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  // Get loyalty history
  async getLoyaltyHistory(req, res, next) {
    try {
      const { clientId } = req.params;

      const loyalty = await Loyalty.findOne({ client: clientId })
        .populate('client', 'name email')
        .populate('discountsUsed.serviceId');

      if (!loyalty) {
        return res.status(404).json({
          success: false,
          message: 'Loyalty record not found'
        });
      }

      res.status(200).json({
        success: true,
        data: {
          pointsHistory: loyalty.pointsHistory,
          discountsUsed: loyalty.discountsUsed
        },
        message: 'Loyalty history retrieved successfully'
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = loyaltyController;