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
    <>
      <div className="columns">
        <div className="column is-3 has-text-right">
          <h6>Episode format</h6>
        </div>
        <div className="column is-8">
          <input
            id="episode-format"
            type="text"
            className="input"
            value={inputFormat}
            onKeyDown={checkReturn}
            onChange={updateFormat}
            onBlur={dispatchNewFormat}
          />
        </div>
        <div className="column is-1">
          <button type="button" className="button is-link is-small" onClick={toggleFormatHelp}>
            <InfoIcon size="small" />
          </button>
        </div>
      </div>
      {formatHelpVisible && (
        <div className="columns">
          <div className="column is-8 is-offset-3">
            <article class="message is-info">
              <div class="message-header">
                <p>Info</p>
                <button
                  type="button"
                  class="delete"
                  aria-label="delete"
                  onClick={() => setFormatHelpVisible(false)}
                ></button>
              </div>
              <div class="message-body">
                <ul className="flat">
                  <li>
                    <p>
                      The field above controls how the episode names are formatted. You can use
                      these variables to insert episode data:
                    </p>
                  </li>
                  <li>
                    <button
                      type="button"
                      className="button is-small is-link"
                      onClick={insertVariable}
                    >
                      (show)
                    </button>{" "}
                    The name of the show
                  </li>
                  <li>
                    <button
                      type="button"
                      className="button is-small is-link"
                      onClick={insertVariable}
                    >
                      (season)
                    </button>{" "}
                    The season number
                  </li>
                  <li>
                    <button
                      type="button"
                      className="button is-small is-link"
                      onClick={insertVariable}
                    >
                      (episode)
                    </button>{" "}
                    The episode number
                  </li>
                  <li>
                    <button
                      type="button"
                      className="button is-small is-link"
                      onClick={insertVariable}
                    >
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
            </article>
          </div>
        </div>
      )}
    </>
  );
};

export default EpisodeFormat;
