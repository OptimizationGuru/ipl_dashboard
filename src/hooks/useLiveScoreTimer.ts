import { useState, useEffect } from 'react';

interface UseLiveScoreTimerProps {
  isLive: boolean;
  initialDelay?: number;
}

export function useLiveScoreTimer({ isLive, initialDelay = 30 }: UseLiveScoreTimerProps) {
  const [countdown, setCountdown] = useState(initialDelay);
  const [nextUpdateIn, setNextUpdateIn] = useState(initialDelay);

  const updateTimer = (newDelay: number) => {
    // Validate delay is a positive number
    const validDelay = Math.max(1, Math.floor(newDelay));
    setNextUpdateIn(validDelay);
    setCountdown(validDelay);
  };

  const resetTimer = () => {
    setCountdown(initialDelay);
    setNextUpdateIn(initialDelay);
  };

  const stopTimer = () => {
    setCountdown(0);
  };

  // Countdown effect
  useEffect(() => {
    if (!isLive || countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown(prev => prev <= 1 ? 0 : prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, isLive]);

  // Stop timer when match is not live
  useEffect(() => {
    if (!isLive) {
      stopTimer();
    }
  }, [isLive]);

  return {
    countdown,
    nextUpdateIn,
    updateTimer,
    resetTimer,
    stopTimer,
  };
}
