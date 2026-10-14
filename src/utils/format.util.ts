export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(0)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
};

export const formatDuration = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
};

export const toTitleCase = (value = ''): string =>
  value.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());

export const getDisplayName = (fullName = ''): string =>
  toTitleCase(fullName.trim().split(/\s+/).pop() ?? fullName);

export const maskMobile = (mobile = ''): string =>
  mobile.length >= 4 ? `XXXXXX${mobile.slice(-4)}` : '—';


export const getInitials = (name = ''): string => {
  const words = name.trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) return '';
  if (words.length === 1) return words[0][0].toUpperCase();

  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
};

export const formatINR = (value: number): string => `₹${Math.round(value).toLocaleString('en-IN')}`;

export const formatAmountInput = (text: string): string => {
  const digits = text.replace(/\D/g, '').replace(/^0+(?=\d)/, '');
  return digits.replace(/\B(?=(\d{2})+\d(?!\d))/g, ',');
};
 
