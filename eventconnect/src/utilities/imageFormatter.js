export async function formatImageForJSON(fileData) {
  let image;
  let imageUpload;

  // create a new FileReader
  const reader = new FileReader();

  const readFileAsDataURL = (fileData) => {
    return new Promise((res, rej) => {
      reader.onloadend = () => {
        res(reader.result);
      };

      reader.onerror = (error) => {
        rej(error);
      };

      reader.readAsDataURL(fileData);
    });
  };

  image = await readFileAsDataURL(fileData);
  imageUpload = image.split(",")[1];

  return imageUpload;
}
