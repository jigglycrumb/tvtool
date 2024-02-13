import React, { useEffect, useRef, useState } from "react";
import { CheckIcon } from "@primer/octicons-react";

export const Episode = ({ episode }) => {
  const [copied, setCopied] = useState(false);
  const nameRef = useRef(null);
  const noticeRef = useRef(null);

  useEffect(() => unmark(), [episode.title]);

  const handleMouseover = () => {
    const nameNode = nameRef.current;
    const noticeNode = noticeRef.current;

    [].forEach.call(document.querySelectorAll(".copy-notice"), function (el) {
      el.style.display = "none";
    });
    noticeNode.style.display = "inline"; // not good

    nameNode.focus();
    nameNode.select();
  };

  const handleKeydown = e => {
    if (e.keyCode == 67 && (e.metaKey === true || e.ctrlKey === true)) {
      // user pressed ctrl+c, cmd+c
      markOk();
    }
  };

  const markOk = () => setCopied(true);
  const unmark = () => setCopied(false);

  const handleClick = () => {
    function copyTextToClipboard(text) {
      if (!navigator.clipboard) {
        return;
      }
      navigator.clipboard.writeText(text).then(markOk, function (err) {
        console.error("Async: Could not copy text: ", err);
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

  let rowClasses = "row";
  if (copied) {
    rowClasses += " alert alert-success";
  }

  return (
    <tr
      onClick={handleClick}
      onMouseOver={handleMouseover}
      onKeyDown={handleKeydown}
      className={rowClasses}
      title={episode.overview}
    >
      <td className="col-3 text-right">
        <small ref={noticeRef} className="copy-notice">
          <em className="text-muted">{notice}</em>
        </small>
      </td>
      <td className="col-8">
        <input
          ref={nameRef}
          className="episode form-control"
          type="text"
          value={episode.title}
          readOnly
        />
      </td>
      <td className="col-1">
        {copied && (
          <span
            style={{
              color: "seagreen",
              left: "-0.5em",
              position: "relative",
            }}
          >
            <CheckIcon size="medium" />
          </span>
        )}
      </td>
    </tr>
  );
};
