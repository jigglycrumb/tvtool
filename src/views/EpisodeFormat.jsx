import React, { useState } from "react";
import { InfoIcon } from "@primer/octicons-react";

export const EpisodeFormat = ({ format, setEpisodeFormat }) => {
  const [formatHelpVisible, setFormatHelpVisible] = useState(false);
  const [inputFormat, setInputFormat] = useState(format);

  const checkReturn = (e) => {
    updateFormat(e);
    if (e.nativeEvent.keyCode == 13) {
      dispatchNewFormat();
    }
  };

  const updateFormat = (e) => {
    setInputFormat(e.target.value);
  };

  const dispatchNewFormat = () => {
    setEpisodeFormat(inputFormat);
  };

  const toggleFormatHelp = () => {
    setFormatHelpVisible(!formatHelpVisible);
  };

  const insertVariable = (e) => {
    const text = e.target.innerHTML;
    const formatString = document.getElementById("episode-format").value;
    const newFormat = formatString + text;

    setInputFormat(newFormat);
    dispatchNewFormat();
  };

  return (
    <thead>
      <tr className="row">
        <th className="col-3 text-right">
          <h6>Episode format</h6>
        </th>
        <th className="col-8">
          <input
            id="episode-format"
            type="text"
            className="form-control"
            value={inputFormat}
            onKeyDown={checkReturn}
            onChange={updateFormat}
            onBlur={dispatchNewFormat}
          />
        </th>
        <th className="col-1">
          <span
            onClick={toggleFormatHelp}
            style={{
              color: "blue",
              cursor: "pointer",
              left: "-0.5em",
              position: "relative",
            }}
          >
            <InfoIcon size="medium" />
          </span>
        </th>
      </tr>
      <tr
        style={{ display: formatHelpVisible ? "flex" : "none" }}
        className="row"
      >
        <th className="col-3">&nbsp;</th>
        <th className="col-8">
          <div className="alert alert-info">
            <ul className="flat help-text">
              <li>
                <p>
                  The field above controls how the episode names are formatted.
                  You can use these variables to insert episode data:
                </p>
              </li>
              <li>
                <a className="pointer" onClick={insertVariable}>
                  (show)
                </a>{" "}
                The name of the show
              </li>
              <li>
                <a className="pointer" onClick={insertVariable}>
                  (season)
                </a>{" "}
                The season number
              </li>
              <li>
                <a className="pointer" onClick={insertVariable}>
                  (episode)
                </a>{" "}
                The episode number
              </li>
              <li>
                <a className="pointer" onClick={insertVariable}>
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
};
