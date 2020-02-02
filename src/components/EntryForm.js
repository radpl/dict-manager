import React, { Component } from "react";
import PropTypes from "prop-types";
import TextInput from "../common/TextInput";
import Checkbox from "../common/Checkbox";

//import SelectInput from "../common/SelectInput";

class EntryForm extends Component {
  render() {
    const {
      entry,
      checked,
      handleSave,
      handleChange,
      handleCheck,
      handleValidate,
      errors = {}
    } = this.props;
    return (
      <>
        <h2>Add Dictionary Entry</h2>
        <form onSubmit={handleSave}>
          <TextInput
            name="domain"
            label="Domain"
            value={entry.domain}
            onChange={handleChange}
            error={errors.domain}
          />
          <TextInput
            name="range"
            value={entry.range}
            label="Range"
            onChange={handleChange}
            error={errors.range}
          />
          {this.props.mode === "add" && <button>Add</button>}
          {this.props.mode === "edit" && (
            <>
              <button>Update</button>
              {" | "}
              <button onClick={this.props.cancelEdit}>Cancel</button>
            </>
          )}
          <button onClick={handleValidate}>Validate</button>
          <Checkbox
            name="validate"
            label="Validate entry"
            checked={checked}
            onChange={handleCheck}
          />
        </form>
        {errors && errors.entry && (
          <div className="input-error">{errors.entry}</div>
        )}
      </>
    );
  }
}

EntryForm.propTypes = {
  domain: PropTypes.string,
  range: PropTypes.string,
  checked: PropTypes.bool,
  handleSave: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleCheck: PropTypes.func.isRequired,
  errors: PropTypes.object
};

export default EntryForm;
