import * as React from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Text } from "../../components/Texts/Texts";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function FileInput({ fileData, handleFileData }) {
  const handleFileChange = async (evt) => {
    const file = evt.target.files[0];

    if (file) {
      // Check file type
      const allowedFileTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
      ];

      if (!allowedFileTypes.includes(file.type)) {
        console.error("Invalid file type. Please select a valid image file.");
        handleFileData(null);
        return;
      }

      // Check file size (in bytes)
      const maxSizeInBytes = 2 * 1024 * 1024; // 2 MB
      if (file.size > maxSizeInBytes) {
        console.error(
          "File size exceeds the limit of 2mb. Please select a smaller file."
        );
        handleFileData(null);
        return;
      }

      handleFileData(file);
    }
  };

  return (
    <>
      <Button
        component="label"
        variant="contained"
        startIcon={<CloudUploadIcon />}
      >
        Upload Image
        <VisuallyHiddenInput type="file" onChange={handleFileChange} />
      </Button>
      {fileData && (
        <Text size="sm" style={{ marginTop: "5px" }}>
          {fileData.name}
        </Text>
      )}
    </>
  );
}