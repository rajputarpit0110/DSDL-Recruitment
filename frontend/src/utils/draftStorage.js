import { RECRUITMENT_YEAR } from '../config/recruitmentConfig';

const DRAFT_KEY = 'dsdl_registration_draft';
const EXPIRATION_MS = 48 * 60 * 60 * 1000; // 48 hours

export function saveDraft(data) {
  try {
    const payload = {
      version: 1,
      recruitmentYear: RECRUITMENT_YEAR,
      savedAt: new Date().toISOString(),
      data
    };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(payload));
  } catch (err) {
    console.warn('Failed to save draft to localStorage:', err);
  }
}

export function loadDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);

    // Validate schema version & recruitment year
    if (parsed.version !== 1 || parsed.recruitmentYear !== RECRUITMENT_YEAR) {
      clearDraft();
      return null;
    }

    // Validate expiration
    const savedTime = new Date(parsed.savedAt).getTime();
    if (isNaN(savedTime) || (Date.now() - savedTime) > EXPIRATION_MS) {
      clearDraft();
      return null;
    }

    return parsed.data || null;
  } catch (err) {
    clearDraft();
    return null;
  }
}

export function clearDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch (err) {
    // Ignore storage clear errors
  }
}
