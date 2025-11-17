import mongoose from 'mongoose';

const stopSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  }
}, { _id: true });

const routeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Route name is required'],
    trim: true
  },
  color: {
    type: String,
    default: '#1E90FF',
    match: [/^#[0-9A-F]{6}$/i, 'Color must be a valid hex color']
  },
  stops: [stopSchema],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Route = mongoose.model('Route', routeSchema);

export default Route;

