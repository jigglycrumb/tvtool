import React from "react";
import classNames from "classnames";

/**
 props: {
  active: bool,
  text: string,
  onClick: function
 }
*/

export default class Button extends React.Component {
  render() {
    const classes = classNames("btn", "btn-secondary", {
      active: this.props.active
    });
    return (
      <button type="button" className={classes} onClick={this.props.onClick}>
        {this.props.text}
      </button>
    );
  }
}
