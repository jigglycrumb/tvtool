import { CheckIcon } from "@primer/octicons-react";
import { useCallback, useEffect, useRef, useState } from "react";

export const Episode = ({ episode }) => {
  const [copied, setCopied] = useState(false);
  const nameRef = useRef(null);
  const noticeRef = useRef(null);

  const markOk = useCallback(() => setCopied(true), []);
  const unmark = useCallback(() => setCopied(false), []);

  useEffect(() => unmark(), [unmark]);

  const handleMouseover = () => {
    const nameNode = nameRef.current;
    const noticeNode = noticeRef.current;

    [].forEach.call(document.querySelectorAll(".copy-notice"), (el) => {
      el.style.display = "none";
    });
    noticeNode.style.display = "inline"; // not good

    nameNode.focus();
    nameNode.select();
  };

  const handleKeydown = (e) => {
    if (e.keyCode === 67 && (e.metaKey === true || e.ctrlKey === true)) {
      // user pressed ctrl+c, cmd+c
      markOk();
    }
  };

  const handleClick = () => {
    function copyTextToClipboard(text) {
      if (!navigator.clipboard) {
        return;
      }
      navigator.clipboard.writeText(text).then(markOk, (_err) => {
        // Error logging removed
      });
    }

    const nameNode = nameRef.current;
    copyTextToClipboard(nameNode.value);
  };

  let notice = "Click to copy";

  if (!navigator.clipboard) {
    notice = "Press Ctrl+C to copy";

    const isMac = navigator.platform.toUpperCase().indexOf("MAC") !== -1;
    if (isMac) notice = "Press Cmd+C to copy";
  }

  return (
    <div
      className="columns"
      onClick={handleClick}
      onMouseOver={handleMouseover}
      onFocus={handleMouseover}
      onKeyDown={handleKeydown}
      tabIndex={0}
      title={episode.overview}
    >
      <div className="column is-3 has-text-right">
        <small ref={noticeRef} className="copy-notice">
          <em className="has-text-grey">{notice}</em>
        </small>
      </div>
      <div className="column is-8">
        <input
          ref={nameRef}
          className={`input${copied ? " is-success" : ""}`}
          type="text"
          value={episode.title}
          readOnly
        />
      </div>
      <div className="column is-1">
        {copied && (
          <span
            style={{
              color: "var(--bulma-success)",
            }}
          >
            <CheckIcon size="small" />
          </span>
        )}
      </div>
    </div>
  );
};
