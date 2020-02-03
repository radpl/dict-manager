import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class HomePage extends Component {
  render() {
    return (
      <div>
        <p>Home Page for Dictionary Management Application</p>
        <p>Please navigate to the <Link to="/dictionaries">list of Dictionaries</Link> to see dictionaries overview, add, edit or delete dictionary</p>
      </div>
    );
  }
}
