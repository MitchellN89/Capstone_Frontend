export function convertFormDataToObject(formData) {
  const obj = {};
  formData.forEach((val, key) => {
    obj[key] = val;
  });
  console.log("formData.js > convertFromDataToObject: ", obj);
  return obj;
}
