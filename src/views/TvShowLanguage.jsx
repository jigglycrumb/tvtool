import React from 'react';
import classNames from 'classnames';
import AppState from '../lib/AppState';

export default class TvShowLanguage extends React.Component {
  constructor(props) {
    super(props);
    this.changeLanguage = this.changeLanguage.bind(this);
  }

  render() {
    var classes = classNames('btn', 'btn-default', {'active': this.props.active});
    return (
      <button type="button" className={classes} onClick={this.changeLanguage}>{this.props.translation.english_name}</button>
    );
  }

  changeLanguage() {
    var language = this.props.translation.iso_639_1;
    AppState.app.language = language;
    AppState.update();
  }
}
