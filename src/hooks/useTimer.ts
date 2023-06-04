import { useCallback, useEffect, useState } from 'react';

export interface IUseSecondsTimer {
  seconds: number;
  isFinished: boolean;
  restart: (newTime?: number) => void;
}

const defaultTimer = 59;
const milliseconds = 1000;

export const useTimer = (time: number = defaultTimer): IUseSecondsTimer => {
  const [seconds, setCounter] = useState<number>(time);

  const restart = useCallback(
    (newTime?: number) => {
      setCounter(newTime || time);
    },
    [time],
  );

  useEffect(() => {
    setCounter(time);
  }, [time]);

  useEffect(() => {
    if (seconds <= 0) {
      return;
    }

    const end = Date.now() + seconds * milliseconds;
    const timer = setInterval(
      () => setCounter(Math.round((end - Date.now()) / milliseconds)),
      milliseconds,
    );

    return () => clearInterval(timer);
  }, [seconds]);

  const isFinished = seconds <= 0;

  return { seconds, isFinished, restart };
};
