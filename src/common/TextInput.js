import React from "react";
import PropTypes from "prop-types";

const TextInput = props => {
  const { name, label, onChange, placeholder, value, error, labelClass } = props;
  let formClass = "form-group";
  if (error && error.length > 0) {
    formClass += " has-error";
  }

  return (
    <div className={formClass}>
      <label className={labelClass} htmlFor={name}>{label}</label>
      <div>
        <input
          type="text"
          className="form-control"
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      </div>
      {error && <div className="input-error">{error}</div>}
    </div>
  );
};

TextInput.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  error: PropTypes.string
};

export default TextInput;
