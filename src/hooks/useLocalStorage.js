import { useState, useEffect } from 'react';

// Works like useState, but saves the value in the browser so it survives a refresh.
export default function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage unavailable: the app still works, it just won't save */
    }
  }, [key, value]);

  return [value, setValue];
}
