import React, { useEffect, useState } from "react";

function copyTextToClipboard(text, callback) {
  if (!navigator.clipboard) {
    return;
  }
  navigator.clipboard.writeText(text).then(callback, (err) => {
    console.error("Async: Could not copy text: ", err);
  });
}

export const CopyAllButton = ({ episodes }) => {
  const episodeString = episodes.reduce((str, episode) => {
    return `${str}${episode.title}\n`;
  }, "");

  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    setClicked(false);
  }, [episodeString]);

  const handleClick = () => {
    copyTextToClipboard(episodeString);
    setClicked(true);
  };

  const label = clicked ? "Copied!" : "Copy all";

  return (
    <button className="btn btn-secondary copy-all-button" onClick={handleClick} disabled={clicked}>
      {label}
    </button>
  );
};
