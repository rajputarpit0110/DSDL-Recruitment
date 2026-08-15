const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');

async function seedAdmin() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !password) {
    const errorMsg = 'CRITICAL: ADMIN_USERNAME or ADMIN_PASSWORD environment variables are missing!';
    if (process.env.NODE_ENV === 'production') {
      console.error(' [SECURITY ERROR]', errorMsg);
      process.exit(1);
    } else {
      console.warn('⚠️ [CONFIG WARNING]', errorMsg);
      console.warn('Admin login will not function until ADMIN_USERNAME and ADMIN_PASSWORD are defined in .env');
      return;
    }
  }

  try {
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    await Admin.findOneAndUpdate(
      { username: username.toLowerCase() },
      { username: username.toLowerCase(), passwordHash },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log(`🔒 Secure Admin account initialized for username: "${username}"`);
  } catch (error) {
    console.error('Failed to seed admin account:', error.message);
  }
}

module.exports = { seedAdmin };
