import React from "react";
import PropTypes from "prop-types";

const UploadFile = ({ handleFile, fileType }) => {
  return <input type="file" onChange={handleFile} accept={fileType} />;
};

export default UploadFile;
