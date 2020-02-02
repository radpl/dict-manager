import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const DictList = props => {
  return (
    <div>
      <h2>Dictionaries</h2>
      {props.dictionaries === null && <p>Loading dictionaries...</p>}
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
          {props.dictionaries &&
            props.dictionaries.map(dict => (
              <tr key={dict.id}>
                <td>{dict.id}</td>
                <td>{dict.title}</td>
                <td>
                  <Link to={"/entries/" + dict.id + "/page/1"}>Entries</Link>
                </td>
                <td>
                  <button onClick={() => props.handleDelete(dict.id)}>
                    Delete
                  </button>
                  {" | "}
                  <button onClick={() => props.handleEdit(dict)}>Edit</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

DictList.propTypes = {
  dictionaries: PropTypes.array,
  handleDelete: PropTypes.func.isRequired
};

export default DictList;
