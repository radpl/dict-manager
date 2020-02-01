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
      dictId: null
    };

    this.handleDelete = this.handleDelete.bind(this);
    this.handleChange = this.handleChange.bind(this);
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

  handleSave = async event => {
    event.preventDefault();
    const { entry, entries } = this.state;

    const found = entries.find(item => item.domain === entry.domain);
    if (found) {
      return;
    }
    try {
      if (!this.state.dictId) return;

      entry.dictId = this.state.dictId;
      const result = await saveEntry(entry);
      this.setState({ entries: [...entries, result] });
    } catch (error) {
      console.log(error);
    }
  };

  isEntryValid = (newEntry, existingEntries) => {
    //isDuplicate
    //isDuplicateDomain
    //isCycle
    //isChain

    return true;
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
          domain={this.state.entry.domain}
          range={this.state.entry.range}
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
