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
    <div className="has-text-centered box">
      <p className="no-poster">No poster available</p>
    </div>
  );

  if (poster) posterStr = <img alt="Show poster" className="image" src={poster} />;

  const yearStart = showInfo.value.first_air_date
    ? showInfo.value.first_air_date.split("-")[0]
    : "";
  const yearEnd = showInfo.value.last_air_date ? showInfo.value.last_air_date.split("-")[0] : "";

  return (
    <div>
      {/* Show info */}
      <div className="columns">
        <div className="column is-3">{posterStr}</div>
        <div className="column is-9">
          <p className="title">{showInfo.value.name}</p>
          <p className="subtitle">
            {yearStart}-{yearEnd}
          </p>
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
      <div className="columns">
        <div className="column is-3 has-text-right">
          <h6>Language</h6>
        </div>
        <div className="column is-8">
          <TvShowLanguage />
        </div>
      </div>

      {/* Season selection */}
      <div className="columns">
        <div className="column is-3 has-text-right">
          <h6>Season</h6>
        </div>
        <div className="column is-8">
          <div className="select">
            <select
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
      </div>

      {/* Zerofill */}
      <div className="columns">
        <div className="column is-3 has-text-right">
          <h6>Zerofill</h6>
        </div>
        <div className="column is-1">
          <h6>Season</h6>
        </div>
        <div className="column is-1">
          <input
            className="input"
            type="number"
            min="0"
            max="3"
            value={zerofill.value[0]}
            onChange={(e) => handleSetZerofill(0, e)}
          />
        </div>
        <div className="column is-1">
          <button
            className="button is-link is-small"
            type="button"
            onClick={() => setZerofillhelpVisible(!zerofillhelpVisible)}
          >
            <InfoIcon size="small" />
          </button>
        </div>
      </div>
      <div className="columns">
        <div className="column is-1 is-offset-3">
          <h6>Episode</h6>
        </div>
        <div className="column is-1">
          <input
            className="input"
            type="number"
            min="0"
            max="3"
            value={zerofill.value[1]}
            onChange={(e) => handleSetZerofill(1, e)}
          />
        </div>
      </div>

      {zerofillhelpVisible && (
        <div className="columns">
          <div className="column is-8 is-offset-3">
            <article class="message is-info">
              <div class="message-header">
                <p>Info</p>
                <button
                  type="button"
                  class="delete"
                  aria-label="delete"
                  onClick={() => setZerofillhelpVisible(false)}
                ></button>
              </div>
              <div class="message-body">
                Zerofill adds leading zeroes to episode and season numbers.
              </div>
            </article>
          </div>
        </div>
      )}

      {/* Space replacement */}
      <div className="columns">
        <div className="column is-3 has-text-right">
          <h6>Replace spaces with</h6>
        </div>
        <div className="column is-2">
          <input
            className="input"
            type="text"
            maxLength="1"
            value={space.value}
            onChange={(e) => actions.setSpaceReplacement(e.target.value)}
          />
        </div>
        <div className="column is-9" />
      </div>

      {/* Problematic characters replacement */}
      <div className="columns">
        <div className="column is-8 is-offset-3">
          <label className="checkbox">
            <input
              type="checkbox"
              checked={filterChars.value}
              onChange={(e) => actions.toggleFilterChars(e.target.checked)}
            />{" "}
            Filter problematic characters
          </label>

          <button
            className="button is-link is-small"
            type="button"
            onClick={() => setFiltercharshelpVisible(!filtercharshelpVisible)}
            style={{ marginLeft: "2em" }}
          >
            <InfoIcon size="small" />
          </button>
        </div>
      </div>

      {filtercharshelpVisible && (
        <div className="columns">
          <div className="column is-8 is-offset-3">
            <article class="message is-info">
              <div class="message-header">
                <p>Info</p>
                <button
                  type="button"
                  class="delete"
                  aria-label="delete"
                  onClick={() => setFiltercharshelpVisible(false)}
                ></button>
              </div>
              <div class="message-body">
                Replaces ' / ' with ' & '
                <br />
                Replaces '/' and '\' with ','
                <br />
                Replaces ':' with ' -'
                <br />
                Removes ? and !
              </div>
            </article>
          </div>
        </div>
      )}

      <EpisodeList />
    </div>
  );
};

export default TvShow;
