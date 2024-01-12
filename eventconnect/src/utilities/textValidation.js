export function validationMatch(valueToMatch, faultMessage) {
  return function (value) {
    const result = {
      isValid: valueToMatch == value,
      key: `valid_match_${valueToMatch}`,
      faultMessage,
    };

    return result;
  };
}

export function validationOnlyName(value) {
  const exp = /^[a-zA-Z\s']+$/;
  const result = {
    isValid: exp.test(value),
    key: `valid_name`,
    faultMessage: "Only letters, spaces and apostrophes allowed",
  };

  return result;
}

export function validationOnlyPhoneNumber(value) {
  const exp = /^(\d|\-|#|ext|\+| )+$/;
  const result = {
    isValid: exp.test(value),
    key: `valid_phoneNumber`,
    faultMessage: "Only numbers, dashes, hashes, pluses and 'ext' allowed",
  };

  return result;
}

export function validationOnlyEmailAddress(value) {
  const exp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const result = {
    isValid: exp.test(value),
    key: `valid_emailAddress`,
    faultMessage: "Only valid email addresses allowed",
  };

  return result;
}

export function validationAtLeastOneSpecial(value) {
  const exp = /[!@#$%^&*()_+={}[\]:;<>,.?~\\/-]/;
  const result = {
    isValid: exp.test(value),
    key: `valid_oneSpecial`,
    faultMessage: "Must contain at least one special character",
  };

  return result;
}

export function validationAtLeastOneLowerCase(value) {
  const exp = /.*[a-z].*/;
  const result = {
    isValid: exp.test(value),
    key: `valid_oneLower`,
    faultMessage: "Must contain at least one lowercase letter",
  };

  return result;
}

export function validationAtLeastOneUpperCase(value) {
  const exp = /.*[A-Z].*/;
  const result = {
    isValid: exp.test(value),
    key: `valid_oneUpper`,
    faultMessage: "Must contain at least one uppercase letter",
  };

  return result;
}

export function validationAtLeastOneNumber(value) {
  const exp = /.*\d.*/;
  const result = {
    isValid: exp.test(value),
    key: `valid_oneUpper`,
    faultMessage: "Must contain at least one number",
  };

  return result;
}
