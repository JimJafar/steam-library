export default function secondsToHoursAndMinutes(seconds: number): string {
  const wholeHours = Math.floor(seconds / 60 / 60);
  const remainingSeconds = seconds - wholeHours * 60 * 60;
  const minutes = Math.round(remainingSeconds / 60);

  return `${wholeHours}:${minutes}`;
}
