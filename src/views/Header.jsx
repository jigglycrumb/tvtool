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
      <h1 className="columns">
        <span className="column is-10 is-offset-1">
          <p className="title">TvTool</p>
          <p className="subtitle">Rename tv show episodes with ease.</p>
        </span>
      </h1>
    </header>
  );
};
