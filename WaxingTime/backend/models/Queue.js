const mongoose = require('mongoose');

const queueSchema = new mongoose.Schema({
  client: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  service: { 
    type: String, 
    required: true 
  },
  estimatedTime: { 
    type: Number,  // in minutes
    required: true 
  },
  status: { 
    type: String, 
    enum: ['waiting', 'in-progress', 'completed', 'cancelled'],
    default: 'waiting' 
  },
  joinedAt: { 
    type: Date, 
    default: Date.now 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  assignedStaff: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  notes: { 
    type: String 
  }
}, {
  timestamps: true
});

// Index for quick queries on status and joinedAt
queueSchema.index({ status: 1, joinedAt: 1 });

module.exports = mongoose.model('Queue', queueSchema);