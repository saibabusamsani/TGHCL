const pad = (n: number) => String(n).padStart(2, '0');

const MONTH_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

/**
 * "17-09-2026"
 */
export const formatDate = (isoString: string): string => {
  const date = new Date(isoString);
  return `${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()}`;
};

/**
 * "17 Sep 2026"
 */
export const formatDateShort = (isoString: string): string => {
  const date = new Date(isoString);
  return `${date.getDate()} ${MONTH_SHORT[date.getMonth()]} ${date.getFullYear()}`;
};

/**
 * "02:45 PM"
 */
export const formatTime = (isoString: string): string => {
  const date = new Date(isoString);
  let hours = date.getHours();
  const minutes = pad(date.getMinutes());
  const period = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${pad(hours)}:${minutes} ${period}`;
};

/**
 * "17-09-2026, 02:45 PM"
 */
export const formatDateAndTime = (isoString: string): string => {
  return `${formatDate(isoString)}, ${formatTime(isoString)}`;
};

/**
 * "17 Sep 2026, 02:45 PM"
 */
export const formatDateShortAndTime = (isoString: string): string => {
  return `${formatDateShort(isoString)}, ${formatTime(isoString)}`;
};