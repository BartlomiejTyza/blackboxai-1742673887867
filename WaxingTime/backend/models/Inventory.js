const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  productName: { type: String, required: true },
  quantity: { type: Number, required: true },
  threshold: { type: Number, required: true }, // Minimum quantity before alert
  lastUpdated: { type: Date, default: Date.now },
  description: { type: String }
});

// Index for quick queries on product name
inventorySchema.index({ productName: 1 });

module.exports = mongoose.model('Inventory', inventorySchema);