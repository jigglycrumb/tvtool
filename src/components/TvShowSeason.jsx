import React from 'react';
import classNames from 'classnames';
import AppState from '../lib/AppState';

export default class TvShowSeason extends React.Component {
  constructor(props) {
    super(props);
    this.changeSeason = this.changeSeason.bind(this);
  }

  render() {
    const classes = classNames('btn', 'btn-default', {'active': this.props.active});
    return (
      <button type="button" className={classes} onClick={this.changeSeason}>{this.props.season.season_number}</button>
    );
  }

  changeSeason() {
    var season = this.props.season.season_number;
    AppState.app.season = season;
    AppState.update();
  }
}
