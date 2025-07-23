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
      <div className="is-flex is-flex-wrap-wrap is-justify-content-center">
        {searchResults.value.map((result) => {
          const img =
            result.poster_path === null ? (
              <div
                className="has-text-centered no-poster-search-result"
                title={result.original_name}
              >
                <NoImage />
                <p>{result.original_name}</p>
              </div>
            ) : (
              <img
                alt={result.original_name}
                className="image"
                src={`${theMovieDb.common.images_uri}w${thumbnailWidth}${result.poster_path}`}
                title={result.original_name}
              />
            );

          return (
            <div
              key={result.id}
              className="search-result"
              onClick={() => clearInputAndSelectShow(result)}
              onKeyDown={(e) => {
                if (e.key === "Enter") clearInputAndSelectShow(result);
              }}
            >
              {img}
            </div>
          );
        })}
      </div>
    );
  } else if (
    showSignal.value === null &&
    searchResults.value.length === 0 &&
    searchQuery.value.length > 0
  ) {
    resultList = (
      <p className="notification is-info">
        No shows found. Please enter the full name of the show you are looking for.
      </p>
    );
  }

  return (
    <>
      <div className="columns">
        <div className="column is-10 is-offset-1">
          <div className="search-bar">
            <input
              ref={searchInputRef}
              type="text"
              className="input is-large"
              placeholder="Enter show name"
              onChange={(e) => searchTmdb(e.target.value)}
              onKeyDown={checkReturn}
              autoFocus
            />
          </div>
          {resultList}
        </div>
      </div>
      {showSignal.value && <TvShow showId={showSignal.value} />}
    </>
  );
};

export default Search;
