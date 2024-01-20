import FileInput from "./Inputs/FileInput";

export default function ImageUpload({ imgUrl }) {
  const imgStyle = {
    backgroundImage: "url('/Caterer.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "350px",
    width: "100%",
    position: "relative",
  };
  return (
    <div style={imgStyle}>
      <FileInput />
    </div>
  );
}
