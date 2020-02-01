import React, { Component } from 'react';

class EntriesList extends Component {
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);

  }

  render() {
    console.log(this.props.entries);
    return (
      <div>
        <h2>Dictionary Entries</h2>
        {this.props.entries === null && <p>Loading dictionary entries...</p>}
        < table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Domain</th>
              <th>Range</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {
              this.props.entries && this.props.entries.map(entry => (
                <tr key={entry.id}>
                  <td>{entry.id}</td>
                  <td>{entry.domain}</td>
                  <td>{entry.range}</td>
                  <td><button onClick={() => this.props.handleDelete(entry.id)}>Delete</button></td>
                </tr>
              ))
            }
          </tbody>
        </ table>

      </div>

    )
  }
}

export default EntriesList;