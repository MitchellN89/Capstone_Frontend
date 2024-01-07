import dayjs from "dayjs";

export function convertFormDataToObject(formData) {
  const obj = {};
  console.log("FORM DATA PRE JSON", formData);
  formData.forEach((val, key) => {
    val = val === "" ? null : val;
    obj[key] = val;
  });
  return obj;
}

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
