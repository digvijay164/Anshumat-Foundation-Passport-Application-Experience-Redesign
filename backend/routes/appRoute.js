const express = require('express');
const Application = require('../models/Application');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Get all applications for current user
router.get('/', protect, async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.user._id }).sort({ updatedAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new application
router.post('/', protect, async (req, res) => {
  try {
    const newApp = await Application.create({
      userId: req.user._id,
      status: 'Draft'
    });
    res.status(201).json(newApp);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get application by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      userId: req.user._id
    }).populate('appointmentId');
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update application (Autosave / Manual Save)
router.put('/:id', protect, async (req, res) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Update fields dynamically
    if (req.body.personalDetails) application.personalDetails = req.body.personalDetails;
    if (req.body.addressDetails) application.addressDetails = req.body.addressDetails;
    if (req.body.identityInformation) application.identityInformation = req.body.identityInformation;
    if (req.body.documents) application.documents = req.body.documents;
    if (req.body.status) application.status = req.body.status;
    if (req.body.appointmentId) application.appointmentId = req.body.appointmentId;
    
    application.lastSavedAt = Date.now();
    await application.save();

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
