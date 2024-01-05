import dayjs from "dayjs";

export function convertFormDataToObject(formData) {
  const obj = {};
  formData.forEach((val, key) => {
    obj[key] = val;
  });
  console.log("formData.js > convertFromDataToObject: ", obj);
  return obj;
}

export function convertDatesToValid(object, keyContains, fromFormat, toFormat) {
  const formattedDates = {};
  Object.keys(object).forEach((key) => {
    if (key.includes(keyContains)) {
      const parsedDate = dayjs(object[key], { format: fromFormat });
      const formattedDate = parsedDate.format(toFormat);
      formattedDates[key] = formattedDate;
    }
  });

  return { ...object, ...formattedDates };
}
