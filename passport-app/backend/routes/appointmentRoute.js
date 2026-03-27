const express = require('express');
const Appointment = require('../models/Appointment');
const Application = require('../models/Application');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/available', protect, (req, res) => {
  const slots = [
    '09:00 AM', '10:00 AM', '11:00 AM', 
    '01:00 PM', '02:00 PM', '03:30 PM'
  ];
  res.json(slots);
});

router.post('/book', protect, async (req, res) => {
  const { applicationId, location, date, timeSlot } = req.body;
  try {
    const existingAppointments = await Appointment.find({ date, timeSlot, location });
    if (existingAppointments.length >= 5) {
      return res.status(400).json({ message: 'Slot full' });
    }

    const appointment = await Appointment.create({
      userId: req.user._id,
      applicationId,
      location,
      date,
      timeSlot
    });
    
    const application = await Application.findById(applicationId);
    if(application) {
      application.appointmentId = appointment._id;
      application.status = 'Appointment Scheduled';
      await application.save();
    }

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
