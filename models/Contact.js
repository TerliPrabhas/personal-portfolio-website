const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  messageId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, default: 'General Inquiry' },
  message: { type: String, required: true },
  status: { type: String, default: 'Received' }
}, { timestamps: true });

module.exports = mongoose.models.Contact || mongoose.model('Contact', contactSchema);
