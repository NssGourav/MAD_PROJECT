import mongoose from 'mongoose';

const shuttleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Shuttle name is required'],
    trim: true
  },
  routeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route',
    required: [true, 'Route ID is required']
  },
  latitude: {
    type: Number,
    required: true,
    default: 0
  },
  longitude: {
    type: Number,
    required: true,
    default: 0
  },
  speedKph: {
    type: Number,
    default: 0,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for geospatial queries
shuttleSchema.index({ latitude: 1, longitude: 1 });

const Shuttle = mongoose.model('Shuttle', shuttleSchema);

export default Shuttle;

