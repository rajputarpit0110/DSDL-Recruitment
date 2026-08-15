require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./src/app');
const { seedAdmin } = require('./src/utils/seedAdmin');

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/dsdl_recruitment';

async function startServer() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log('✅ Connected to MongoDB successfully.');

    // Seed secure admin account from environment variables
    await seedAdmin();

    app.listen(PORT, () => {
      console.log(`🚀 DSDL Recruitment Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ CRITICAL DATABASE ERROR: Failed to connect to MongoDB.');
    console.error(`Details: ${error.message}`);
    console.error('The server will not start without a persistent MongoDB connection.');
    process.exit(1);
  }
}

startServer();
