import { describe, it, expect, vi } from 'vitest';
import {
  getCountryTranslationKey,
  getCountryOptions,
} from '../countryHelpers';

describe('countryHelpers', () => {
  describe('getCountryTranslationKey', () => {
    it('should return translation key for known countries', () => {
      expect(getCountryTranslationKey('Ukraine')).toBe('countries.ukraine');
      expect(getCountryTranslationKey('Poland')).toBe('countries.poland');
      expect(getCountryTranslationKey('Italy')).toBe('countries.italy');
      expect(getCountryTranslationKey('Spain')).toBe('countries.spain');
      expect(getCountryTranslationKey('Egypt')).toBe('countries.egypt');
      expect(getCountryTranslationKey('Turkey')).toBe('countries.turkey');
      expect(getCountryTranslationKey('France')).toBe('countries.france');
      expect(getCountryTranslationKey('Germany')).toBe('countries.germany');
      expect(getCountryTranslationKey('Greece')).toBe('countries.greece');
      expect(getCountryTranslationKey('Tunisia')).toBe('countries.tunisia');
    });

    it('should return original string for unknown countries', () => {
      expect(getCountryTranslationKey('UnknownCountry')).toBe('UnknownCountry');
      expect(getCountryTranslationKey('USA')).toBe('USA');
      expect(getCountryTranslationKey('')).toBe('');
    });

    it('should handle case-sensitive country names', () => {
      expect(getCountryTranslationKey('ukraine')).toBe('ukraine'); // lowercase
      expect(getCountryTranslationKey('UKRAINE')).toBe('UKRAINE'); // uppercase
      expect(getCountryTranslationKey('Ukraine')).toBe('countries.ukraine'); // correct case
    });
  });

  describe('getCountryOptions', () => {
    it('should return array of country options', () => {
      const mockT = vi.fn((key: string) => key);
      const options = getCountryOptions(mockT);

      expect(Array.isArray(options)).toBe(true);
      expect(options.length).toBeGreaterThan(0);
    });

    it('should call translation function for each country', () => {
      const mockT = vi.fn((key: string) => key);
      getCountryOptions(mockT);

      expect(mockT).toHaveBeenCalled();
      expect(mockT).toHaveBeenCalledWith('countries.ukraine');
      expect(mockT).toHaveBeenCalledWith('countries.poland');
    });

    it('should return options with correct structure', () => {
      const mockT = vi.fn((key: string) => `Translated: ${key}`);
      const options = getCountryOptions(mockT);

      expect(options[0]).toHaveProperty('value');
      expect(options[0]).toHaveProperty('label');
      expect(options[0].value).toBe('Ukraine');
      expect(options[0].label).toBe('Translated: countries.ukraine');
    });

    it('should include all expected countries', () => {
      const mockT = vi.fn((key: string) => key);
      const options = getCountryOptions(mockT);

      const countryValues = options.map(opt => opt.value);
      expect(countryValues).toContain('Ukraine');
      expect(countryValues).toContain('Poland');
      expect(countryValues).toContain('Italy');
      expect(countryValues).toContain('Spain');
      expect(countryValues).toContain('Egypt');
      expect(countryValues).toContain('Turkey');
      expect(countryValues).toContain('France');
      expect(countryValues).toContain('Germany');
      expect(countryValues).toContain('Greece');
      expect(countryValues).toContain('Tunisia');
    });
  });
});

