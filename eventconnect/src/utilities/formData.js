export function convertFormDataToObject(formData) {
  const obj = {};
  formData.forEach((val, key) => {
    obj[key] = val;
  });
  return obj;
}
