/**
 * Date and Time utilities for Inspire Business Academy
 * Enforces Asia/Karachi timezone display across all student and admin interfaces
 */

export const KARACHI_TIMEZONE = 'Asia/Karachi';

export function getKarachiTodayString(): string {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: KARACHI_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return formatter.format(now); // e.g. "2026-10-19"
}

export function formatKarachiDateTime(dateInput: string | Date | number): string {
  if (!dateInput) return '';
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(new Date(date).getTime())) return String(dateInput);

  return new Intl.DateTimeFormat('en-PK', {
    timeZone: KARACHI_TIMEZONE,
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(date)) + ' PKT';
}

export function formatKarachiDate(dateInput: string | Date | number): string {
  if (!dateInput) return '';
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(new Date(date).getTime())) return String(dateInput);

  return new Intl.DateTimeFormat('en-PK', {
    timeZone: KARACHI_TIMEZONE,
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
}

export function getRelativeTimeString(dateInput: string | Date | number): string {
  if (!dateInput) return '';
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  const time = new Date(date).getTime();
  if (isNaN(time)) return '';

  const now = Date.now();
  const diffInSeconds = Math.floor((now - time) / 1000);

  if (diffInSeconds < 60) return 'just now';
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays}d ago`;
  return formatKarachiDate(date);
}
