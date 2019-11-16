import React from "react";
import theMovieDb from "themoviedb-javascript-library";
import TvShowContainer from "../containers/TvShowContainer";
import NoImage from "./NoImage";

const thumbnailWidth = 200;
const backdropWidth = 500;

export default class Search extends React.Component {
  render() {
    let results = "",
      tvshow = "";

    if (this.props.show === null && this.props.results.length > 0) {
      results = (
        <ul className="list-inline">
          {this.props.results.map(function(result) {
            let img = "";
            if (result.poster_path === null) {
              img = (
                <div
                  className="img-thumbnail text-center no-poster-search-result"
                  title={result.original_name}
                >
                  <NoImage />
                  <p>{result.original_name}</p>
                </div>
              );
            } else {
              img = (
                <img
                  alt={result.original_name}
                  className="img-thumbnail"
                  src={
                    theMovieDb.common.images_uri +
                    `w${thumbnailWidth}` +
                    result.poster_path
                  }
                  title={result.original_name}
                />
              );
            }

            return (
              <li
                key={result.id}
                className="search-result"
                onMouseOver={this.setBackdrop.bind(this, result.backdrop_path)}
                onClick={this.clearInputAndselectShow.bind(this, result)}
              >
                {img}
              </li>
            );
          }, this)}
        </ul>
      );
    } else if (
      this.props.show === null &&
      this.props.results.length === 0 &&
      this.props.query.length > 0
    ) {
      results = (
        <p className="alert alert-info">
          No shows found. Please enter the full name of the show you are looking
          for.
        </p>
      );
    }

    if (this.props.show !== null) {
      tvshow = <TvShowContainer show={this.props.show} />;
    }

    return (
      <div>
        <div className="row">
          <div className="col-10 offset-1">
            <div className="search-bar">
              <input
                ref="searchInput"
                type="text"
                className="form-control form-control-lg"
                placeholder="Enter tv show name"
                onChange={e => this.props.searchTmdb(e.target.value)}
                onKeyDown={this.checkReturn.bind(this)}
              />
            </div>
            {results}
          </div>
        </div>
        {tvshow}
      </div>
    );
  }

  checkReturn(e) {
    if (e.nativeEvent.keyCode === 13) {
      if (this.props.results.length === 1)
        this.clearInputAndselectShow(this.props.results[0]);
    }
  }

  clearInputAndselectShow(result) {
    this.refs.searchInput.value = "";
    this.setBackdrop(result.backdrop_path);
    this.props.selectShow(result.id);
  }

  setBackdrop(backdrop) {
    if (backdrop === null) {
      document.querySelector(".backdrop").style.backgroundImage = "none";
    } else {
      var url = theMovieDb.common.images_uri + `w${backdropWidth}` + backdrop;
      document.querySelector(".backdrop").style.backgroundImage =
        "url(" + url + ")";
    }
  }
}
