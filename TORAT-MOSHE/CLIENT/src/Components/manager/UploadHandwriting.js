import { DataSaverOffOutlined } from "@mui/icons-material";
import React, { useCallback, useMemo } from "react";
import { useDropzone } from "react-dropzone";
const baseStyle = {
  flex: 1,
  cursor: "pointer",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  // padding: "5px",
  margin: "0 auto",
  textAlign: "center",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#bebebe",
  borderStyle: "dashed",
  backgroundColor: "#d9d9d9",
  color: "#a1a1a1",
  outline: "none",
  transition: "border .24s ease-in-out",
  width: "350px",
};
const activeStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};
const DropZone = ({ setUpdateAttched }) => {
  const ArrayBufferToBase64 = (buffer) => {
    var binary = "";
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };
  const onDrop = useCallback((acceptedFiles) => {
    const newfilesArr = [];
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = () => {
        // Do whatever you want with the file contents
        const binaryStr = reader.result;
        newfilesArr.push({
          fileType: file.type,
          file: ArrayBufferToBase64(binaryStr),
          fileName: file.path,
        });
        setUpdateAttched(newfilesArr);
      };
      reader.readAsArrayBuffer(file);
    });
  }, []);
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
  });
  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isDragActive, isDragReject, isDragAccept]
  );
  return (
    <section style={{ direction: "rtl", display: "flex" }}>
      <div {...getRootProps({ style })}>
        <input {...getInputProps()} />
        <p>גרור תמונה או לחץ לבחירת תמונה</p>
      </div>
    </section>
  );
};

export default DropZone;