import React, { Component } from "react";
import PropTypes from "prop-types";
import TextInput from "../common/TextInput";

class DictForm extends Component {
  render() {
    const { value, handleSave, handleChange, errors = {} } = this.props;
    return (
      <>
        <h2>Add Dictionary</h2>
        <form onSubmit={handleSave}>
          <TextInput
            name="title"
            label="Title"
            value={value}
            onChange={handleChange}
            error={errors.dictionary}
          />
          <button>Add</button>
        </form>
      </>
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
