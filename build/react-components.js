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
    console.log(this.props);
    return (
      React.DOM.div(null, 
        React.DOM.img( {alt:"logo/backdrop"} ),
        React.DOM.h2(null, this.props.show.name),
        React.DOM.ul(null, 
          React.DOM.li(null, "Seasons: ", this.props.show.number_of_seasons),
          React.DOM.li(null, "Episodes: ", this.props.show.number_of_episodes),
          React.DOM.li(null, this.props.show.overview)
        ),
        React.DOM.div(null, 
          this.props.show.seasons.map(function(season) {
            return (
              React.DOM.div(null, "Season ", season.season_number)
            );
          })
        )
      )
    );
  },
});