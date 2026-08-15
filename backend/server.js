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
  } catch (error) {
    console.error('❌ DATABASE CONNECTION ERROR:', error.message);

    // In non-production environments, try an in-memory MongoDB fallback
    let dbConnected = false;
    if (process.env.NODE_ENV !== 'production') {
      try {
        console.log('Attempting to start in-memory MongoDB for development...');
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongod = await MongoMemoryServer.create();
        const memoryUri = mongod.getUri();
        await mongoose.connect(memoryUri);
        console.log('✅ Connected to in-memory MongoDB.');
        dbConnected = true;
      } catch (memErr) {
        console.error('❌ Failed to start in-memory MongoDB fallback:', memErr.message);
        console.warn('Continuing without a database connection (development only).');
        dbConnected = false;
      }
    } else {
      console.error('The server will not start without a persistent MongoDB connection.');
      process.exit(1);
    }
    // If not connected to any DB, continue in dev mode but skip DB-dependent startup tasks
    if (!dbConnected) {
      console.warn('Starting server without database. Some features will be disabled.');
    }
  }

  try {
    // Seed secure admin account from environment variables (only if connected)
    if (mongoose.connection.readyState === 1) {
      await seedAdmin();
    } else {
      console.warn('Skipping admin seeding because database is not connected.');
    }

    app.listen(PORT, () => {
      console.log(`🚀 DSDL Recruitment Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Server startup error:', err.message);
    process.exit(1);
  }
}

startServer();
