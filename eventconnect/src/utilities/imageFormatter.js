export async function formatImageForJSON(fileData) {
  let image;
  let imageUpload;

  const reader = new FileReader();

  const readFileAsDataURL = (fileData) => {
    return new Promise((resolve, reject) => {
      reader.onloadend = () => {
        resolve(reader.result);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsDataURL(fileData);
    });
  };

  image = await readFileAsDataURL(fileData);
  imageUpload = image.split(",")[1];

  return imageUpload;
}
