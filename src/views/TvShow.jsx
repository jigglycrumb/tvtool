import React from "react";
import theMovieDb from "themoviedb-javascript-library";

import TvShowLanguageContainer from "../containers/TvShowLanguageContainer";
import EpisodeListContainer from "../containers/EpisodeListContainer";

import Octicon, { Info } from "@primer/octicons-react";

const posterWidth = 300;
const backdropWidth = 500;

export default class TvShow extends React.Component {
  render() {
    if (this.props.show !== null) {
      var backdrop = false,
        poster = false;

      if (this.props.info.backdrop_path !== null)
        backdrop =
          theMovieDb.common.images_uri +
          `w${backdropWidth}` +
          this.props.info.backdrop_path;

      if (this.props.info.poster_path !== null)
        poster =
          theMovieDb.common.images_uri +
          `w${posterWidth}` +
          this.props.info.poster_path;

      if (backdrop)
        document.querySelector(".backdrop").style.backgroundImage =
          "url(" + backdrop + ")";

      var posterStr = (
        <div className="img-thumbnail text-center">
          <p className="no-poster">No poster available</p>
        </div>
      );

      if (poster)
        posterStr = (
          <img alt="Show poster" className="img-thumbnail" src={poster} />
        );

      var yearStart = this.props.info.first_air_date
        ? this.props.info.first_air_date.split("-")[0]
        : "";
      var yearEnd = this.props.info.last_air_date
        ? this.props.info.last_air_date.split("-")[0]
        : "";

      return (
        <div>
          {/* Show info */}
          <div className="row">
            <div className="col-3">{posterStr}</div>
            <div className="col-9">
              <h2>{this.props.info.name}</h2>
              <h6>
                {yearStart}-{yearEnd}
              </h6>
              <ul className="flat">
                <li>
                  <strong>
                    {this.props.info.number_of_seasons} seasons,{" "}
                    {this.props.info.number_of_episodes} episodes
                  </strong>
                </li>
                <li>{this.props.info.overview}</li>
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
                onChange={event => this.props.selectSeason(event.target.value)}
                defaultValue={this.props.season}
              >
                {this.props.info.seasons.map(function (season) {
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
                defaultValue={this.props.zerofill[0]}
                onChange={this.setZerofill.bind(this, 0)}
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
                defaultValue={this.props.zerofill[1]}
                onChange={this.setZerofill.bind(this, 1)}
              />
            </div>
            <div className="col-1">
              <span
                onClick={this.toggleZerofillHelp.bind(this)}
                style={{
                  color: "blue",
                  cursor: "pointer",
                  position: "relative",
                }}
              >
                <Octicon icon={Info} size="medium" />
              </span>
            </div>
            <div
              ref="zerofillHelp"
              className="col-8 offset-3"
              style={{ display: "none" }}
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
                defaultValue={this.props.space}
                onChange={this.setSpaceReplacement.bind(this)}
              />
            </div>
            <div className="col-9" />
          </div>

          <EpisodeListContainer />
        </div>
      );
    } else return <span />;
  }

  setZerofill(index, e) {
    let zf = this.props.zerofill;
    const value = parseInt(e.target.value);

    if (index === 0) zf = [value, zf[1]];
    else if (index == 1) zf = [zf[0], value];

    this.props.setZerofill(zf);
  }

  toggleZerofillHelp() {
    const node = this.refs.zerofillHelp;
    const visible = node.style.display == "none" ? false : true;
    if (visible) node.style.display = "none";
    else node.style.display = "table-row";
  }

  setSpaceReplacement(e) {
    this.props.setSpaceReplacement(e.target.value);
  }
}
