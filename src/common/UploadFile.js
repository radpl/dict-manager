import React from "react";
import PropTypes from "prop-types";

const UploadFile = ({ handleFile, fileType, name, uploadRef }) => {
  return (
    <input
      id="fileButton"
      type="file"
      name={name}
      onChange={handleFile}
      accept={fileType}
      ref={uploadRef}
      style={{ display: "none" }}
    />
  );
};

UploadFile.propTypes = {
  fileType: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  handleFile: PropTypes.func.isRequired
};

export default UploadFile;
