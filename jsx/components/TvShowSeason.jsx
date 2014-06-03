/** @jsx React.DOM */
var TvShowSeason = React.createClass({
  render: function() {
    var cx = React.addons.classSet;
    var classes = cx({
      'btn': true,
      'btn-default': true,
      'active': this.props.active
    });
    return (
      <button type="button" className={classes} onClick={this.changeSeason}>{this.props.season.season_number}</button>
    )
  },
  changeSeason: function() {
    var season = this.props.season.season_number;
    AppState.app.season = season;
    AppState.update();
  },
});