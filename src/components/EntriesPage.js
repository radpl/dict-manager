import React from "react";
import FileSaver from "file-saver";
import EntriesList from "./EntriesList";
import { saveEntry, saveBulkEntries, getEntries, deleteEntry } from "../api/entryApi";
import { validateEntryStatus, calculateValidationErrors } from "../utilities/validation";
import { convertEntriesToCSV, convertCSVToEntries } from "../utilities/fileProcessing";
import EntryForm from "./EntryForm";
import UploadFile from "../common/UploadFile";

class EntriesPage extends React.Component {
  constructor(props) {
    super(props);
    this.fileUploader = React.createRef();
    this.state = {
      entries: [],
      entry: {},
      dictId: null,
      checked: false,
      nextId: 0,
      mode: "add",
      validationErrors: {}
    };

    this.handleDelete = this.handleDelete.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleCheckbox = this.handleCheckbox.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleValidate = this.handleValidate.bind(this);
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

  handleCheckbox = event => {
    const checked = event.target.checked;
    this.setState({ checked });
  };

  handleSave = async event => {
    event.preventDefault();
    if (!this.isEntryValid()) return;

    const { entry, entries } = this.state;

    if (this.state.mode === "edit") {
      try {
        entry.drKey = entry.domain + entry.range;
        entry.rdKey = entry.range + entry.domain;
        delete entry.status;
        await saveEntry(entry);
        this.setState(prevState => {
          const entriesNew = [...prevState.entries];
          const index = entriesNew.findIndex(obj => obj.id === entry.id);
          entriesNew[index] = { ...entry };
          return {
            entries: entriesNew,
            mode: "add",
            entry: Object.assign({}, { dictId: this.state.dictId, domain: "", range: "", drKey: "", rdKey: "" })
          };
        });
      } catch (error) {
        console.log(error);
      }

      return;
    }

    try {
      if (!this.state.dictId) return;

      entry.dictId = this.state.dictId;
      entry.drKey = entry.domain + entry.range;
      entry.rdKey = entry.range + entry.domain;
      const result = await saveEntry(entry);

      this.setState({ nextId: +result.id + 1 });
      this.setState({ entries: [...entries, result], entry: Object.assign({}, { dictId: this.state.dictId, domain: "", range: "", drKey: "", rdKey: "" }) });
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
    this.setState({ errors });
    return valid;
  };

  handleDelete = async entryId => {
    try {
      await deleteEntry(entryId);
      const filteredEntries = this.state.entries.filter(item => item.id !== entryId);
      this.setState({ entries: filteredEntries });
    } catch (error) {
      console.log("Delete failed " + error.message);
    }
  };

  handleValidate = event => {
    event.preventDefault();
    const { entries } = this.state;
    const validatedEntries = validateEntryStatus(entries);
    const validationErrors = calculateValidationErrors(validatedEntries);
    this.setState({ entries: [...validatedEntries], validationErrors });
  };

  async componentDidMount() {
    const dictId = this.props.match.params.id;
    this.setState({ dictId });
    try {
      const entries = await getEntries(dictId);
      const nextId = entries && entries.length > 0 ? +entries[entries.length - 1].id + 1 : 1;
      this.setState({ nextId, entries });
    } catch (err) {
      console.log("Error", err);
    }
  }

  handleUploadClick = () => {
    this.fileUploader.current.click();
  };

  handleFileUpload = event => {
    if (window.FileReader) {
      const csvFile = event.target.files[0];
      if (csvFile) {
        const reader = new FileReader();
        reader.readAsText(csvFile);
        reader.onload = this.fileLoaded;
        reader.onerror = (event) => console.log(event.target.error);
      }
    }
  };

  fileLoaded = event => {
    const csv = event.target.result;
    this.processData(csv);
  };

  async processData(csv) {
    const newEntries = convertCSVToEntries(csv, this.state.nextId, this.state.dictId)
    if (newEntries) {
      try {
        await saveBulkEntries(newEntries);
        const result = await getEntries(this.state.dictId);
        const nextId = +result[result.length - 1].id + 1;
        this.setState({ nextId, entries: result });
      } catch (error) {
        console.log(error);
      }
    }
  }

  handleFileExport = event => {
    event.preventDefault();
    const { entries } = this.state;
    const csv = convertEntriesToCSV(entries);
    FileSaver.saveAs(csv, "data.csv");
  };

  handleEditEntry = entry => {
    this.setState({ entry: { ...entry }, mode: "edit" });
  };

  handleCancelEdit = () => {
    this.setState(prevState => ({
      mode: "add",
      entry: Object.assign({}, { dictId: this.state.dictId, domain: "", range: "", drKey: "", rdKey: "" })
    }));
  };

  render() {
    return (
      <>
        <UploadFile
          handleFile={this.handleFileUpload}
          fileType=".csv"
          name="Upload"
          uploadRef={this.fileUploader}
        />
        <EntryForm
          handleChange={this.handleChange}
          handleSave={this.handleSave}
          handleCheck={this.handleCheckbox}
          cancelEdit={this.handleCancelEdit}
          entry={this.state.entry}
          errors={this.state.errors}
          checked={this.state.checked}
          mode={this.state.mode}
        />
        <EntriesList
          entries={this.state.entries}
          handleDelete={this.handleDelete}
          handleExport={this.handleFileExport}
          handleEdit={this.handleEditEntry}
          handleUploadClick={this.handleUploadClick}
          handleValidate={this.handleValidate}
          history={this.props.history}
          match={this.props.match}
          validationErrors={this.state.validationErrors}
        />
      </>
    );
  }
}

export default EntriesPage;
