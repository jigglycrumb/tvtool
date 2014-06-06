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
  getInitialState: function() {
    return {
      clipboard: null,
    }
  },
  render: function() {

    var notice = 'Press Ctrl+C to copy',
        isMac = navigator.platform.toUpperCase().indexOf('MAC') !== -1;

    if(isMac) notice = 'Press Cmd+C to copy';
    if(this.isFlash()) notice = 'Click to copy';

    return (
      React.DOM.tr( {onMouseOver:this.mouseover, onMouseOut:this.mouseout, onKeyDown:this.keydown}, 
        React.DOM.td( {className:"col-xs-3 text-right"}, 
          React.DOM.small( {ref:"notice", className:"copy-notice"}, React.DOM.em( {className:"text-muted"}, notice))
        ),
        React.DOM.td( {className:"col-xs-8"}, 
          React.DOM.input( {ref:"name", className:"episode form-control", type:"text", value:this.props.name, readOnly:true} )
        ),
        React.DOM.td( {className:"col-xs-1"}, 
          React.DOM.span( {ref:"iconOk", className:"glyphicon glyphicon-ok copy-ok"} )
        )
      )
    );
  },
  componentDidMount: function() {
    if(ZeroClipboard.isFlashUnusable() === false) {
      var self = this,
          client = new ZeroClipboard(this.getDOMNode());

      client.on('ready', function(event) {

        client.clip(self.getDOMNode());

        client.on('copy', function(event) {
          event.clipboardData.setData('text/plain', self.refs.name.getDOMNode().value);
        });

        client.on('aftercopy', function(event) {
          self.markOk();
        });
      });

      this.setState({clipboard: client});
    }

    update.add(this.unmark);
  },
  componentWillUnmount: function() {
    update.remove(this.unmark);
  },
  mouseover: function() {
    [].forEach.call(document.querySelectorAll('.copy-notice'), function(el) { el.style.display = 'none'; });
    this.refs.notice.getDOMNode().style.display = 'inline';
    if(!this.isFlash()) {
      this.refs.name.getDOMNode().focus();
      this.refs.name.getDOMNode().select();
    }
  },
  keydown: function(e) {
    if(this.isFlash()) return false;
    var c = 67;
    if(e.keyCode == 67 && (e.metaKey == true || e.ctrlKey == true)) {
      // user pressed ctrl+c, cmd+c
      this.markOk();
    }
  },
  markOk: function() {
    this.refs.iconOk.getDOMNode().style.display = 'inline';
    this.getDOMNode().classList.add('success', 'has-success');
  },
  unmark: function() {
    this.refs.iconOk.getDOMNode().style.display = 'none';
    this.getDOMNode().classList.remove('success', 'has-success');
  },
  isFlash: function() {
    return this.state.clipboard instanceof ZeroClipboard;
  },
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
              React.DOM.th( {className:"col-xs-1"}, 
                React.DOM.span( {className:"glyphicon glyphicon-info-sign h4 blue", onClick:this.toggleFormatHelp})
              )
            ),
            React.DOM.tr( {ref:"formatHelp", style:{display: 'none'}}, 
              React.DOM.th( {className:"col-xs-3"}, " "),
              React.DOM.th( {className:"col-xs-8"}, 
                React.DOM.div( {className:"alert alert-info"}, 
                  React.DOM.ul( {className:"flat help-text"}, 
                    React.DOM.li(null, React.DOM.p(null, "The field above controls how the episode names are formatted. You can use these variables to insert episode data:")),
                    React.DOM.li(null, React.DOM.a( {className:"pointer", onClick:this.insertVariable}, "(show)"), " The name of the show"),
                    React.DOM.li(null, React.DOM.a( {className:"pointer", onClick:this.insertVariable}, "(season)"), " The season number"),
                    React.DOM.li(null, React.DOM.a( {className:"pointer", onClick:this.insertVariable}, "(episode)"), " The episode number"),
                    React.DOM.li(null, React.DOM.a( {className:"pointer", onClick:this.insertVariable}, "(title)"), " The episode name"),
                    React.DOM.li(null, React.DOM.p(null, React.DOM.br(null),"Hit return to refresh the episode list when finished!"))
                  )
                )
              ),
              React.DOM.th( {className:"col-xs-1"}, " ")
            )
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

    function zerofill(index, number) {
      if(self.props.app.zerofill[index] > 0) {
        var pad = "", len = (""+number).length;
        for(var i=0; i<(self.props.app.zerofill[index]-len+1); i++) pad += "0";
        number = pad+number;
      }
      return number;
    };

    dict.season = zerofill(0, dict.season);

    function replace(text) {
      text = text.replace(new RegExp("[(]([a-z ]*)[)]", "gim"), function(a, b) {
        return dict[b.toLowerCase()] || a;
      });
      return text;
    }

    function replaceSpaces(text) {
      text = text.replace(new RegExp("( )", "gim"), function(a, b) {
        return self.props.app.space;
      });
      return text;
    }

    function cutSpacesAndCapitalize(text) {
      text = text.replace(new RegExp("( [a-z*])", "gim"), function(a, b) {
        return a.charAt(1).toUpperCase();
      });
      return text;
    }

    function buildEpisodeName(episode) {
      dict.episode = zerofill(1, episode.episode_number);
      dict.title = episode.name;
      var ep = replace(self.props.app.format);
      if(self.props.app.space === '') ep = cutSpacesAndCapitalize(ep);
      ep = replaceSpaces(ep);
      episodes.push(ep);
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

  insertVariable: function(e) {
    var text = e.target.innerHTML,
        formatString = document.getElementById('episode-format').value;

    AppState.app.format = formatString + text;
    document.getElementById('episode-format').value = AppState.app.format;
    AppState.update();
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
      query: '',
      results: [], // search results for display list
    }
  },
  render: function() {

    var results = '',
        tvshow = '';

    if(this.props.app.show === null && this.state.results.length > 0) {
      results = React.DOM.ul( {className:"list-inline"}, 
                  this.state.results.map(function(result) {
                    var img = '';
                    if(result.poster_path === null) img = React.DOM.div( {className:"img-thumbnail text-center no-poster-search-result", title:result.original_name}, React.DOM.p(null, result.original_name))
                    else img = React.DOM.img( {alt:result.original_name, className:"img-thumbnail", src:theMovieDb.common.images_uri + 'w90' + result.poster_path, title:result.original_name} )
                    return (
                      React.DOM.li( {key:result.id,
                        className:"search-result",
                        onMouseOver:this.setBackdrop.bind(this, result.backdrop_path),
                        onClick:this.selectShow.bind(this, result.id)}, 
                          img
                      )
                    )
                  }, this)
                )
    }
    else if(this.props.app.show === null && this.state.results.length === 0 && this.state.query.length > 0) {
      results = React.DOM.p( {className:"alert alert-info"}, "No shows found. Please enter the full name of the show you are looking for.")
    }

    if(this.props.app.show !== null) {
      tvshow = TvShow( {app:this.props.app} )
    }

    return (
      React.DOM.div(null, 
        React.DOM.div( {className:"row"}, 
          React.DOM.div( {className:"col-xs-10 col-xs-offset-1"}, 
            React.DOM.div( {className:"search-bar input-group input-group-lg"}, 
              React.DOM.span( {className:"input-group-addon"}, 
                React.DOM.span( {className:"glyphicon glyphicon-search"})
              ),
              React.DOM.input(
                {ref:"searchInput",
                type:"text",
                className:"form-control",
                placeholder:"TV show",
                defaultValue:"", 
                onChange:this.getResults,
                onKeyDown:this.checkReturn} )
            ),
            results
          )
        ),
        tvshow
      )
    );
  },
  getResults: function(e) {
    var query = e.target.value;
    this.setState({query: query});
    AppState.app.show = null;
    AppState.update();
    document.querySelector('.backdrop').style.backgroundImage = 'none';
    if(query.length > 1) {
      query = encodeURIComponent(query);
      theMovieDb.search.getTv({"query":query}, this.showResults, this.showError);
    }
    else this.setState(this.getInitialState());
  },
  showResults: function(json) {
    json = JSON.parse(json);
    this.setState({results: json.results});
  },
  showError: function(json) {
    json = JSON.parse(json);
    console.log('Search.showError', json);
  },
  checkReturn: function(e) {
    var query = e.target.value;
    if(e.nativeEvent.keyCode == 13) {
      if(this.state.results.length == 1) this.selectShow(this.state.results[0].id);
    }
  },
  selectShow: function(id) {
    AppState.app.show = id;
    AppState.app.season = 1;
    AppState.app.language = 'en';
    AppState.update();
    this.refs.searchInput.getDOMNode().value = '';
  },
  setBackdrop: function(backdrop) {
    if(backdrop === null) document.querySelector('.backdrop').style.backgroundImage = 'none';
    else {
      var url = theMovieDb.common.images_uri + 'w1000' + backdrop;
      document.querySelector('.backdrop').style.backgroundImage = 'url('+url+')';
    }
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
  getInitialState: function() {
    return {
      show: null, // show data from API
      translations: [], // translation data from API
    }
  },
  render: function() {
    if(this.state.show !== null) {
      var backdrop = false,
          poster = false;

      if(this.state.show.backdrop_path != null)
        backdrop = theMovieDb.common.images_uri + 'w1000' + this.state.show.backdrop_path;
      if(this.state.show.poster_path != null)
          poster = theMovieDb.common.images_uri + 'w150' + this.state.show.poster_path;

      if(backdrop) document.querySelector('.backdrop').style.backgroundImage = 'url('+backdrop+')';

      var posterStr = React.DOM.div( {className:"img-thumbnail text-center"}, React.DOM.p( {className:"no-poster"}, "No poster available"))
      if(poster) posterStr = React.DOM.img( {alt:"Show poster", className:"img-thumbnail show-poster", src:poster} )

      return (
        React.DOM.div(null, 
          React.DOM.div( {className:"row"}, 
            React.DOM.div( {className:"col-xs-3 text-right"}, 
              posterStr
            ),
            React.DOM.div( {className:"col-xs-9"}, 
              React.DOM.h2(null, this.state.show.name),
              React.DOM.ul( {className:"flat"}, 
                React.DOM.li(null, 
                  React.DOM.strong(null, this.state.show.number_of_seasons, " seasons, ", this.state.show.number_of_episodes, " episodes")
                ),
                React.DOM.li(null, this.state.show.overview)
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
                this.state.translations.map(function(translation) {
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
                this.state.show.seasons.map(function(season) {
                  if(season.season_number > 0) {
                    var active = (this.props.app.season == season.season_number) ? true : false;
                    return (
                      TvShowSeason( {key:season.season_number, show:this.state.show, season:season, language:this.props.app.language, active:active} )
                    )
                  }
                }, this)
              )
            )
          ),
          React.DOM.div( {className:"row"}, 
            React.DOM.div( {className:"col-xs-3 text-right"}, 
              React.DOM.h5(null, "Zerofill")
            ),
            React.DOM.div( {className:"col-xs-1"}, 
              React.DOM.span( {className:"h5 zerofill-label"}, "Season")
            ),
            React.DOM.div( {className:"col-xs-2"}, 
              React.DOM.input( {type:"number", min:"0", max:"3", className:"form-control", defaultValue:this.props.app.zerofill[0], onChange:this.setZerofill.bind(this, 0)} )
            ),
            React.DOM.div( {className:"col-xs-1"}, 
              React.DOM.span( {className:"h5 zerofill-label"}, "Episode")
            ),
            React.DOM.div( {className:"col-xs-2"}, 
              React.DOM.input( {type:"number", min:"0", max:"3", className:"form-control", defaultValue:this.props.app.zerofill[1], onChange:this.setZerofill.bind(this, 1)} )
            ),
            React.DOM.div( {className:"col-xs-3"}, 
              React.DOM.span( {className:"glyphicon glyphicon-info-sign h4 blue", onClick:this.toggleZerofillHelp, style:{position: 'relative', top: '-.1em', left: '-1em'}})
            ),
            React.DOM.div( {ref:"zerofillHelp", className:"col-xs-8 col-xs-offset-3", style:{display: 'none'}}, 
              React.DOM.div( {className:"alert alert-info help-text"}, 
                "Zerofill adds leading zeroes to episode and season numbers."
              )
            )
          ),

          React.DOM.div( {className:"row"}, 
            React.DOM.div( {className:"col-xs-3 text-right"}, 
              React.DOM.h5(null, "Replace spaces with")
            ),
            React.DOM.div( {className:"col-xs-2"}, 
              React.DOM.input( {type:"text", className:"form-control", maxLength:"1", defaultValue:this.props.app.space, onChange:this.setSpaceReplacement} )
            ),
            React.DOM.div( {className:"col-xs-9"}

            )
          ),

          Episodes( {show:this.state.show, app:this.props.app} )
        )
      );
    }
    else return (React.DOM.span(null ));
  },
  componentDidMount: function() {
    this.loadShow(this.props.app.show);
  },
  componentWillReceiveProps: function(nextProps) {
    if(this.isMounted()) {
      this.loadShow(nextProps.app.show);
    }
  },
  loadShow: function(id) {
    if(id !== null) {
      theMovieDb.tv.getById({"id": id}, this.showShow, this.showError);
      theMovieDb.tv.getTranslations({"id": id}, this.showTranslations, this.showError);
    }
    else this.setState(this.getInitialState());
  },
  showTranslations: function(json) {
    json = JSON.parse(json);
    this.setState({translations: json.translations});
  },
  showShow: function(json) {
    json = JSON.parse(json);
    this.setState({show: json});
  },
  showError: function(json) {
    json = JSON.parse(json);
    console.log('TvShow.showError', json);
  },
  setZerofill: function(index, e) {
    var zf = AppState.app.zerofill,
        value = parseInt(e.target.value);
    if(index == 0) AppState.app.zerofill = [value, zf[1]];
    else if(index == 1) AppState.app.zerofill = [zf[0], value];
    AppState.update();
  },
  setSpaceReplacement: function(e) {
    var space = e.target.value;
    AppState.app.space = space;
    AppState.update();
    //console.log(space);
  },
  toggleZerofillHelp: function() {
    var visible = this.refs.zerofillHelp.getDOMNode().style.display == 'none' ? false : true;
    if(visible) this.refs.zerofillHelp.getDOMNode().style.display = 'none';
    else this.refs.zerofillHelp.getDOMNode().style.display = 'table-row';
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