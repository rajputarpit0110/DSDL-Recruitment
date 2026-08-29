const crypto = require('crypto');
const { RECRUITMENT_YEAR } = require('../config/recruitmentConfig');

const CHARS = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // Exclude easily confused chars (0, O, 1, I)

/**
 * Generates a cryptographically secure, non-predictable Registration ID.
 * Example: KML-2026-K9X7P2
 */
function generateRegistrationId() {
  const bytes = crypto.randomBytes(6);
  let randomCode = '';
  for (let i = 0; i < 6; i++) {
    randomCode += CHARS[bytes[i] % CHARS.length];
  }
  return `KML-${RECRUITMENT_YEAR}-${randomCode}`;
}

module.exports = { generateRegistrationId };
