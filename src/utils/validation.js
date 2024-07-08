const validateRegistration = (data) => {
    const errors = [];
  
    if (!data.firstName) {
      errors.push({ field: 'firstName', message: 'First name is required' });
    }
  
    if (!data.lastName) {
      errors.push({ field: 'lastName', message: 'Last name is required' });
    }
  
    if (!data.email) {
      errors.push({ field: 'email', message: 'Email is required' });
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errors.push({ field: 'email', message: 'Email is invalid' });
    }
  
    if (!data.password) {
      errors.push({ field: 'password', message: 'Password is required' });
    } else if (data.password.length < 6) {
      errors.push({ field: 'password', message: 'Password must be at least 6 characters' });
    }
  
    return {
      errors,
      isValid: errors.length === 0,
    };
  };
  
  const validateLogin = (data) => {
    const errors = [];
  
    if (!data.email) {
      errors.push({ field: 'email', message: 'Email is required' });
    }
  
    if (!data.password) {
      errors.push({ field: 'password', message: 'Password is required' });
    }
  
    return {
      errors,
      isValid: errors.length === 0,
    };
  };
  
  module.exports = {
    validateRegistration,
    validateLogin,
  };