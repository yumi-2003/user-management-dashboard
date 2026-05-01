const FALLBACK_DATE_VALUE = "-";

const validedDate = (value?: string): Date | null => {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const formatDate = (value?: string): string => {
  const date = validedDate(value);
  return date ? date.toLocaleDateString() : FALLBACK_DATE_VALUE;
};

export const formatDateTime = (value?: string): string => {
  const date = validedDate(value);
  return date ? date.toLocaleString() : FALLBACK_DATE_VALUE;
};
