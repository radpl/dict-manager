import React, { Component } from "react";
import PropTypes from "prop-types";
import TextInput from "../common/TextInput";

class DictForm extends Component {
  render() {
    const {
      value,
      handleSave,
      handleChange,
      cancelEdit,
      errors = {},
      mode
    } = this.props;
    return (
      <div className="entryForm">
        <h2>Add Dictionary</h2>
        <form onSubmit={handleSave}>
          <TextInput
            name="title"
            label="Title"
            value={value}
            onChange={handleChange}
            error={errors.dictionary}
          />
          {mode === "add" && <button>Add</button>}
          {mode === "edit" && (
            <>
              <button>Update</button>
              {" | "}
              <button onClick={cancelEdit}>Cancel</button>
            </>
          )}
        </form>
      </div>
    );
  }
}

DictForm.propTypes = {
  value: PropTypes.string,
  handleSave: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

export default DictForm;
