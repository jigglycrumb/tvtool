/** @jsx React.DOM */
var App = React.createClass({displayName: 'App',
  render: function() {
    return (
      React.DOM.div( {className:"app container"}, 
        Header(null ),
        Search( {app:this.props.app} ),
        Footer(null )
      )
    );
  },
  componentDidMount: function() {
    update.add(this.updateProps);
  },
  updateProps: function() {
    this.setProps({app: AppState.app});
  },
});
/** @jsx React.DOM */
var Episode = React.createClass({displayName: 'Episode',
  render: function() {

    var notice = 'Press Ctrl+C to copy',
        isMac = navigator.platform.toUpperCase().indexOf('MAC') !== -1;

    if(isMac) notice = 'Press Cmd+C to copy';

    return (
      React.DOM.tr( {onMouseOver:this.mouseover, onMouseOut:this.mouseout}, 
        React.DOM.td( {className:"col-xs-3 text-right"}, 
          React.DOM.small( {ref:"notice", className:"copy-notice"}, React.DOM.em( {className:"text-muted"}, notice))
        ),
        React.DOM.td( {className:"col-xs-8"}, 
          React.DOM.input( {ref:"name", className:"episode form-control", type:"text", value:this.props.name, readOnly:true} )
        ),
        React.DOM.td( {className:"col-xs-1"}
        )
      )
    );
  },
  mouseover: function() {
    this.refs.notice.getDOMNode().style.display = 'inline';
    this.refs.name.getDOMNode().focus();
    this.refs.name.getDOMNode().select();
  },
  mouseout: function() {
    this.refs.notice.getDOMNode().style.display = 'none';
  }
});
/** @jsx React.DOM */
var Episodes = React.createClass({displayName: 'Episodes',
  getInitialState: function() {
    return {
      episodes: []
    }
  },
  render: function() {
    return (
      React.DOM.div( {className:"row"}, 
        React.DOM.table( {className:"table table-striped table-hover"}, 
          React.DOM.thead(null, 
            React.DOM.tr(null, 
              React.DOM.th( {className:"col-xs-3 text-right"}, 
                React.DOM.h4(null, "Episode format")
              ),
              React.DOM.th( {className:"col-xs-8"}, 
                React.DOM.input(
                  {id:"episode-format",
                  ref:"format",
                  type:"text",
                  className:"form-control",
                  defaultValue:this.props.app.format,
                  onKeyDown:this.checkReturn,
                  onChange:this.updateFormat,
                  onBlur:AppState.update} )
              ),
              React.DOM.th( {className:"col-xs-8"}, 
                React.DOM.span( {className:"glyphicon glyphicon-info-sign h4", onClick:this.toggleFormatHelp})
              )
            ),
            FormatHelp( {ref:"formatHelp", style:{display: 'none'}})
          ),
          React.DOM.tbody(null, 
          this.state.episodes.map(function(episode, index) {
            return (
              Episode( {key:index, name:episode} )
            )
          }, this)
          )
        )
      )
    );
  },

  componentDidMount: function() {
    theMovieDb.tvSeasons.getById({
      "id":this.props.show.id,
      "season_number": this.props.app.season,
      "language": this.props.app.language
    }, this.showEpisodes, this.showError);
  },

  componentWillReceiveProps: function(nextProps) {
    theMovieDb.tvSeasons.getById({
      "id": nextProps.show.id,
      "season_number": nextProps.app.season,
      "language": nextProps.app.language
    }, this.showEpisodes, this.showError);
  },

  showEpisodes: function(json) {
    json = JSON.parse(json);
    var self = this,
        episodes = [],
        dict = {
          'show': this.props.show.name,
          'season': this.props.app.season,
        };

    function zerofill(number) {
      if(self.props.app.zerofill > 0) {
        var pad = "", len = (""+number).length;
        for(var i=0; i<(self.props.app.zerofill-len+1); i++) pad += "0";
        number = pad+number;
      }
      return number;
    };

    dict.season = zerofill(dict.season);

    function replace( text ) {
      text = text.replace(new RegExp("[(]([a-z ]*)[)]", "gim"), function(a, b) {
        return dict[b.toLowerCase()] || a;
      });
      return text;
    }

    function buildEpisodeName(episode) {
      dict.episode = zerofill(episode.episode_number);
      dict.title = episode.name;
      episodes.push(replace(self.props.app.format));
    }

    json.episodes.forEach(function(episode) {
      buildEpisodeName(episode);
    });

    this.setState({episodes: episodes});
  },

  showError: function(json) {
    json = JSON.parse(json);
    console.log('Episodes.showError', json);
  },

  checkReturn: function(e) {
    var format = e.target.value;
    AppState.app.format = format;
    if(e.nativeEvent.keyCode == 13) AppState.update();
  },

  updateFormat: function(e) {
    var format = e.target.value;
    AppState.app.format = format;
  },

  toggleFormatHelp: function() {
    var visible = this.refs.formatHelp.getDOMNode().style.display == 'none' ? false : true;
    if(visible) this.refs.formatHelp.getDOMNode().style.display = 'none';
    else this.refs.formatHelp.getDOMNode().style.display = 'table-row';
  },
});
/** @jsx React.DOM */
var Footer = React.createClass({displayName: 'Footer',
  render: function() {
    return (
      React.DOM.footer( {className:"row text-center text-muted"}, 
        React.DOM.div( {className:"col-xs-12"}, 
          Social(null )
        ),
        React.DOM.p( {className:"col-xs-12"}, "This product uses the ", React.DOM.a( {href:"http://www.themoviedb.org/", target:"_blank"}, "TMDb"), " API but is not endorsed or certified by ", React.DOM.a( {href:"http://www.themoviedb.org/", target:"_blank"}, "TMDb"),"."),
        React.DOM.p( {className:"col-xs-12"}, "© ", React.DOM.a( {href:"http://hpcodecraft.me"}, "hpcodecraft"), " 2014")
      )
    );
  },
});
/** @jsx React.DOM */
var FormatHelp = React.createClass({displayName: 'FormatHelp',
  render: function() {
    return (
      React.DOM.tr( {style:this.props.style}, 
        React.DOM.th(null, " "),
        React.DOM.th(null, 
          React.DOM.div( {className:"well"}, 
            React.DOM.ul( {className:"flat help-text"}, 
              React.DOM.li(null, React.DOM.p(null, "The field above controls how the episode names are formatted. You can use these variables to insert episode data:")),
              React.DOM.li(null, React.DOM.a( {className:"pointer", onClick:this.insertVariable}, "(show)"), " The name of the show"),
              React.DOM.li(null, React.DOM.a( {className:"pointer", onClick:this.insertVariable}, "(season)"), " The season number"),
              React.DOM.li(null, React.DOM.a( {className:"pointer", onClick:this.insertVariable}, "(episode)"), " The episode number"),
              React.DOM.li(null, React.DOM.a( {className:"pointer", onClick:this.insertVariable}, "(title)"), " The episode name")
            )
          )
        ),
        React.DOM.th(null, " ")
      )
    )
  },
  insertVariable: function(e) {
    var text = e.target.innerHTML,
        formatString = document.getElementById('episode-format').value;

    AppState.app.format = formatString + text;
    AppState.update();
  }
});
/** @jsx React.DOM */
var Header = React.createClass({displayName: 'Header',
  render: function() {
    return (
      React.DOM.header( {className:"page-header"}, 
        React.DOM.div( {className:"backdrop"}),
        React.DOM.div( {className:"backdrop-overlay"}),
        React.DOM.h1( {className:"row"}, 
          React.DOM.span( {className:"col-xs-10 col-xs-offset-1"}, 
            "episode helper",React.DOM.br(null ),
            React.DOM.small(null, "rename your TV show episodes easier.")
          )
        )
      )
    );
  }
});
/** @jsx React.DOM */
var Search = React.createClass({displayName: 'Search',
  getInitialState: function() {
    return {
      show: {},
      translations: []
    }
  },
  render: function() {
    return (
      React.DOM.div(null, 
        React.DOM.div( {className:"row"}, 
          React.DOM.div( {className:"col-xs-10 col-xs-offset-1"}, 
            React.DOM.div( {className:"search-bar input-group input-group-lg"}, 
              React.DOM.span( {className:"input-group-addon"}, 
                React.DOM.span( {className:"glyphicon glyphicon-search"})
              ),
              React.DOM.input( {type:"text", className:"form-control", placeholder:"TV show", defaultValue:this.props.app.query, onChange:this.updateQuery} )
            )
          )
        ),
        TvShow( {show:this.state.show, translations:this.state.translations, app:this.props.app} )
      )
    );
  },
  componentDidMount: function() {
    var query = this.props.app.query;
    if(query.length > 1) this.searchByQuery(query);
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState(this.getInitialState());
    var query = nextProps.app.query;
    if(query.length > 1) this.searchByQuery(query);
  },
  updateQuery: function(e) {
    AppState.app.query = e.target.value;
    AppState.app.season = 1;
    AppState.app.language = 'en';
    AppState.update();
  },
  searchByQuery: function(query) {
    document.querySelector('.backdrop').style.backgroundImage = 'none';
    if(query.length > 1) {
      query = encodeURIComponent(query);
      theMovieDb.search.getTv({"query":query}, this.showResults, this.showError)
    }
  },
  showResults: function(json) {
    json = JSON.parse(json);
    if(json.total_results === 1) {
      theMovieDb.tv.getTranslations({"id":json.results[0].id}, this.loadTranslations, this.showError);
    }
  },
  loadTranslations: function(json) {
    json = JSON.parse(json);
    this.setState({translations: json.translations});
    theMovieDb.tv.getById({"id": json.id}, this.loadShow, this.showError);
  },
  loadShow: function(json) {
    json = JSON.parse(json);
    this.setState({show: json});
  },
  showError: function(json) {
    json = JSON.parse(json);
    console.log('Search.showError', json);
  },
});
/** @jsx React.DOM */
var Social = React.createClass({displayName: 'Social',
  render: function() {
    return (
      React.DOM.div( {className:"social"}, 
        React.DOM.div( {className:"addthis_toolbox addthis_default_style addthis_32x32_style"}, 
          React.DOM.a( {className:"addthis_button_flattr.com"}),
          React.DOM.a( {className:"addthis_button_preferred_1"}),
          React.DOM.a( {className:"addthis_button_preferred_2"}),
          React.DOM.a( {className:"addthis_button_preferred_3"}),
          React.DOM.a( {className:"addthis_button_compact"}),
          React.DOM.a( {className:"addthis_counter addthis_bubble_style"})
        )
      )
    );
  }
});
/** @jsx React.DOM */
var TvShow = React.createClass({displayName: 'TvShow',
  render: function() {
    if("undefined" !== typeof this.props.show.id) {
      var backdrop = false,
          poster = false;

      if(this.props.show.backdrop_path != null)
        backdrop = theMovieDb.common.images_uri + 'w1000' + this.props.show.backdrop_path;
      if(this.props.show.poster_path != null)
          poster = theMovieDb.common.images_uri + 'w150' + this.props.show.poster_path;

      if(backdrop) document.querySelector('.backdrop').style.backgroundImage = 'url('+backdrop+')';

      var posterStr = React.DOM.div( {className:"img-thumbnail text-center"}, React.DOM.p( {className:"no-poster"}, "No poster available"))
      if(poster) posterStr = React.DOM.img( {alt:"Show poster", className:"img-thumbnail", src:poster} )

      return (
        React.DOM.div(null, 
          React.DOM.div( {className:"row"}, 
            React.DOM.div( {className:"col-xs-3 text-right"}, 
              posterStr
            ),
            React.DOM.div( {className:"col-xs-9"}, 
              React.DOM.h2(null, this.props.show.name),
              React.DOM.ul( {className:"flat"}, 
                React.DOM.li(null, 
                  React.DOM.strong(null, this.props.show.number_of_seasons, " seasons, ", this.props.show.number_of_episodes, " episodes")
                ),
                React.DOM.li(null, this.props.show.overview)
              )
            )
          ),
          React.DOM.br(null ),React.DOM.br(null ),
          React.DOM.div( {className:"row"}, 
            React.DOM.div( {className:"col-xs-3 text-right"}, 
              React.DOM.h4(null, "Select a language")
            ),
            React.DOM.div( {className:"col-xs-9"}, 
              React.DOM.div( {className:"btn-group btn-group-md"}, 
                this.props.translations.map(function(translation) {
                  var active = (this.props.app.language == translation.iso_639_1) ? true : false;
                  return (
                    TvShowLanguage( {key:translation.iso_639_1, translation:translation, active:active} )
                  )
                }, this)
              )
            )
          ),
          React.DOM.div( {className:"row"}, 
            React.DOM.div( {className:"col-xs-3 text-right"}, 
              React.DOM.h4(null, "Select a season")
            ),
            React.DOM.div( {className:"col-xs-9"}, 
              React.DOM.div( {className:"btn-group btn-group-md"}, 
                this.props.show.seasons.map(function(season) {
                  if(season.season_number > 0) {
                    var active = (this.props.app.season == season.season_number) ? true : false;
                    return (
                      TvShowSeason( {key:season.season_number, show:this.props.show, season:season, language:this.props.app.language, active:active} )
                    )
                  }
                }, this)
              )
            )
          ),
          React.DOM.div( {className:"row"}, 
            React.DOM.div( {className:"col-xs-3 text-right"}, 
              React.DOM.h4(null, "Zerofill")
            ),
            React.DOM.div( {className:"col-xs-2"}, 
              React.DOM.input( {type:"number", min:"0", max:"5", className:"form-control", defaultValue:this.props.app.zerofill, onChange:this.setZerofill,  onBlur:AppState.update} )
            ),
            React.DOM.div( {className:"col-xs-7"}, 
              " "
            )
          ),
          Episodes( {show:this.props.show, app:this.props.app} )
        )
      );
    }
    else if(this.props.app.query.length > 0 ) {
      return (
        React.DOM.div( {className:"row"}, 
          React.DOM.div( {className:"col-xs-10 col-xs-offset-1 alert alert-info"}, 
            "Found no shows. Please type in the full name of the show you are looking for."
          )
        )
      )
    }
    else return (React.DOM.span(null ));
  },
  setZerofill: function(e) {
    var zerofill = e.target.value;
    AppState.app.zerofill = zerofill;
  },
});
/** @jsx React.DOM */
var TvShowLanguage = React.createClass({displayName: 'TvShowLanguage',
  render: function() {
    var cx = React.addons.classSet;
    var classes = cx({
      'btn': true,
      'btn-default': true,
      'active': this.props.active
    });
    return (
      React.DOM.button( {type:"button", className:classes, onClick:this.changeLanguage}, this.props.translation.english_name)
    )
  },
  changeLanguage: function() {
    var language = this.props.translation.iso_639_1;
    AppState.app.language = language;
    AppState.update();
  },
});
/** @jsx React.DOM */
var TvShowSeason = React.createClass({displayName: 'TvShowSeason',
  render: function() {
    var cx = React.addons.classSet;
    var classes = cx({
      'btn': true,
      'btn-default': true,
      'active': this.props.active
    });
    return (
      React.DOM.button( {type:"button", className:classes, onClick:this.changeSeason}, this.props.season.season_number)
    )
  },
  changeSeason: function() {
    var season = this.props.season.season_number;
    AppState.app.season = season;
    AppState.update();
  },
});