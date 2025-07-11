import { useSignals } from "@preact/signals-react/runtime";
import { InfoIcon } from "@primer/octicons-react";
import { useEffect, useState } from "react";
import { actions, format } from "../state/signals";

const EpisodeFormat = () => {
  useSignals();

  const [formatHelpVisible, setFormatHelpVisible] = useState(false);
  const [inputFormat, setInputFormat] = useState(format.value);

  // Keep input in sync with signal
  useEffect(() => {
    setInputFormat(format.value);
  }, []);

  const checkReturn = (e) => {
    updateFormat(e);
    if (e.nativeEvent.keyCode === 13) {
      dispatchNewFormat();
    }
  };

  const updateFormat = (e) => {
    setInputFormat(e.target.value);
  };

  const dispatchNewFormat = () => {
    actions.setEpisodeFormat(inputFormat);
  };

  const toggleFormatHelp = () => {
    setFormatHelpVisible(!formatHelpVisible);
  };

  const insertVariable = (e) => {
    const text = e.target.innerHTML;
    const formatString = document.getElementById("episode-format").value;
    const newFormat = formatString + text;

    setInputFormat(newFormat);
    actions.setEpisodeFormat(newFormat);
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
          <button
            type="button"
            className="btn btn-link p-0"
            onClick={toggleFormatHelp}
            style={{
              color: "blue",
              left: "-0.5em",
              position: "relative",
            }}
          >
            <InfoIcon size="medium" />
          </button>
        </th>
      </tr>
      <tr style={{ display: formatHelpVisible ? "flex" : "none" }} className="row">
        <th className="col-3">&nbsp;</th>
        <th className="col-8">
          <div className="alert alert-info">
            <ul className="flat help-text">
              <li>
                <p>
                  The field above controls how the episode names are formatted. You can use these
                  variables to insert episode data:
                </p>
              </li>
              <li>
                <button type="button" className="btn btn-link p-0" onClick={insertVariable}>
                  (show)
                </button>{" "}
                The name of the show
              </li>
              <li>
                <button type="button" className="btn btn-link p-0" onClick={insertVariable}>
                  (season)
                </button>{" "}
                The season number
              </li>
              <li>
                <button type="button" className="btn btn-link p-0" onClick={insertVariable}>
                  (episode)
                </button>{" "}
                The episode number
              </li>
              <li>
                <button type="button" className="btn btn-link p-0" onClick={insertVariable}>
                  (title)
                </button>{" "}
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

export default EpisodeFormat;
