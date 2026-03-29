const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['Draft', 'Pending Documents', 'Appointment Scheduled', 'Submitted', 'Approved', 'Rejected'],
    default: 'Draft'
  },
  personalDetails: {
    firstName: String,
    lastName: String,
    dob: String,
    gender: String,
    placeOfBirth: String
  },
  addressDetails: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  identityInformation: {
    nationalIdType: String,
    nationalIdNumber: String
  },
  documents: [{
    type: { type: String },
    url: String,
    status: { type: String, enum: ['Pending', 'Uploaded', 'Verified'], default: 'Pending' }
  }],
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  },
  lastSavedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);
