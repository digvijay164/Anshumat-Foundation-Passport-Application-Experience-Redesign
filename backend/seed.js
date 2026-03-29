const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/passport_db');

const importData = async () => {
  try {
    await User.deleteMany();

    const demoUser = new User({
      email: 'hire-me@anshumat.org',
      password: 'HireMe@2025!',
      role: 'applicant',
    });

    await demoUser.save();
    console.log('✅ Demo User seeded successfully!');
    process.exit();
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

importData();
