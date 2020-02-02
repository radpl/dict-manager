import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <>
      <h1>Dictionary Management Application</h1>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/dictionaries">Dictionaries</Link></li>
        </ul>
      </nav>
    </>
  );
};

export default Header;
