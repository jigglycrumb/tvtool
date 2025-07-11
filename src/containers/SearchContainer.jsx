import React from "react";
import { connect } from "react-redux";
import { Search } from "../views/Search";
import theMovieDb from "../tmdb";
import actions from "../state/actions";
const { searchSuccess, selectShow } = actions;

const mapStateToProps = (state) => {
  return {
    show: state.show,
    query: state.search.query,
    results: state.search.results,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    searchSuccess: (query, results) => dispatch(searchSuccess(query, results)),
    selectShow: (id) => dispatch(selectShow(id, name)),
  };
};

class SearchContainer extends React.Component {
  state = {
    query: "",
  };

  render() {
    return (
      <Search
        show={this.props.show}
        query={this.props.query}
        results={this.props.results}
        searchTmdb={this.searchTmdb}
        selectShow={this.props.selectShow}
        checkReturn={this.checkReturn}
      />
    );
  }

  searchTmdb = (query) => {
    document.querySelector(".backdrop").style.backgroundImage = "none";
    if (query.length > 1) {
      this.setState({ query: encodeURIComponent(query) }, () => {
        theMovieDb.search.getTv({ query: this.state.query }, this.searchSuccess, this.searchError);
      });
    } else {
      this.props.searchSuccess("", []);
    }
  };

  searchSuccess = (json) => {
    json = JSON.parse(json);
    this.props.searchSuccess(this.state.query, json.results);
  };

  searchError(json) {
    json = JSON.parse(json);
    console.error("SearchContainer.searchError", json);
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchContainer);
