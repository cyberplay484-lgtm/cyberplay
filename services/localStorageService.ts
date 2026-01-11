
/**
 * A utility service for interacting with browser's Local Storage.
 */
class LocalStorageService {
  /**
   * Saves an item to local storage.
   * @param key The key under which to store the item.
   * @param value The value to store. Objects will be stringified.
   */
  saveItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving item to local storage with key "${key}":`, error);
    }
  }

  /**
   * Retrieves an item from local storage.
   * @param key The key of the item to retrieve.
   * @returns The parsed value, or null if not found or an error occurs.
   */
  getItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error retrieving item from local storage with key "${key}":`, error);
      return null;
    }
  }

  /**
   * Removes an item from local storage.
   * @param key The key of the item to remove.
   */
  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item from local storage with key "${key}":`, error);
    }
  }
}

export const localStorageService = new LocalStorageService();
