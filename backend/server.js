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
      serverSelectionTimeoutMS: 10000
    });
    console.log('✅ Connected to MongoDB successfully.');

    // Monitor connection health
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected. Mongoose will attempt to reconnect automatically.');
    });
    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected successfully.');
    });
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err.message);
    });
  } catch (error) {
    console.error('❌ DATABASE CONNECTION ERROR:', error.message);
    console.error('The server will not start without a database connection.');
    process.exit(1);
  }

  try {
    // Seed secure admin account from environment variables (only if connected)
    if (mongoose.connection.readyState === 1) {
      await seedAdmin();
    } else {
      console.warn('Skipping admin seeding because database is not connected.');
    }

    // Start server with port-fallback logic to avoid crashes when a port is unavailable
    const maxPortAttempts = 5;
    let attempt = 0;
    let listenPort = Number(PORT) || 5000;

    const startListening = (port) => {
      const server = app.listen(port, () => {
        console.log(`🚀 KML Recruitment Server running on http://localhost:${port}`);
      });

      server.on('error', (err) => {
        if (err && (err.code === 'EADDRINUSE' || err.code === 'EPERM')) {
          console.warn(`Port ${port} unavailable (${err.code}). Trying next port...`);
          attempt += 1;
          if (attempt <= maxPortAttempts) {
            startListening(port + 1);
          } else {
            console.error('Failed to bind server to any port after multiple attempts.');
            process.exit(1);
          }
        } else {
          console.error('Server listen error:', err);
          process.exit(1);
        }
      });
    };

    startListening(listenPort);
  } catch (err) {
    console.error('❌ Server startup error:', err.message);
    process.exit(1);
  }
}

startServer();
