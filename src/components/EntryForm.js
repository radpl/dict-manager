import React, { Component } from "react";
//import PropTypes from "prop-types";
import TextInput from "../common/TextInput";
//import SelectInput from "../common/SelectInput";

class EntryForm extends Component {
  render() {
    const { domain, range, handleSave, handleChange, errors = {} } = this.props;
    return (
      <>
        <h2>Add Dictionary Entries</h2>
        <form onSubmit={handleSave}>
          <TextInput
            name="domain"
            label="Domain"
            value={domain}
            onChange={handleChange}
            error={errors.domain}
          />
          <TextInput
            name="range"
            value={range}
            label="Range"
            onChange={handleChange}
            error={errors.range}
          />
          <button>Add</button>
        </form>
      </>
    );
  }
}

export default EntryForm;
