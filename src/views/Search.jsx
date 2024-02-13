import React, { useRef } from "react";
import theMovieDb from "themoviedb-javascript-library";
import TvShowContainer from "../containers/TvShowContainer";
import { NoImage } from "./NoImage";

const thumbnailWidth = 200;
const backdropWidth = 500;

const setBackdrop = backdrop => {
  if (backdrop === null) {
    document.querySelector(".backdrop").style.backgroundImage = "none";
  } else {
    var url = theMovieDb.common.images_uri + `w${backdropWidth}` + backdrop;
    document.querySelector(".backdrop").style.backgroundImage =
      "url(" + url + ")";
  }
};

export const Search = ({ query, results, searchTmdb, selectShow, show }) => {
  const searchInputRef = useRef(null);

  const checkReturn = e => {
    if (e.nativeEvent.keyCode === 13) {
      if (results.length === 1) clearInputAndselectShow(results[0]);
    }
  };

  const clearInputAndselectShow = result => {
    searchInputRef.current.value = "";
    setBackdrop(result.backdrop_path);
    selectShow(result.id);
  };

  let resultList = "";

  if (show === null && results.length > 0) {
    resultList = (
      <ul className="list-inline">
        {results.map(function (result) {
          const img =
            result.poster_path === null ? (
              <div
                className="img-thumbnail text-center no-poster-search-result"
                title={result.original_name}
              >
                <NoImage />
                <p>{result.original_name}</p>
              </div>
            ) : (
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

          return (
            <li
              key={result.id}
              className="search-result"
              onMouseOver={() => setBackdrop(result.backdrop_path)}
              onClick={() => clearInputAndselectShow(result)}
            >
              {img}
            </li>
          );
        }, this)}
      </ul>
    );
  } else if (show === null && results.length === 0 && query.length > 0) {
    resultList = (
      <p className="alert alert-info">
        No shows found. Please enter the full name of the show you are looking
        for.
      </p>
    );
  }

  return (
    <div style={{ position: "relative" }}>
      <div className="row">
        <div className="col-10 offset-1">
          <div className="search-bar">
            <input
              ref={searchInputRef}
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter tv show name"
              onChange={e => searchTmdb(e.target.value)}
              onKeyDown={checkReturn}
            />
          </div>
          {resultList}
        </div>
      </div>
      {show && <TvShowContainer show={show} />}
    </div>
  );
};
