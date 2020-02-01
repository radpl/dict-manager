import React from "react";
import EntriesList from "./EntriesList";
import { saveEntry, getEntries, deleteEntry } from "../api/entryApi";
import EntryForm from "./EntryForm";

class EntriesPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      entries: null,
      entry: {},
      dictId: null,
      checked: true
    };

    this.handleDelete = this.handleDelete.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  handleChange = event => {
    const { name, value } = event.target;
    this.setState({
      entry: {
        ...this.state.entry,
        [name]: value
      }
    });
  };

  handleCheck = event => {
    const checked = event.target.checked;
    this.setState({ checked });
  };

  handleSave = async event => {
    event.preventDefault();
    if (!this.isEntryValid()) return;

    const { entry, entries } = this.state;

    try {
      if (!this.state.dictId) return;

      entry.dictId = this.state.dictId;
      const result = await saveEntry(entry);
      this.setState({ entries: [...entries, result] });
    } catch (error) {
      console.log(error);
    }
  };

  isEntryValid = () => {
    const { entry, entries } = this.state;
    const errors = {};
    let valid = true;

    if (!this.state.checked) return true;

    //isValue
    if (!entry.domain) {
      errors.domain = "Domain is required.";
      this.setState({ errors });
      return false;
    }
    if (!entry.range) {
      errors.range = "Range is required.";
      this.setState({ errors });
      return false;
    }

    //isDuplicate
    let found = entries.find(
      item => item.domain === entry.domain && item.range === entry.range
    );
    if (found) {
      errors.entry = "Error. Duplicate entry found.";
      this.setState({ errors });
      return false;
    }
    //isDuplicateDomain
    found = entries.find(item => item.domain === entry.domain);
    if (found) {
      errors.entry = "Error. Duplicate domain found.";
      this.setState({ errors });
      return false;
    }
    //isCycle
    found = entries.find(
      item => item.domain === entry.range && item.range === entry.domain
    );
    if (found || entry.domain === entry.range) {
      errors.entry = "Error. This entry creates cycle.";
      this.setState({ errors });
      return false;
    }
    //isChain
    found = entries.find(item => item.range === entry.domain);
    if (found) {
      errors.entry = "Error. This entry creates chain.";
      this.setState({ errors });
      return false;
    }

    return valid;
  };

  handleDelete = async entryId => {
    try {
      await deleteEntry(entryId);
      const filteredEntries = this.state.entries.filter(
        item => item.id !== entryId
      );
      this.setState({ entries: filteredEntries });
    } catch (error) {
      console.log("Delete failed " + error.message);
    }
  };

  async componentDidMount() {
    const dictId = this.props.match.params.id;
    this.setState({ dictId });
    try {
      const entries = await getEntries(dictId);
      console.log(entries);
      this.setState({ entries });
    } catch (err) {
      console.log("Error", err);
    }
  }

  render() {
    return (
      <>
        <EntryForm
          handleChange={this.handleChange}
          handleSave={this.handleSave}
          handleCheck={this.handleCheck}
          domain={this.state.entry.domain}
          range={this.state.entry.range}
          errors={this.state.errors}
          checked={this.state.checked}
        />
        <EntriesList
          entries={this.state.entries}
          handleDelete={this.handleDelete}
        />
      </>
    );
  }
}

export default EntriesPage;
