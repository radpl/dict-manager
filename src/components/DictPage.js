import React from "react";
import DictList from "./DictList";
import { saveDictionary, getDictionaries, deleteDictionary } from "../api/dictApi";
import { deleteBulkEntries } from "../api/entryApi";
import DictForm from "./DictForm";

class DictPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dictionaries: null,
      dictionary: {},
      errors: {},
      mode: "add"
    };

    this.handleDelete = this.handleDelete.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  handleChange = event => {
    const { name, value } = event.target;
    this.setState({
      dictionary: {
        ...this.state.dictionary,
        [name]: value
      }
    });
  };

  handleSave = async event => {
    event.preventDefault();
    if (!this.isValid()) return;
    const { dictionary, dictionaries } = this.state;

    if (this.state.mode === "edit") {
      try {
        await saveDictionary(dictionary);
        this.setState(prevState => {
          const dictionariesNew = [...prevState.dictionaries];
          const index = dictionariesNew.findIndex(
            obj => obj.id === dictionary.id
          );
          dictionariesNew[index] = { ...dictionary };
          return {
            dictionaries: dictionariesNew,
            mode: "add",
            dictionary: Object.assign({}, { title: "" })
          };
        });
      } catch (error) {
        console.log(error);
      }

      return;
    }

    const found = dictionaries.find(item => item.title === dictionary.title);
    if (found) {
      return;
    }
    try {
      const result = await saveDictionary(dictionary);
      this.setState({ dictionaries: [...dictionaries, result], dictionary: Object.assign({}, { title: "" }) });
    } catch (error) {
      console.log(error);
    }
  };

  isValid = () => {
    const { dictionary, dictionaries } = this.state;
    const errors = {};
    let valid = true;

    if (!dictionary.title) {
      errors.dictionary = "Title is required.";
      valid = false;
    }

    const exists = dictionaries.find(item => item.title === dictionary.title);
    if (exists) {
      errors.dictionary = "Title already used.";
      valid = false;
    }
    this.setState({ errors });
    return valid;
  };

  handleDelete = async dictId => {
    try {
      await deleteDictionary(dictId);
      const filteredDicts = this.state.dictionaries.filter(item => item.id !== dictId);
      this.setState({ dictionaries: filteredDicts });

      await deleteBulkEntries(dictId);

    } catch (error) {
      console.log("Delete failed " + error.message);
    }
  };

  handleDictEdit = dictionary => {
    this.setState({ dictionary: { ...dictionary }, mode: "edit" });
  };

  handleCancelEdit = (event) => {
    event.preventDefault();
    this.setState(prevState => ({
      mode: "add",
      dictionary: { ...prevState.dictionarydictionary, title: "" }
    }));
  };

  async componentDidMount() {
    try {
      const dictionaries = await getDictionaries();
      this.setState({ dictionaries });
    } catch (err) {
      console.log("Error", err);
    }
  }

  render() {
    return (
      <>
        <DictForm
          handleChange={this.handleChange}
          handleSave={this.handleSave}
          cancelEdit={this.handleCancelEdit}
          value={this.state.dictionary.title}
          errors={this.state.errors}
          mode={this.state.mode}
        />
        <DictList
          dictionaries={this.state.dictionaries}
          handleDelete={this.handleDelete}
          handleEdit={this.handleDictEdit}
        />
      </>
    );
  }
}

export default DictPage;
