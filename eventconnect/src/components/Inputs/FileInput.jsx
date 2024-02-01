import * as React from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Text } from "../../components/Texts/Texts";
import { useNotification } from "../../context/NotificationProvider";

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

export default function FileInput({ fileData, handleFileData, disabled }) {
  const { triggerNotification } = useNotification();
  const handleFileChange = async (evt) => {
    //get file from uploaded data
    const file = evt.target.files[0];

    if (file) {
      // Check file type
      const allowedFileTypes = ["image/jpeg", "image/jpg"];

      if (!allowedFileTypes.includes(file.type)) {
        // if file type isn't valid, send err msg
        triggerNotification({
          message: "File must be jpeg or jpg",
          severity: "error",
        });

        //set file data state back to null
        handleFileData(null);
        //escape
        return;
      }

      // Check file size (in bytes)
      const maxSizeInBytes = 2 * 1024 * 1024; // 2 MB
      if (file.size > maxSizeInBytes) {
        // if file size is exceed, send err msg
        triggerNotification({
          message:
            "File size exceeds the limit of 2mb. Please select a smaller file",
          severity: "error",
        });

        console.error(
          "File size exceeds the limit of 2mb. Please select a smaller file."
        );

        //reset file data state
        handleFileData(null);
        //escape
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
        disabled={disabled}
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
