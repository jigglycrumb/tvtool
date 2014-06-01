/** @jsx React.DOM */
var TvShow = React.createClass({
  render: function() {
    console.log(this.props);
    return (
      <div>
        <img alt="logo/backdrop" />
        <h2>{this.props.show.name}</h2>
        <ul>
          <li>Seasons: {this.props.show.number_of_seasons}</li>
          <li>Episodes: {this.props.show.number_of_episodes}</li>
          <li>{this.props.show.overview}</li>
        </ul>
        <div>
          {this.props.show.seasons.map(function(season) {
            return (
              <div>Season {season.season_number}</div>
            );
          })}
        </div>
      </div>
    );
  },
});