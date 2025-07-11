import { useSignals } from "@preact/signals-react/runtime";
import { useRef, useState } from "react";
import { actions, searchQuery, searchResults, show as showSignal } from "../state/signals";
import theMovieDb from "../tmdb";
import { NoImage } from "./NoImage";
import TvShow from "./TvShow";

const thumbnailWidth = 200;

const Search = () => {
  useSignals();

  const searchInputRef = useRef(null);
  const [_localQuery, setLocalQuery] = useState("");

  const searchTmdb = (query) => {
    setLocalQuery(query);
    if (query.length > 1) {
      const encodedQuery = encodeURIComponent(query);
      theMovieDb.search.getTv(
        { query: encodedQuery },
        (json) => {
          const data = JSON.parse(json);
          actions.searchSuccess(encodedQuery, data.results);
        },
        (json) => {
          const _data = JSON.parse(json);
          // Error logging removed
        }
      );
    } else {
      actions.searchSuccess("", []);
    }
  };

  const checkReturn = (e) => {
    if (e.nativeEvent.keyCode === 13) {
      if (searchResults.value.length === 1) clearInputAndSelectShow(searchResults.value[0]);
    }
  };

  const clearInputAndSelectShow = (result) => {
    searchInputRef.current.value = "";
    setLocalQuery("");
    actions.selectShow(result.id);
  };

  let resultList = "";

  if (showSignal.value === null && searchResults.value.length > 0) {
    resultList = (
      <ul className="list-inline">
        {searchResults.value.map((result) => {
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
                src={`${theMovieDb.common.images_uri}w${thumbnailWidth}${result.poster_path}`}
                title={result.original_name}
              />
            );

          return (
            <li
              key={result.id}
              className="search-result"
              onClick={() => clearInputAndSelectShow(result)}
              onKeyDown={(e) => {
                if (e.key === "Enter") clearInputAndSelectShow(result);
              }}
            >
              {img}
            </li>
          );
        })}
      </ul>
    );
  } else if (
    showSignal.value === null &&
    searchResults.value.length === 0 &&
    searchQuery.value.length > 0
  ) {
    resultList = (
      <p className="alert alert-info">
        No shows found. Please enter the full name of the show you are looking for.
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
              onChange={(e) => searchTmdb(e.target.value)}
              onKeyDown={checkReturn}
            />
          </div>
          {resultList}
        </div>
      </div>
      {showSignal.value && <TvShow showId={showSignal.value} />}
    </div>
  );
};

export default Search;
