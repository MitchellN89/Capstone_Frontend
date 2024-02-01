import dayjs from "dayjs";

// below are all the functions which test input values to determine if they are valid or not.
// the majority are functions which are passed into patterns props (within an array)
// some required initial dynamic values that may depend on the current state of other inputs.
// these functions return functions which test the validation.

// functions return an object that contain isValid bool, a key for future implementation (where error messages can be stacked and mapped) and a message for the error message to display

// as an example
export function validationMatch(valueToMatch, faultMessage) {
  // validationMatch expects a value to match and a fault message.
  // it returns a function
  return function (value) {
    // object is created below and isValid is set to the result of valueToMatch == value (which is always passed in on these functions when being tested)
    // if the values match, isValid is true, if not, false and an error message will be displayed underneath the input
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

export function validationDateIsValid(value) {
  const result = {
    isValid: dayjs(value).isValid(),
    key: `valid_date`,
    faultMessage: "Must be a valid date",
  };

  return result;
}

export function validationDateAfterNow(value) {
  const result = {
    isValid: dayjs(value).isAfter(dayjs()),
    key: `valid_afterNow`,
    faultMessage: "Must be a date that occurs after the current time",
  };

  return result;
}

export function validationDateAfterValue(valueToExceed) {
  return function (value) {
    const result = {
      isValid: dayjs(value).isAfter(valueToExceed),
      key: `valid_afterValue`,
      faultMessage: `Must be a date that occurs after ${dayjs(
        valueToExceed
      ).format("DD MMM YYYY, HH:mm")}`,
    };

    return result;
  };
}
