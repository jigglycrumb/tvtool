/** @jsx React.DOM */
var TvShowSeason = React.createClass({
  render: function() {
    return (
      <ul onClick={this.loadSeason}>
        <li>Season {this.props.season.season_number}</li>
      </ul>
    )
  },
  loadSeason: function() {
    theMovieDb.tvSeasons.getById({
      "id":this.props.show,
      "season_number": this.props.season.season_number
    }, this.showSeason, this.showError);
  },
  showSeason: function(json) {
    var json = JSON.parse(json);
    React.renderComponent(<EpisodeList season={json} />, document.getElementById('EpisodeListContainer'));
  },
  showError: function(json) {
    var json = JSON.parse(json);
    console.log(json);
  },
});