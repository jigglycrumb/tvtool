/** @jsx React.DOM */
var EpisodeList = React.createClass({
  render: function() {
    return (
      <ul>
        <li>Season {this.props.season.season_number}</li>
        <li><input type="text"/></li>
        {this.props.season.episodes.map(function(episode) {
          return (
            <li key={episode.episode_number}>
              {this.props.season.season_number}
              x
              {episode.episode_number}
              &nbsp;-&nbsp;
              {episode.name}
            </li>
          )
        }, this)}
      </ul>
    );
  },
});