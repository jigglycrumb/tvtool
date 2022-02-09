import React from "react";
import Octicon, { Check } from "@primer/octicons-react";

export default class Episode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      copied: false,
    };

    this.click = this.click.bind(this);
    this.mouseover = this.mouseover.bind(this);
    this.keydown = this.keydown.bind(this);
  }

  render() {
    var notice = "Press Ctrl+C to copy",
      isMac = navigator.platform.toUpperCase().indexOf("MAC") !== -1;

    if (isMac) notice = "Press Cmd+C to copy";

    let rowClasses = "row";
    if (this.state.copied) {
      rowClasses += " alert alert-success";
    }

    return (
      <tr
        ref="self"
        onClick={this.click}
        onMouseOver={this.mouseover}
        onKeyDown={this.keydown}
        className={rowClasses}
      >
        <td className="col-3 text-right">
          <small ref="notice" className="copy-notice">
            <em className="text-muted">{notice}</em>
          </small>
        </td>
        <td className="col-8">
          <input
            ref="name"
            className="episode form-control"
            type="text"
            value={this.props.name}
            readOnly
          />
        </td>
        <td className="col-1">
          {this.state.copied && (
            <span
              style={{
                color: "seagreen",
                left: "-0.5em",
                position: "relative",
              }}
            >
              <Octicon icon={Check} size="medium" />
            </span>
          )}
        </td>
      </tr>
    );
  }

  componentDidUpdate(prevProps) {
    if (this.props.name !== prevProps.name) {
      this.unmark();
    }
  }

  mouseover() {
    const nameNode = this.refs.name;
    const noticeNode = this.refs.notice;

    [].forEach.call(document.querySelectorAll(".copy-notice"), function (el) {
      el.style.display = "none";
    });
    noticeNode.style.display = "inline";

    nameNode.focus();
    nameNode.select();
  }

  keydown(e) {
    if (e.keyCode == 67 && (e.metaKey === true || e.ctrlKey === true)) {
      // user pressed ctrl+c, cmd+c
      this.markOk();
    }
  }

  markOk() {
    this.setState({
      copied: true,
    });
  }

  unmark() {
    this.setState({
      copied: false,
    });
  }

  click() {
    function copyTextToClipboard(episode, text) {
      if (!navigator.clipboard) {
        return;
      }
      navigator.clipboard.writeText(text).then(
        function () {
          episode.markOk();
        },
        function (err) {
          console.error("Async: Could not copy text: ", err);
        }
      );
    }

    const nameNode = this.refs.name;
    copyTextToClipboard(this, nameNode.value);
  }
}
