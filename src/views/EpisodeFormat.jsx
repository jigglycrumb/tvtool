import React from "react";

import Octicon, { Info } from "@primer/octicons-react";
export default class EpisodeFormat extends React.Component {
  constructor(props) {
    super(props);

    this.format = null;
    this.toggleFormatHelp = this.toggleFormatHelp.bind(this);
    this.dispatchNewFormat = this.dispatchNewFormat.bind(this);
    this.updateFormat = this.updateFormat.bind(this);
    this.checkReturn = this.checkReturn.bind(this);
    this.insertVariable = this.insertVariable.bind(this);
  }

  render() {
    return (
      <thead>
        <tr className="row">
          <th className="col-3 text-right">
            <h4>Episode format</h4>
          </th>
          <th className="col-8">
            <input
              id="episode-format"
              ref="format"
              type="text"
              className="form-control"
              defaultValue={this.props.format}
              onKeyDown={this.checkReturn}
              onChange={this.updateFormat}
              onBlur={this.dispatchNewFormat}
            />
          </th>
          <th className="col-1">
            <span
              onClick={this.toggleFormatHelp}
              style={{
                color: "blue",
                cursor: "pointer",
                left: "-0.5em",
                position: "relative"
              }}
            >
              <Octicon icon={Info} size="medium" />
            </span>
          </th>
        </tr>
        <tr ref="formatHelp" style={{ display: "none" }} className="row">
          <th className="col-3">&nbsp;</th>
          <th className="col-8">
            <div className="alert alert-info">
              <ul className="flat help-text">
                <li>
                  <p>
                    The field above controls how the episode names are
                    formatted. You can use these variables to insert episode
                    data:
                  </p>
                </li>
                <li>
                  <a className="pointer" onClick={this.insertVariable}>
                    (show)
                  </a>{" "}
                  The name of the show
                </li>
                <li>
                  <a className="pointer" onClick={this.insertVariable}>
                    (season)
                  </a>{" "}
                  The season number
                </li>
                <li>
                  <a className="pointer" onClick={this.insertVariable}>
                    (episode)
                  </a>{" "}
                  The episode number
                </li>
                <li>
                  <a className="pointer" onClick={this.insertVariable}>
                    (title)
                  </a>{" "}
                  The episode name
                </li>
                <li>
                  <p>
                    <br />
                    Hit return to refresh the episode list when finished!
                  </p>
                </li>
              </ul>
            </div>
          </th>
          <th className="col-1">&nbsp;</th>
        </tr>
      </thead>
    );
  }

  checkReturn(e) {
    this.updateFormat(e);
    if (e.nativeEvent.keyCode == 13) {
      this.dispatchNewFormat();
    }
  }

  updateFormat(e) {
    this.format = e.target.value;
  }

  dispatchNewFormat() {
    this.props.setEpisodeFormat(this.format);
  }

  toggleFormatHelp() {
    var node = this.refs.formatHelp;
    var visible = node.style.display == "none" ? false : true;
    if (visible) node.style.display = "none";
    else node.style.display = "flex";
  }

  insertVariable(e) {
    var text = e.target.innerHTML,
      formatString = document.getElementById("episode-format").value,
      newFormat = formatString + text;

    this.format = newFormat;
    document.getElementById("episode-format").value = newFormat;
    this.dispatchNewFormat();
  }
}
