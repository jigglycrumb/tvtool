import React, { useState } from "react";
import theMovieDb from "../tmdb";

import TvShowLanguageContainer from "../containers/TvShowLanguageContainer";
import EpisodeListContainer from "../containers/EpisodeListContainer";

import { InfoIcon } from "@primer/octicons-react";

const posterWidth = 300;
const backdropWidth = 500;

export const TvShow = ({
  info,
  season,
  selectSeason,
  setSpaceReplacement,
  setZerofill,
  show,
  space,
  zerofill,
}) => {
  const [zerofillhelpVisible, setZerofillhelpVisible] = useState(false);

  if (show === null) return <span />;

  const handleSetZerofill = (index, e) => {
    let zf = zerofill;
    const value = parseInt(e.target.value);

    if (index === 0) zf = [value, zf[1]];
    else if (index == 1) zf = [zf[0], value];

    setZerofill(zf);
  };

  let backdrop = false;
  let poster = false;

  if (info.backdrop_path !== null)
    backdrop =
      theMovieDb.common.images_uri + `w${backdropWidth}` + info.backdrop_path;

  if (info.poster_path !== null)
    poster =
      theMovieDb.common.images_uri + `w${posterWidth}` + info.poster_path;

  // TODO this should be an effect or similar
  if (backdrop)
    document.querySelector(".backdrop").style.backgroundImage =
      "url(" + backdrop + ")";

  let posterStr = (
    <div className="img-thumbnail text-center">
      <p className="no-poster">No poster available</p>
    </div>
  );

  if (poster)
    posterStr = (
      <img alt="Show poster" className="img-thumbnail" src={poster} />
    );

  const yearStart = info.first_air_date
    ? info.first_air_date.split("-")[0]
    : "";
  const yearEnd = info.last_air_date ? info.last_air_date.split("-")[0] : "";

  return (
    <div>
      {/* Show info */}
      <div className="row">
        <div className="col-3">{posterStr}</div>
        <div className="col-9">
          <h2>{info.name}</h2>
          <h6>
            {yearStart}-{yearEnd}
          </h6>
          <ul className="flat">
            <li>
              <strong>
                {info.number_of_seasons} seasons, {info.number_of_episodes}{" "}
                episodes
              </strong>
            </li>
            <li>{info.overview}</li>
          </ul>
        </div>
      </div>
      <br />
      <br />

      {/* Language selection */}
      <div className="row">
        <div className="col-3 text-right">
          <h4>Select a language</h4>
        </div>
        <div className="col-8">
          <TvShowLanguageContainer />
        </div>
      </div>

      {/* Season selection */}
      <div className="row">
        <div className="col-3 text-right">
          <h4>Select a season</h4>
        </div>
        <div className="col-8">
          <select
            className="form-control"
            onChange={event => selectSeason(event.target.value)}
            defaultValue={season}
          >
            {info.seasons.map(function (season) {
              if (season.season_number > 0) {
                return (
                  <option
                    key={"show-season-" + season.season_number}
                    value={season.season_number}
                  >
                    {season.season_number}
                  </option>
                );
              }
            }, this)}
          </select>
        </div>
      </div>

      {/* Zerofill */}
      <div className="row">
        <div className="col-3 text-right">
          <h5>Zerofill</h5>
        </div>
        <div className="col-2 text-right">
          <span className="h5">Season</span>
        </div>
        <div className="col-2">
          <input
            type="number"
            min="0"
            max="3"
            className="form-control"
            defaultValue={zerofill[0]}
            onChange={e => handleSetZerofill(0, e)}
          />
        </div>
        <div className="col-2 text-right">
          <span className="h5">Episode</span>
        </div>
        <div className="col-2">
          <input
            type="number"
            min="0"
            max="3"
            className="form-control"
            defaultValue={zerofill[1]}
            onChange={e => handleSetZerofill(1, e)}
          />
        </div>
        <div className="col-1 no-padding">
          <span
            onClick={() => setZerofillhelpVisible(!zerofillhelpVisible)}
            style={{
              color: "blue",
              cursor: "pointer",
              position: "relative",
            }}
          >
            <InfoIcon size="medium" />
          </span>
        </div>
        <div
          className="col-8 offset-3"
          style={{ display: zerofillhelpVisible ? "table-row" : "none" }}
        >
          <div className="alert alert-info help-text">
            Zerofill adds leading zeroes to episode and season numbers.
          </div>
        </div>
      </div>

      {/* Space replacement */}
      <div className="row">
        <div className="col-3 text-right">
          <h5>Replace spaces with</h5>
        </div>
        <div className="col-2">
          <input
            type="text"
            className="form-control"
            maxLength="1"
            defaultValue={space}
            onChange={e => setSpaceReplacement(e.target.value)}
          />
        </div>
        <div className="col-9" />
      </div>

      <EpisodeListContainer />
    </div>
  );
};
