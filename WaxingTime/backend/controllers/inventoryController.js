const Inventory = require('../models/Inventory');

const inventoryController = {
  // Get inventory
  async getInventory(req, res, next) {
    try {
      const inventory = await Inventory.find().sort('productName');
      res.status(200).json({
        success: true,
        data: inventory,
        message: 'Inventory retrieved successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  // Add new product
  async addProduct(req, res, next) {
    try {
      const { productName, quantity, threshold, description } = req.body;

      const newProduct = new Inventory({
        productName,
        quantity,
        threshold,
        description
      });

      await newProduct.save();

      res.status(201).json({
        success: true,
        data: newProduct,
        message: 'Product added successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  // Update stock
  async updateStock(req, res, next) {
    try {
      const { id } = req.params;
      const { quantity } = req.body;

      const product = await Inventory.findByIdAndUpdate(
        id,
        { $set: { quantity } },
        { new: true }
      );

      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }

      res.status(200).json({
        success: true,
        data: product,
        message: 'Stock updated successfully'
      });
    } catch (error) {
      next(error);
    }
  },

  // Get low stock alerts
  async getLowStockAlerts(req, res, next) {
    try {
      const lowStockProducts = await Inventory.find({ quantity: { $lt: threshold } });
      res.status(200).json({
        success: true,
        data: lowStockProducts,
        message: 'Low stock products retrieved successfully'
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = inventoryController;