const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config();

const authRoutes = require('./routes/authRoute');
const appRoutes = require('./routes/appRoute');
const appointmentRoutes = require('./routes/appointmentRoute');
const uploadRoutes = require('./routes/uploadRoute');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Ensure uploads dir
if (!fs.existsSync('uploads')){
    fs.mkdirSync('uploads');
}

mongoose.set('debug', true);
mongoose.set('autoIndex', false);
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/passport_db')
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB Connection Error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/applications', appRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/upload', uploadRoutes);

// Base route
app.get('/', (req, res) => {
  res.send('Passport API is running..');
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
