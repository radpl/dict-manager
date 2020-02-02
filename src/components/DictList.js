import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

class DictList extends Component {
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <h2>Dictionaries</h2>
        {this.props.dictionaries === null && <p>Loading dictionaries...</p>}
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Title</th>
              <th>Link</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {this.props.dictionaries &&
              this.props.dictionaries.map(dict => (
                <tr key={dict.id}>
                  <td>{dict.id}</td>
                  <td>{dict.title}</td>
                  <td>
                    <Link to={"/entries/" + dict.id + "/page/1"}>Entries</Link>
                  </td>
                  <td>
                    <button onClick={() => this.props.handleDelete(dict.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    );
  }
}

DictList.propTypes = {
  dictionaries: PropTypes.array,
  handleDelete: PropTypes.func.isRequired
};

export default DictList;
