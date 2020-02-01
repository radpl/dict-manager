import React from "react";
import PropTypes from "prop-types";

const Checkbox = props => {
  const { name, label, onChange, checked } = props;
  let formClass = "form-group";

  return (
    <div className={formClass}>
      <div>
        <input
          type="checkbox"
          className="form-control"
          name={name}
          checked={checked}
          onChange={onChange}
        />{" "}
        {label}
      </div>
    </div>
  );
};

Checkbox.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string
};

export default Checkbox;
