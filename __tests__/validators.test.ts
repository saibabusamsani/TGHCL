import {validateMobileNumber} from '../src/utils/validators'; 

describe('validateMobileNumber', () => {
  it('returns error when mobile number is empty', () => {
    expect(validateMobileNumber('')).toBe('Mobile number is required');
  });

  it('returns error when mobile number is only whitespace', () => {
    expect(validateMobileNumber('   ')).toBe('Mobile number is required');
  });

  it('returns error for less than 10 digits', () => {
    expect(validateMobileNumber('98765432')).toBe('Enter a valid 10-digit mobile number');
  });

  it('returns error for more than 10 digits', () => {
    expect(validateMobileNumber('987654321012')).toBe('Enter a valid 10-digit mobile number');
  });

  it('returns error when number contains letters', () => {
    expect(validateMobileNumber('98765abcde')).toBe('Enter a valid 10-digit mobile number');
  });

  it('returns error when first digit is not 6-9', () => {
    expect(validateMobileNumber('5234567890')).toBe('Enter a valid 10-digit mobile number');
  });

  it('returns undefined for a valid number starting with 6', () => {
    expect(validateMobileNumber('6234567890')).toBeUndefined();
  });

  it('returns undefined for a valid number starting with 9', () => {
    expect(validateMobileNumber('9876543210')).toBeUndefined();
  });

  it('trims leading/trailing spaces before validating', () => {
    expect(validateMobileNumber('  9876543210  ')).toBeUndefined();
  });
});
