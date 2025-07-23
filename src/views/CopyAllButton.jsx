import { useEffect, useState } from "react";

function copyTextToClipboard(text, callback) {
  if (!navigator.clipboard) {
    return;
  }
  navigator.clipboard.writeText(text).then(callback, (_err) => {
    // Error logging removed
  });
}

export const CopyAllButton = ({ episodes }) => {
  const episodeString = episodes.reduce((str, episode) => {
    return `${str}${episode.title}\n`;
  }, "");

  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    setClicked(false);
  }, []);

  const handleClick = () => {
    copyTextToClipboard(episodeString, () => {
      setClicked(true);
    });
  };

  const label = clicked ? "Copied!" : "Copy all";

  return (
    <button
      type="button"
      className="button copy-all-button"
      onClick={handleClick}
      disabled={clicked}
    >
      {label}
    </button>
  );
};
