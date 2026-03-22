const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortCode: { type: String, required: true, unique: true },
  customAlias: { type: String, unique: true, sparse: true },
  iosUrl: { type: String },
  androidUrl: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  clickCount: { type: Number, default: 0 },
  expiresAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Url', urlSchema);
