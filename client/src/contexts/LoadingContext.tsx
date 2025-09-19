import { createContext, useContext, useState, ReactNode, useCallback, useRef, useEffect } from 'react';

type LoadingContextType = {
  isLoading: boolean;
  progress: number;
  startLoading: () => void;
  stopLoading: () => void;
  setProgress: (progress: number) => void;
};

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

const MAX_LOADING_TIME = 5000; // 5 seconds max
const LOADING_STEP = 50; // ms between progress updates

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const startTime = useRef<number>(Date.now());
  const progressInterval = useRef<NodeJS.Timeout>();
  const maxTimeout = useRef<NodeJS.Timeout>();

  const stopLoading = useCallback(() => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = undefined;
    }
    if (maxTimeout.current) {
      clearTimeout(maxTimeout.current);
      maxTimeout.current = undefined;
    }
    setProgress(100);
    // Small delay to ensure smooth transition
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  }, []);

  const startLoading = useCallback(() => {
    // Clear any existing timeouts/intervals
    if (progressInterval.current) clearInterval(progressInterval.current);
    if (maxTimeout.current) clearTimeout(maxTimeout.current);

    startTime.current = Date.now();
    setProgress(0);
    setIsLoading(true);

    // Set maximum loading time
    maxTimeout.current = setTimeout(() => {
      stopLoading();
    }, MAX_LOADING_TIME);

    // Update progress more smoothly
    progressInterval.current = setInterval(() => {
      const elapsed = Date.now() - startTime.current;
      const newProgress = Math.min((elapsed / MAX_LOADING_TIME) * 100, 95); // Cap at 95% until fully loaded
      setProgress(newProgress);
    }, LOADING_STEP);
  }, [stopLoading]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current);
      if (maxTimeout.current) clearTimeout(maxTimeout.current);
    };
  }, []);

  const setProgressManually = useCallback((newProgress: number) => {
    setProgress(Math.min(Math.max(0, newProgress), 100));
  }, []);

  return (
    <LoadingContext.Provider 
      value={{ 
        isLoading, 
        progress, 
        startLoading, 
        stopLoading, 
        setProgress: setProgressManually
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}
