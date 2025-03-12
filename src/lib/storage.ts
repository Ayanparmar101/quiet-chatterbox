
// Keys used for localStorage
export const STORAGE_KEYS = {
  MESSAGES: 'whatsapp_messages',
  USER_ID: 'whatsapp_user_id'
};

// Store data in localStorage
export const storeData = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error storing data for key '${key}':`, error);
  }
};

// Retrieve data from localStorage
export const retrieveData = <T>(key: string, defaultValue: T): T => {
  try {
    const storedData = localStorage.getItem(key);
    return storedData ? JSON.parse(storedData) : defaultValue;
  } catch (error) {
    console.error(`Error retrieving data for key '${key}':`, error);
    return defaultValue;
  }
};

// Generate a random user ID if none exists
export const getUserId = (): string => {
  let userId = retrieveData<string>(STORAGE_KEYS.USER_ID, '');
  
  if (!userId) {
    userId = `user_${Math.random().toString(36).substring(2, 10)}`;
    storeData(STORAGE_KEYS.USER_ID, userId);
  }
  
  return userId;
};
