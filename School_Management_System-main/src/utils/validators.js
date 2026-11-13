export const validators = {
  isEmail: (email) => {
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return regex.test(email);
  },

  isPhone: (phone) => {
    const regex = /^\+?[1-9]\d{1,14}$/;
    return regex.test(phone);
  },

  isPassword: (password) => {
    return (
      password.length >= 6 && /[a-zA-Z]/.test(password) && /\d/.test(password)
    );
  },

  isURL: (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  isDate: (date) => {
    return !isNaN(new Date(date).getTime());
  },

  isNumber: (value) => {
    return !isNaN(parseFloat(value)) && isFinite(value);
  },

  isEmpty: (value) => {
    return !value || value.toString().trim() === '';
  },

  isLength: (value, min, max) => {
    const length = value.toString().length;
    return length >= min && length <= max;
  },

  isInRange: (value, min, max) => {
    const num = parseFloat(value);
    return num >= min && num <= max;
  },
};

export const validateForm = (data, rules) => {
  const errors = {};

  for (const [field, fieldRules] of Object.entries(rules)) {
    const value = data[field];

    for (const rule of fieldRules) {
      const [ruleName, ...params] = rule.split(':');

      switch (ruleName) {
        case 'required':
          if (validators.isEmpty(value)) {
            errors[field] = `${field} is required`;
          }
          break;
        case 'email':
          if (!validators.isEmpty(value) && !validators.isEmail(value)) {
            errors[field] = 'Please provide a valid email';
          }
          break;
        case 'phone':
          if (!validators.isEmpty(value) && !validators.isPhone(value)) {
            errors[field] = 'Please provide a valid phone number';
          }
          break;
        case 'min':
          if (!validators.isEmpty(value) && value.length < parseInt(params[0])) {
            errors[field] = `${field} must be at least ${params[0]} characters`;
          }
          break;
        case 'max':
          if (!validators.isEmpty(value) && value.length > parseInt(params[0])) {
            errors[field] = `${field} must be at most ${params[0]} characters`;
          }
          break;
        case 'number':
          if (!validators.isEmpty(value) && !validators.isNumber(value)) {
            errors[field] = `${field} must be a number`;
          }
          break;
        default:
          break;
      }
    }
  }

  return errors;
};

export default validators;