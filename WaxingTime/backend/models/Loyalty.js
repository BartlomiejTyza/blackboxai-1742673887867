const mongoose = require('mongoose');

const loyaltySchema = new mongoose.Schema({
  client: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    unique: true 
  },
  points: { 
    type: Number, 
    default: 0 
  },
  pointsHistory: [{
    amount: { type: Number, required: true },
    transactionType: { type: String, enum: ['earn', 'redeem'], required: true },
    description: { type: String },
    date: { type: Date, default: Date.now }
  }],
  totalSpent: { 
    type: Number, 
    default: 0 
  },
  discountsUsed: [{
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' }
  }]
}, {
  timestamps: true
});

// Static method to calculate points from spent amount
loyaltySchema.statics.calculatePoints = function(spentAmount) {
  // 50zł = 0.5 points
  return (spentAmount / 50) * 0.5;
};

// Method to check if eligible for discount
loyaltySchema.methods.isEligibleForDiscount = function() {
  // 10 points = 10% discount
  return this.points >= 10;
};

module.exports = mongoose.model('Loyalty', loyaltySchema);