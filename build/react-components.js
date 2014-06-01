/** @jsx React.DOM */
var App = React.createClass({displayName: 'App',
  render: function() {
    return (
      React.DOM.div( {id:"App"}, 
        Header(null ),
        Search(null ),
        React.DOM.div( {id:"TvShowContainer"}),
        React.DOM.div( {id:"EpisodeListContainer"}),
        Footer(null )
      )
    );
  }
});
/** @jsx React.DOM */
var EpisodeList = React.createClass({displayName: 'EpisodeList',
  render: function() {
    return (
      React.DOM.ul(null, 
        React.DOM.li(null, "Season ", this.props.season.season_number),
        React.DOM.li(null, React.DOM.input( {type:"text"})),
        this.props.season.episodes.map(function(episode) {
          return (
            React.DOM.li( {key:episode.episode_number}, 
              this.props.season.season_number,
              "x",
              episode.episode_number,
              " - ",
              episode.name
            )
          )
        }, this)
      )
    );
  },
});
/** @jsx React.DOM */
var Footer = React.createClass({displayName: 'Footer',
  render: function() {
    return (
      React.DOM.footer(null, "This product uses the TMDb API but is not endorsed or certified by TMDb.")
    );
  },
});
/** @jsx React.DOM */
var Header = React.createClass({displayName: 'Header',
  render: function() {
    return (
      React.DOM.header(null, 
        React.DOM.h1(null, "episode helper")
      )
    );
  }
});
/** @jsx React.DOM */
var Search = React.createClass({displayName: 'Search',
  render: function() {
    return (
      React.DOM.div(null, 
        React.DOM.input( {type:"search", placeholder:"Enter a TV show", onChange:this.search} ),
        React.DOM.span( {ref:"searchResults"})
      )
    );
  },
  search: function(e) {
    var query = e.target.value;
    if(query.length >= 2) {
      query = encodeURIComponent(query);
      theMovieDb.search.getTv({"query":query}, this.showResults, this.showError)
    }
  },
  showResults: function(json) {
    json = JSON.parse(json);
    this.refs.searchResults.getDOMNode().innerHTML = 'Search found '+json.total_results+' shows.';
    if(json.total_results == 1) {
      var showid = json.results[0].id;
      theMovieDb.tv.getById({"id":showid}, this.loadShow, this.showError);
    }
  },
  showError: function(json) {
    json = JSON.parse(json);
    console.log(json);
    this.refs.searchResults.getDOMNode().innerHTML = 'Oops, something went wrong :(';
  },
  loadShow: function(json) {
    json = JSON.parse(json);
    React.renderComponent(TvShow( {show:json} ), document.getElementById('TvShowContainer'));
  },
});
/** @jsx React.DOM */
var TvShow = React.createClass({displayName: 'TvShow',
  render: function() {
    var backdrop = theMovieDb.common.images_uri + 'w1000' + this.props.show.backdrop_path,
        poster = theMovieDb.common.images_uri + 'w500' + this.props.show.poster_path;

    return (
      React.DOM.div(null, 
        React.DOM.img( {alt:"logo/backdrop", src:backdrop} ),
        React.DOM.img( {alt:"logo/poster", src:poster} ),
        React.DOM.h2(null, this.props.show.name),
        React.DOM.ul(null, 
          React.DOM.li(null, "Seasons: ", this.props.show.number_of_seasons),
          React.DOM.li(null, "Episodes: ", this.props.show.number_of_episodes),
          React.DOM.li(null, this.props.show.overview)
        ),
        React.DOM.div(null, 
          this.props.show.seasons.map(function(season) {
            if(season.season_number > 0) {
              return (
                TvShowSeason( {key:season.season_number, show:this.props.show.id, season:season} )
              );
            }
          }, this)
        )
      )
    );
  },
});
/** @jsx React.DOM */
var TvShowSeason = React.createClass({displayName: 'TvShowSeason',
  render: function() {
    return (
      React.DOM.ul( {onClick:this.loadSeason}, 
        React.DOM.li(null, "Season ", this.props.season.season_number)
      )
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
    React.renderComponent(EpisodeList( {season:json} ), document.getElementById('EpisodeListContainer'));
  },
  showError: function(json) {
    var json = JSON.parse(json);
    console.log(json);
  },
});