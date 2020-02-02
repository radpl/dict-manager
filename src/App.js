import React, { Component } from "react";
import { Route } from "react-router-dom";
import "./App.css";
import DictPage from "./components/DictPage";
import EntriesPage from "./components/EntriesPage";
import Header from "./components/Header";
import HomePage from "./components/HomePage";

export default class App extends Component {
  render() {
    return (
      <div className="main">
        <Header />
        <Route exact path="/" component={HomePage} />
        <Route path="/dictionaries" component={DictPage} />
        <Route path="/entries/:id/page/:pageId" component={EntriesPage} />
        {/* <Route path="/entries/:id" component={EntriesPage} /> */}
      </div>
    );
  }
}
