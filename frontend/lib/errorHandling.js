// Utility function to get user-friendly error messages from Clerk errors
export const getClerkErrorMessage = (error) => {
  // Check if it's a Clerk error with errors array
  if (error?.errors && Array.isArray(error.errors) && error.errors.length > 0) {
    const firstError = error.errors[0];
    const errorCode = firstError.code;
    const errorMessage = firstError.message;

    // Map common Clerk error codes to user-friendly messages
    switch (errorCode) {
      // Sign-up errors
      case 'form_identifier_exists':
        return 'This email address is already registered. Please try signing in instead.';
      case 'form_password_pwned':
        return 'This password has been found in a data breach. Please choose a different password.';
      case 'form_password_length_too_short':
        return 'Password must be at least 8 characters long.';
      case 'form_password_validation_failed':
        return 'Password must contain at least one uppercase letter, one lowercase letter, and one number.';
      case 'form_identifier_invalid':
        return 'Please enter a valid email address.';
      case 'form_code_incorrect':
        return 'The verification code is incorrect. Please check and try again.';
      case 'verification_expired':
        return 'The verification code has expired. Please request a new one.';
      case 'verification_failed':
        return 'Verification failed. Please try again.';
      
      // Sign-in errors
      case 'form_password_incorrect':
        return 'Incorrect password. Please try again.';
      case 'form_identifier_not_found':
        return 'No account found with this email address. Please check your email or sign up.';
      case 'form_password_size_in_bytes_exceeded':
        return 'Password is too long. Please use a shorter password.';
      case 'too_many_requests':
        return 'Too many failed attempts. Please wait a few minutes before trying again.';
      case 'session_exists':
        return 'You are already signed in.';
      
      // Network and general errors
      case 'network_error':
        return 'Network error. Please check your internet connection and try again.';
      case 'clerk_error':
        return 'Authentication service error. Please try again later.';
      
      // Rate limiting
      case 'rate_limit_exceeded':
        return 'Too many requests. Please wait a moment before trying again.';
      
      // Account related
      case 'account_not_found':
        return 'Account not found. Please check your credentials or sign up.';
      case 'account_suspended':
        return 'This account has been suspended. Please contact support.';
      
      // Email verification
      case 'email_address_not_verified':
        return 'Please verify your email address before signing in.';
      case 'email_address_verification_failed':
        return 'Email verification failed. Please try again.';
      
      // Generic fallback with original message if available
      default:
        return errorMessage || 'An unexpected error occurred. Please try again.';
    }
  }

  // Handle network errors
  if (error?.name === 'NetworkError' || error?.message?.includes('network')) {
    return 'Network error. Please check your internet connection and try again.';
  }

  // Handle timeout errors
  if (error?.name === 'TimeoutError' || error?.message?.includes('timeout')) {
    return 'Request timed out. Please try again.';
  }

  // Generic fallback
  return error?.message || 'An unexpected error occurred. Please try again.';
};

// Input validation functions
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !email.trim()) {
    return "Email address is required.";
  }
  if (!emailRegex.test(email)) {
    return "Please enter a valid email address.";
  }
  return null;
};

export const validatePassword = (password) => {
  if (!password || !password.trim()) {
    return "Password is required.";
  }
  if (password.length < 8) {
    return "Password must be at least 8 characters long.";
  }
  if (!/(?=.*[a-z])/.test(password)) {
    return "Password must contain at least one lowercase letter.";
  }
  if (!/(?=.*[A-Z])/.test(password)) {
    return "Password must contain at least one uppercase letter.";
  }
  if (!/(?=.*\d)/.test(password)) {
    return "Password must contain at least one number.";
  }
  return null;
};

export const validateVerificationCode = (code) => {
  if (!code || !code.trim()) {
    return "Verification code is required.";
  }
  if (code.length !== 6) {
    return "Verification code must be 6 digits.";
  }
  if (!/^\d+$/.test(code)) {
    return "Verification code must contain only numbers.";
  }
  return null;
};
