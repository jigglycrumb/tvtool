import React from "react";
import { connect } from "react-redux";
import { Header } from "./Header";
import SearchContainer from "../containers/SearchContainer";
import { Footer } from "./Footer";

import actions from "../state/actions";
const { restoreState } = actions;

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {
    restoreState: state => dispatch(restoreState(state)),
  };
};

class App extends React.Component {
  render() {
    return (
      <div className="app container">
        <Header />
        <SearchContainer />
        <Footer />
      </div>
    );
  }

  componentDidMount() {
    var storedState = localStorage.getItem("TvTool");
    if (storedState !== null) {
      try {
        let state = JSON.parse(storedState);
        console.info("Restored state from localStorage");
        this.props.restoreState(state);
      } catch (e) {
        console.error("Failed to restore state from localStorage");
      }
    } else {
      console.info("Found no previous state in localStorage, using defaults");
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
