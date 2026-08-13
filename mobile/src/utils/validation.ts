const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Shared client-side validation for the auth forms
export const isValidEmail = (value: string): boolean => EMAIL_REGEX.test(value);
