/** @jsx React.DOM */
var TvShow = React.createClass({
  render: function() {
    var backdrop = theMovieDb.common.images_uri + 'w1000' + this.props.show.backdrop_path,
        poster = theMovieDb.common.images_uri + 'w500' + this.props.show.poster_path;

    return (
      <div>
        <img alt="logo/backdrop" src={backdrop} />
        <img alt="logo/poster" src={poster} />
        <h2>{this.props.show.name}</h2>
        <ul>
          <li>Seasons: {this.props.show.number_of_seasons}</li>
          <li>Episodes: {this.props.show.number_of_episodes}</li>
          <li>{this.props.show.overview}</li>
        </ul>
        <div>
          {this.props.show.seasons.map(function(season) {
            if(season.season_number > 0) {
              return (
                <TvShowSeason key={season.season_number} show={this.props.show.id} season={season} />
              );
            }
          }, this)}
        </div>
      </div>
    );
  },
});