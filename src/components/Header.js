import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <>
      <h1>Dictionary Management Application</h1>
      <nav>
        <Link to="/">Home</Link>
        {" | "}
        <Link to="/dictionaries">Dictionaries</Link>
        {" | "}
      </nav>
    </>
  );
};

export default Header;
