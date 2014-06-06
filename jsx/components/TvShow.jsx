/** @jsx React.DOM */
var TvShow = React.createClass({
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

      var posterStr = <div className="img-thumbnail text-center"><p className="no-poster">No poster available</p></div>
      if(poster) posterStr = <img alt="Show poster" className="img-thumbnail show-poster" src={poster} />

      return (
        <div>
          <div className="row">
            <div className="col-xs-3 text-right">
              {posterStr}
            </div>
            <div className="col-xs-9">
              <h2>{this.state.show.name}</h2>
              <ul className="flat">
                <li>
                  <strong>{this.state.show.number_of_seasons} seasons, {this.state.show.number_of_episodes} episodes</strong>
                </li>
                <li>{this.state.show.overview}</li>
              </ul>
            </div>
          </div>
          <br /><br />
          <div className="row">
            <div className="col-xs-3 text-right">
              <h4>Select a language</h4>
            </div>
            <div className="col-xs-9">
              <div className="btn-group btn-group-md">
                {this.state.translations.map(function(translation) {
                  var active = (this.props.app.language == translation.iso_639_1) ? true : false;
                  return (
                    <TvShowLanguage key={translation.iso_639_1} translation={translation} active={active} />
                  )
                }, this)}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-3 text-right">
              <h4>Select a season</h4>
            </div>
            <div className="col-xs-9">
              <div className="btn-group btn-group-md">
                {this.state.show.seasons.map(function(season) {
                  if(season.season_number > 0) {
                    var active = (this.props.app.season == season.season_number) ? true : false;
                    return (
                      <TvShowSeason key={season.season_number} show={this.state.show} season={season} language={this.props.app.language} active={active} />
                    )
                  }
                }, this)}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-3 text-right">
              <h5>Zerofill</h5>
            </div>
            <div className="col-xs-1">
              <span className="h5 zerofill-label">Season</span>
            </div>
            <div className="col-xs-2">
              <input type="number" min="0" max="3" className="form-control" defaultValue={this.props.app.zerofill[0]} onChange={this.setZerofill.bind(this, 0)} />
            </div>
            <div className="col-xs-1">
              <span className="h5 zerofill-label">Episode</span>
            </div>
            <div className="col-xs-2">
              <input type="number" min="0" max="3" className="form-control" defaultValue={this.props.app.zerofill[1]} onChange={this.setZerofill.bind(this, 1)} />
            </div>
            <div className="col-xs-3">
              <span className="glyphicon glyphicon-info-sign h4 blue" onClick={this.toggleZerofillHelp} style={{position: 'relative', top: '-.1em', left: '-1em'}}></span>
            </div>
            <div ref="zerofillHelp" className="col-xs-8 col-xs-offset-3" style={{display: 'none'}}>
              <div className="alert alert-info help-text">
                Zerofill adds leading zeroes to episode and season numbers.
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-xs-3 text-right">
              <h5>Replace spaces with</h5>
            </div>
            <div className="col-xs-2">
              <input type="text" className="form-control" maxLength="1" defaultValue={this.props.app.space} onChange={this.setSpaceReplacement} />
            </div>
            <div className="col-xs-9">

            </div>
          </div>

          <Episodes show={this.state.show} app={this.props.app} />
        </div>
      );
    }
    else return (<span />);
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