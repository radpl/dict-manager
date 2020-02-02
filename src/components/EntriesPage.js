import React from "react";
import EntriesList from "./EntriesList";
import {
  saveEntry,
  saveBulkEntries,
  getEntries,
  deleteEntry
} from "../api/entryApi";
import EntryForm from "./EntryForm";
import UploadFile from "../common/UploadFile";

class EntriesPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      entries: null,
      entry: {},
      dictId: null,
      checked: true,
      nextId: 0
    };

    this.handleDelete = this.handleDelete.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
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
      entry.drKey = entry.domain + entry.range;
      entry.rdKey = entry.range + entry.domain;
      const result = await saveEntry(entry);

      this.setState({ nextId: result.id });
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

  handleValidate = event => {
    event.preventDefault();
    const { entries } = this.state;
    this.validateEntryStatus(entries);
  };

  validateEntryStatus = entries => {
    const domainRangeKeys = {};
    const rangeDomainKeys = {};
    const domainKeys = {};
    const rangeKeys = {};

    const duplicates = {};
    const cycles = {};
    const domains = {};
    const ranges = {};

    for (let i = 0; i < entries.length; i++) {
      //identify duplicates
      if (domainRangeKeys[entries[i].drKey]) {
        domainRangeKeys[entries[i].drKey].push(i);
        for (let j = 0; j < domainRangeKeys[entries[i].drKey].length; j++) {
          duplicates[domainRangeKeys[entries[i].drKey][j]] = true;
        }
      } else {
        domainRangeKeys[entries[i].drKey] = [i];
      }
      //populate for cycles identification
      if (rangeDomainKeys[entries[i].rdKey]) {
        rangeDomainKeys[entries[i].rdKey].push(i);
      } else {
        rangeDomainKeys[entries[i].rdKey] = [i];
      }

      //identify duplicate domains
      if (domainKeys[entries[i].domain]) {
        domainKeys[entries[i].domain].push(i);
        for (let j = 0; j < domainKeys[entries[i].domain].length; j++) {
          domains[domainKeys[entries[i].domain][j]] = true;
        }
      } else {
        domainKeys[entries[i].domain] = [i];
      }

      //populate for chains identification
      if (rangeKeys[entries[i].range]) {
        rangeKeys[entries[i].range].push(i);
      } else {
        rangeKeys[entries[i].range] = [i];
      }

      //pupulate status
      entries[i].status = "Valid";
    }

    const drKeys = Object.keys(domainRangeKeys);
    //identify cycles
    for (let i = 0; i < drKeys.length; i++) {
      let rdKey = rangeDomainKeys[drKeys[i]];
      if (rdKey) {
        for (let j = 0; j < rdKey.length; j++) {
          cycles[rdKey[j]] = true;
        }
      }
    }

    const rKeys = Object.keys(rangeKeys);
    //identify chains
    for (let i = 0; i < rKeys.length; i++) {
      let dKey = domainKeys[rKeys[i]];
      if (dKey) {
        for (let j = 0; j < dKey.length; j++) {
          ranges[dKey[j]] = true;
        }
      }
    }

    //update status
    const domainsKeys = Object.keys(domains);
    const duplicateKeys = Object.keys(duplicates);
    const rangesKeys = Object.keys(ranges);
    const cycleKeys = Object.keys(cycles);

    for (let i = 0; i < domainsKeys.length; i++) {
      if (entries[domainsKeys[i]].status === "Valid") {
        entries[domainsKeys[i]].status = "Forks";
      } else {
        entries[domainsKeys[i]].status += " Forks";
      }
    }

    for (let i = 0; i < duplicateKeys.length; i++) {
      if (entries[duplicateKeys[i]].status === "Valid") {
        entries[duplicateKeys[i]].status = "Duplicate";
      } else if (entries[duplicateKeys[i]].status.includes("Forks")) {
        entries[duplicateKeys[i]].status = entries[
          duplicateKeys[i]
        ].status.replace("Forks", "Duplicate");
      } else {
        entries[duplicateKeys[i]].status += " Duplicate";
      }
    }

    for (let i = 0; i < rangesKeys.length; i++) {
      if (entries[rangesKeys[i]].status === "Valid") {
        entries[rangesKeys[i]].status = "Chain";
      } else {
        entries[rangesKeys[i]].status += " Chain";
      }
    }

    for (let i = 0; i < cycleKeys.length; i++) {
      if (entries[cycleKeys[i]].status === "Valid") {
        entries[cycleKeys[i]].status = "Cycle";
      } else if (entries[cycleKeys[i]].status.includes("Chain")) {
        entries[cycleKeys[i]].status = entries[cycleKeys[i]].status.replace(
          "Chain",
          "Cycle"
        );
      } else {
        entries[cycleKeys[i]].status += " Cycle";
      }
    }

    this.setState({ entries: [...entries] });
  };

  async componentDidMount() {
    const dictId = this.props.match.params.id;
    this.setState({ dictId });
    try {
      const entries = await getEntries(dictId);
      const nextId = +entries[entries.length - 1].id + 1;
      this.setState({ nextId });
      this.setState({ entries });
    } catch (err) {
      console.log("Error", err);
    }
  }

  handleFile = event => {
    if (window.FileReader) {
      const csvFile = event.target.files[0];
      if (csvFile) {
        const reader = new FileReader();
        reader.readAsText(csvFile);
        reader.onload = this.fileLoaded;
        reader.onerror = this.errorHandler;
      }
    }
  };

  async processData(csv) {
    const linesRaw = csv.split(/\r\n|\n/);
    const newEntries = linesRaw.map((data, index) => {
      const [domain, range] = data.split(";");
      return {
        id: this.state.nextId + index,
        dictId: this.state.dictId,
        domain,
        range,
        drKey: domain + range,
        rdKey: range + domain
      };
    });
    if (newEntries) {
      try {
        const result = await saveBulkEntries(newEntries);
        this.setState({ entries: result });
      } catch (error) {
        console.log(error);
      }

      //this.setState({ newEntries });
    }
    //console.log(newEntries);
  }

  fileLoaded = event => {
    const csv = event.target.result;
    this.processData(csv);
  };

  errorHandler = event => {
    console.log(event.target.error);
  };
  render() {
    return (
      <>
        <h2>Upload file</h2>
        <UploadFile handleFile={this.handleFile} fileType=".csv" />
        <EntryForm
          handleChange={this.handleChange}
          handleSave={this.handleSave}
          handleCheck={this.handleCheck}
          handleValidate={this.handleValidate}
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
