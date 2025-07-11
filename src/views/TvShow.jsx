import { useSignals } from "@preact/signals-react/runtime";
import { InfoIcon } from "@primer/octicons-react";
import { useEffect, useState } from "react";
import {
  actions,
  filterChars,
  language,
  season,
  showInfo,
  space,
  zerofill,
} from "../state/signals";
import theMovieDb from "../tmdb";
import EpisodeList from "./EpisodeList";
import TvShowLanguage from "./TvShowLanguage";

const posterWidth = 300;

const TvShow = ({ showId }) => {
  useSignals();

  const [zerofillhelpVisible, setZerofillhelpVisible] = useState(false);
  const [filtercharshelpVisible, setFiltercharshelpVisible] = useState(false);

  useEffect(() => {
    if (showId !== null) {
      theMovieDb.tv.getById(
        { id: showId, language: language.value },
        (json) => {
          const data = JSON.parse(json);
          actions.loadShowInfoSuccess(data);
        },
        (json) => {
          const _data = JSON.parse(json);
          // Error logging removed
        }
      );
    }
  }, [showId]);

  if (showId === null) return <span />;

  const handleSetZerofill = (index, e) => {
    let zf = [...zerofill.value];
    const value = parseInt(e.target.value);

    if (index === 0) zf = [value, zf[1]];
    else if (index === 1) zf = [zf[0], value];

    actions.setZerofill(zf);
  };

  let poster = false;

  if (showInfo.value.poster_path !== null)
    poster = `${theMovieDb.common.images_uri}w${posterWidth}${showInfo.value.poster_path}`;

  let posterStr = (
    <div className="img-thumbnail text-center">
      <p className="no-poster">No poster available</p>
    </div>
  );

  if (poster) posterStr = <img alt="Show poster" className="img-thumbnail" src={poster} />;

  const yearStart = showInfo.value.first_air_date
    ? showInfo.value.first_air_date.split("-")[0]
    : "";
  const yearEnd = showInfo.value.last_air_date ? showInfo.value.last_air_date.split("-")[0] : "";

  return (
    <div>
      {/* Show info */}
      <div className="row">
        <div className="col-3">{posterStr}</div>
        <div className="col-9">
          <h2>{showInfo.value.name}</h2>
          <h6>
            {yearStart}-{yearEnd}
          </h6>
          <ul className="flat">
            <li>
              <strong>
                {showInfo.value.number_of_seasons} seasons, {showInfo.value.number_of_episodes}{" "}
                episodes
              </strong>
            </li>
            <li>{showInfo.value.overview}</li>
          </ul>
        </div>
      </div>
      <br />
      <br />

      {/* Language selection */}
      <div className="row">
        <div className="col-3 text-right">
          <h6>Language</h6>
        </div>
        <div className="col-8">
          <TvShowLanguage />
        </div>
      </div>

      {/* Season selection */}
      <div className="row">
        <div className="col-3 text-right">
          <h6>Season</h6>
        </div>
        <div className="col-8">
          <select
            className="form-control"
            onChange={(event) => actions.selectSeason(event.target.value)}
            value={season.value}
          >
            {showInfo.value.seasons.map((seasonItem) => {
              if (seasonItem.season_number > 0) {
                return (
                  <option
                    key={`show-season-${seasonItem.season_number}`}
                    value={seasonItem.season_number}
                  >
                    {seasonItem.season_number}
                  </option>
                );
              }
              return null;
            })}
          </select>
        </div>
      </div>

      {/* Zerofill */}
      <div className="row">
        <div className="col-3 text-right">
          <h6>Zerofill</h6>
        </div>
        <div className="col-2 text-right">
          <h6>Season</h6>
        </div>
        <div className="col-2">
          <input
            type="number"
            min="0"
            max="3"
            className="form-control"
            value={zerofill.value[0]}
            onChange={(e) => handleSetZerofill(0, e)}
          />
        </div>
        <div className="col-2 text-right">
          <h6>Episode</h6>
        </div>
        <div className="col-2">
          <input
            type="number"
            min="0"
            max="3"
            className="form-control"
            value={zerofill.value[1]}
            onChange={(e) => handleSetZerofill(1, e)}
          />
        </div>
        <div className="col-1 no-padding">
          <button
            className="btn btn-link p-0"
            type="button"
            onClick={() => setZerofillhelpVisible(!zerofillhelpVisible)}
            style={{
              color: "blue",
              position: "relative",
            }}
          >
            <InfoIcon size="medium" />
          </button>
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
          <h6>Replace spaces with</h6>
        </div>
        <div className="col-2">
          <input
            type="text"
            className="form-control"
            maxLength="1"
            value={space.value}
            onChange={(e) => actions.setSpaceReplacement(e.target.value)}
          />
        </div>
        <div className="col-9" />
      </div>

      {/* Problematic characters replacement */}
      <div className="row">
        <div className="col-3 text-right">
          <h6>Filter problematic characters</h6>
        </div>
        <div className="col-2">
          <input
            type="checkbox"
            checked={filterChars.value}
            onChange={(e) => actions.toggleFilterChars(e.target.checked)}
          />
        </div>

        <div className="col-1 no-padding">
          <button
            className="btn btn-link p-0"
            type="button"
            onClick={() => setFiltercharshelpVisible(!filtercharshelpVisible)}
            style={{
              color: "blue",
              position: "relative",
            }}
          >
            <InfoIcon size="medium" />
          </button>
        </div>
        <div
          className="col-8 offset-3"
          style={{ display: filtercharshelpVisible ? "table-row" : "none" }}
        >
          <div className="alert alert-info help-text">
            Replaces ' / ' with ' & '
            <br />
            Replaces '/' and '\' with ','
            <br />
            Replaces ':' with ' -'
            <br />
            Removes ? and !
          </div>
        </div>
      </div>

      <EpisodeList />
    </div>
  );
};

export default TvShow;
