import { describe, it, expect } from 'vitest';
import {
  dateToISOString,
  stringToDate,
  formatDateForInput,
  formatDateForDisplay,
  isValidDate,
  isValidDateString,
} from '../dateHelpers';

describe('dateHelpers', () => {
  describe('dateToISOString', () => {
    it('should convert Date to ISO string', () => {
      const date = new Date('2024-01-15T10:30:00Z');
      const result = dateToISOString(date);
      expect(result).toBe(date.toISOString());
    });

    it('should handle different dates correctly', () => {
      const date = new Date('2023-12-25T00:00:00Z');
      const result = dateToISOString(date);
      expect(result).toContain('2023-12-25');
    });
  });

  describe('stringToDate', () => {
    it('should convert valid date string to Date', () => {
      const dateString = '2024-01-15T10:30:00Z';
      const result = stringToDate(dateString);
      expect(result).toBeInstanceOf(Date);
      expect(result.getTime()).toBe(new Date(dateString).getTime());
    });

    it('should handle ISO date strings', () => {
      const dateString = '2024-06-20T14:30:00.000Z';
      const result = stringToDate(dateString);
      expect(result).toBeInstanceOf(Date);
    });
  });

  describe('formatDateForInput', () => {
    it('should format date string for input field', () => {
      const dateString = '2024-01-15T10:30:00Z';
      const result = formatDateForInput(dateString);
      expect(result).toBe('2024-01-15');
    });

    it('should extract date part from ISO string', () => {
      const dateString = '2024-12-25T23:59:59.999Z';
      const result = formatDateForInput(dateString);
      expect(result).toBe('2024-12-25');
    });
  });

  describe('formatDateForDisplay', () => {
    it('should format date string for display with default locale', () => {
      const dateString = '2024-01-15T10:30:00Z';
      const result = formatDateForDisplay(dateString);
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    it('should format date string for display with custom locale', () => {
      const dateString = '2024-01-15T10:30:00Z';
      const result = formatDateForDisplay(dateString, 'uk-UA');
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    it('should handle different date formats', () => {
      const dateString = '2024-06-20T14:30:00.000Z';
      const result = formatDateForDisplay(dateString);
      expect(result).toContain('2024');
    });
  });

  describe('isValidDate', () => {
    it('should return true for valid Date object', () => {
      const date = new Date('2024-01-15T10:30:00Z');
      expect(isValidDate(date)).toBe(true);
    });

    it('should return false for invalid Date object', () => {
      const date = new Date('invalid-date');
      expect(isValidDate(date)).toBe(false);
    });

    it('should return false for non-Date values', () => {
      expect(isValidDate('2024-01-15')).toBe(false);
      expect(isValidDate(123456)).toBe(false);
      expect(isValidDate(null)).toBe(false);
      expect(isValidDate(undefined)).toBe(false);
      expect(isValidDate({})).toBe(false);
    });
  });

  describe('isValidDateString', () => {
    it('should return true for valid date string', () => {
      expect(isValidDateString('2024-01-15T10:30:00Z')).toBe(true);
      expect(isValidDateString('2024-06-20')).toBe(true);
    });

    it('should return false for invalid date string', () => {
      expect(isValidDateString('invalid-date')).toBe(false);
      expect(isValidDateString('not-a-date')).toBe(false);
      expect(isValidDateString('')).toBe(false);
    });

    it('should handle edge cases', () => {
      expect(isValidDateString('2024-13-45')).toBe(false); // Invalid month/day
      expect(isValidDateString('2024-02-30')).toBe(false); // Invalid date
    });
  });
});

