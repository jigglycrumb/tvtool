/** @jsx React.DOM */
var Episodes = React.createClass({
  getInitialState: function() {
    return {
      episodes: []
    }
  },
  render: function() {
    return (
      <div className="row">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th className="col-xs-3 text-right">
                <h4>Episode format</h4>
              </th>
              <th className="col-xs-8">
                <input
                  id="episode-format"
                  ref="format"
                  type="text"
                  className="form-control"
                  defaultValue={this.props.app.format}
                  onKeyDown={this.checkReturn}
                  onChange={this.updateFormat}
                  onBlur={AppState.update} />
              </th>
              <th className="col-xs-1">
                <span className="glyphicon glyphicon-info-sign h4 blue" onClick={this.toggleFormatHelp}></span>
              </th>
            </tr>
            <tr ref="formatHelp" style={{display: 'none'}}>
              <th className="col-xs-3">&nbsp;</th>
              <th className="col-xs-8">
                <div className="alert alert-info">
                  <ul className="flat help-text">
                    <li><p>The field above controls how the episode names are formatted. You can use these variables to insert episode data:</p></li>
                    <li><a className="pointer" onClick={this.insertVariable}>(show)</a> The name of the show</li>
                    <li><a className="pointer" onClick={this.insertVariable}>(season)</a> The season number</li>
                    <li><a className="pointer" onClick={this.insertVariable}>(episode)</a> The episode number</li>
                    <li><a className="pointer" onClick={this.insertVariable}>(title)</a> The episode name</li>
                    <li><p><br/>Hit return to refresh the episode list when finished!</p></li>
                  </ul>
                </div>
              </th>
              <th className="col-xs-1">&nbsp;</th>
            </tr>
          </thead>
          <tbody>
          {this.state.episodes.map(function(episode, index) {
            return (
              <Episode key={index} name={episode} />
            )
          }, this)}
          </tbody>
        </table>
      </div>
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