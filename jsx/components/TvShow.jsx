/** @jsx React.DOM */
var TvShow = React.createClass({
  render: function() {
    if("undefined" !== typeof this.props.show.id) {
      var backdrop = false,
          poster = false;

      if(this.props.show.backdrop_path != null)
        backdrop = theMovieDb.common.images_uri + 'w1000' + this.props.show.backdrop_path;
      if(this.props.show.poster_path != null)
          poster = theMovieDb.common.images_uri + 'w150' + this.props.show.poster_path;

      if(backdrop) document.querySelector('.backdrop').style.backgroundImage = 'url('+backdrop+')';

      return (
        <div>
          <div className="row">
            <div className="col-xs-3 text-right">
              <img alt="Show poster" className="img-thumbnail" src={poster} />
            </div>
            <div className="col-xs-9">
              <h2>{this.props.show.name}</h2>
              <ul className="flat">
                <li>
                  <strong>{this.props.show.number_of_seasons} seasons, {this.props.show.number_of_episodes} episodes</strong>
                </li>
                <li>{this.props.show.overview}</li>
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
                {this.props.translations.map(function(translation) {
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
                {this.props.show.seasons.map(function(season) {
                  if(season.season_number > 0) {
                    var active = (this.props.app.season == season.season_number) ? true : false;
                    return (
                      <TvShowSeason key={season.season_number} show={this.props.show} season={season} language={this.props.app.language} active={active} />
                    )
                  }
                }, this)}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-3 text-right">
              <h4>Zerofill</h4>
            </div>
            <div className="col-xs-2">
              <input type="number" min="0" max="5" className="form-control" defaultValue={this.props.app.zerofill} onChange={this.setZerofill}  onBlur={AppState.update} />
            </div>
            <div className="col-xs-7">
              &nbsp;
            </div>
          </div>
          <Episodes show={this.props.show} app={this.props.app} />
        </div>
      );
    }
    else if(this.props.app.query.length > 0 ) {
      return (
        <div className="row">
          <div className="col-xs-10 col-xs-offset-1 alert alert-info">
            Found no shows. Please type in the full name of the show you are looking for.
          </div>
        </div>
      )
    }
    else return (<span />);
  },
  setZerofill: function(e) {
    var zerofill = e.target.value;
    AppState.app.zerofill = zerofill;
  },
});