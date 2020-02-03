/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import "./EntriesList.css";

class EntriesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      elementsPerPage: 20,
      pathName: ""
    };
  }

  handleClick = event => {
    this.setState({
      currentPage: Number(event.target.id)
    });
  };

  componentDidMount() {
    this.setState({ pathName: this.props.history.location.pathname });
  }

  render() {
    const { id, pageId } = this.props.match.params;
    const { elementsPerPage } = this.state;
    const indexOfLast = pageId * elementsPerPage;
    const indexOfFirst = indexOfLast - elementsPerPage;
    if (!this.props.entries) return null;
    const currentEntries = this.props.entries.slice(indexOfFirst, indexOfLast);
    const NoOfPages = [];
    const errorsKeys = Object.keys(this.props.validationErrors);
    for (
      let i = 1;
      i <= Math.ceil(this.props.entries.length / elementsPerPage);
      i++
    ) {
      NoOfPages.push(i);
    }
    const validationSummary = (
      <>
        <h2>Validation Summary</h2>
        <table>
          <thead>
            <tr>
              <th>Status</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            {errorsKeys &&
              errorsKeys.map(status => (
                <tr key={status}>
                  <td>{status}</td>
                  <td>{this.props.validationErrors[status]}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </>
    );

    const renderNavigation = (
      <tfoot>
        <tr>
          <td colSpan="5">
            <div className="links">
              <a href="#">&laquo;</a>{" "}
              {NoOfPages.map(item => (
                <Link
                  to={"/entries/" + id + "/page/" + item}
                  key={item}
                  id={item}
                  onClick={this.handleClick}
                >
                  {item} {" | "}
                </Link>
              ))}
              <a href="#">&raquo;</a>
            </div>
          </td>
        </tr>
      </tfoot>
    );

    const renderTable = (
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Domain</th>
            <th>Range</th>
            <th>Status</th>
            <th />
          </tr>
        </thead>
        {renderNavigation}
        <tbody>
          {this.props.entries &&
            currentEntries.map(entry => (
              <tr key={entry.id}>
                <td>{entry.id}</td>
                <td>{entry.domain}</td>
                <td>{entry.range}</td>
                <td className={entry.status}>{entry.status && entry.status}</td>
                <td>
                  <button onClick={() => this.props.handleDelete(entry.id)}>
                    Delete
                  </button>
                  {" | "}
                  <button onClick={() => this.props.handleEdit(entry)}>
                    Edit
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    );

    return (
      <div>
        {errorsKeys && errorsKeys.length > 0 && validationSummary}
        <h2>Dictionary Entries</h2>
        <button onClick={this.props.handleValidate}>Validate dictionary</button>
        <button onClick={this.props.handleUploadClick}>Upload CSV</button>
        {this.props.entries !== null && (<button onClick={this.props.handleExport}>Download CSV</button>)}
        {this.props.entries === null && <p>Loading dictionary entries...</p>}
        {renderTable}
      </div>
    );
  }
}

EntriesList.propTypes = {
  entries: PropTypes.array,
  handleDelete: PropTypes.func.isRequired
};

export default EntriesList;
