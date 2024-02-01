import dayjs from "dayjs";

// converts formData to js object
export function convertFormDataToObject(formData) {
  const obj = {};
  formData.forEach((val, key) => {
    val = val === "" ? null : val;
    obj[key] = val;
  });
  return obj;
}

// iterates over the keys of a given object, when an object key is found to match keyContains, the value is extracted and converted to a new format using dayjs
export function convertDatesToValid(object, keyContains, fromFormat, toFormat) {
  const formattedDates = {};
  Object.keys(object).forEach((key) => {
    if (key.includes(keyContains) && object[key]) {
      const parsedDate = dayjs(object[key], { format: fromFormat });
      const formattedDate = parsedDate.format(toFormat);
      formattedDates[key] = formattedDate;
    }
  });

  return { ...object, ...formattedDates };
}
