/**
 * Generates a unique ID for users
 * Format: SC-YYYYMMDD-XXXX (SC = Smart Checkin)
 */
export const generateUniqueId = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  
  // Generate random 4-digit number
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  
  return `SC-${year}${month}${day}-${randomNum}`;
};

/**
 * Validates if a given ID follows the correct format
 */
export const validateUserId = (userId) => {
  const regex = /^SC-\d{8}-\d{4}$/;
  return regex.test(userId);
};

/**
 * Generates a short numeric ID (alternative format)
 */
export const generateShortId = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Generates UUID-like unique ID
 */
export const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};
