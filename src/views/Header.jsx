import { useSignals } from "@preact/signals-react/runtime";

import { showInfo } from "../state/signals";
import theMovieDb from "../tmdb";

const backdropWidth = 500;

export const Header = () => {
  useSignals();

  const backdropUrl = `url(${theMovieDb.common.images_uri}w${backdropWidth}${showInfo.value.backdrop_path})`;
  return (
    <header className="page-header">
      <div className="backdrop" style={{ backgroundImage: backdropUrl }} />
      <div className="backdrop-overlay" />
      <h1 className="row">
        <span className="col-10 offset-1">
          TvTool
          <br />
          <small>Rename tv show episodes with ease.</small>
        </span>
      </h1>
    </header>
  );
};
