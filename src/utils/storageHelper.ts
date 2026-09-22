import AsyncStorage from '@react-native-async-storage/async-storage';

export const storageHelper = {
  get: async <T>(key: string): Promise<T | null> => {
    const value = await AsyncStorage.getItem(key);

    if (value === null) {
      return null;
    }

    return JSON.parse(value) as T;
  },

 multiGet: async <T extends unknown[]>(keys: string[]): Promise<T> => {
  const values = await AsyncStorage.getMany(keys);

  const result = keys.map(key => {
    const raw = values[key];

    return raw ? JSON.parse(raw) : null;
  });

  return result as unknown as T;
},
  multiSet: async (values: Record<string, unknown>,): Promise<void> => {
    const entries: Record<string, string> = {};

    Object.entries(values).forEach(([key, value]) => {
      entries[key] = JSON.stringify(value);
    });

    await AsyncStorage.setMany(entries);
  },

  set: async <T>(key: string, value: T): Promise<void> => {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  },

  remove: async (key: string): Promise<void> => {
    await AsyncStorage.removeItem(key);
  },

  clear: async (): Promise<void> => {
    await AsyncStorage.clear();
  },

  has: async (key: string): Promise<boolean> => {
    return (await AsyncStorage.getItem(key)) !== null;
  },
};