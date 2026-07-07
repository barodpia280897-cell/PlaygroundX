import { useState, useEffect } from 'react';

/**
 * useSimulatedLoading
 * Simulates a network fetch delay for UI skeleton testing.
 * @param {number} delayMs - Minimum time to simulate loading (default: 800ms)
 * @param {Array} deps - Dependency array to re-trigger loading (e.g. changing tabs)
 * @returns {boolean} isLoading
 */
export function useSimulatedLoading(delayMs = 800, deps = []) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, delayMs + Math.random() * 400); // add slight randomness for realism

    return () => clearTimeout(timer);
  }, deps);

  return isLoading;
}
