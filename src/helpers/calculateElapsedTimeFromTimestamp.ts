interface IReturnTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const SECONDS_IN_DAY = 3600 * 24;
const SECONDS_IN_HOUR = 3600;
const SECONDS_IN_MINUTE = 60;

export const calculateElapsedTimeFromTimestamp = (
  timestampSeconds: number,
): IReturnTime => {
  const currentTime = Math.floor(Date.now() / 1000);
  const elapsedSeconds = currentTime - timestampSeconds;

  const days = Math.floor(elapsedSeconds / SECONDS_IN_DAY);
  const hours = Math.floor((elapsedSeconds % SECONDS_IN_DAY) / SECONDS_IN_HOUR);
  const minutes = Math.floor((elapsedSeconds % SECONDS_IN_HOUR) / SECONDS_IN_MINUTE);
  const seconds = elapsedSeconds % 60;

  return {
    days,
    hours,
    minutes,
    seconds,
  };
};
