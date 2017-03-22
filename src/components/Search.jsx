import React from 'react';
import ReactDOM from 'react-dom';
import AppState from '../lib/AppState';
import theMovieDb from 'themoviedb-javascript-library';
import TvShow from './TvShow';

export default class Search extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      query: '',
      results: [], // search results for display list
    };

    this.getResults = this.getResults.bind(this);
    this.showResults = this.showResults.bind(this);

    console.log(theMovieDb.common);
  }

  render() {

    let results = '',
        tvshow = '';

    if(this.props.app.show === null && this.state.results.length > 0) {
      results = <ul className="list-inline">
                  {this.state.results.map(function(result) {
                    var img = '';
                    if(result.poster_path === null) img = <div className="img-thumbnail text-center no-poster-search-result" title={result.original_name}><p>{result.original_name}</p></div>;
                    else img = <img alt={result.original_name} className="img-thumbnail" src={theMovieDb.common.images_uri + 'w90' + result.poster_path} title={result.original_name} />;
                    return (
                      <li key={result.id}
                        className="search-result"
                        onMouseOver={this.setBackdrop.bind(this, result.backdrop_path)}
                        onClick={this.selectShow.bind(this, result.id)}>
                          {img}
                      </li>
                    );
                  }, this)}
                </ul>;
    }
    else if(this.props.app.show === null && this.state.results.length === 0 && this.state.query.length > 0) {
      results = <p className="alert alert-info">No shows found. Please enter the full name of the show you are looking for.</p>;
    }

    if(this.props.app.show !== null) {
      tvshow = <TvShow app={this.props.app} />;
    }

    return (
      <div>
        <div className="row">
          <div className="col-xs-10 col-xs-offset-1">
            <div className="search-bar input-group input-group-lg">
              <span className="input-group-addon">
                <span className="glyphicon glyphicon-search"></span>
              </span>
              <input
                ref="searchInput"
                type="text"
                className="form-control"
                placeholder="TV show"
                defaultValue=""
                onChange={this.getResults}
                onKeyDown={this.checkReturn} />
            </div>
            {results}
          </div>
        </div>
        {tvshow}
      </div>
    );
  }

  getResults(e) {
    var query = e.target.value;
    this.setState({query: query});
    AppState.app.show = null;
    AppState.update();
    document.querySelector('.backdrop').style.backgroundImage = 'none';
    if(query.length > 1) {
      query = encodeURIComponent(query);
      theMovieDb.search.getTv({"query":query}, this.showResults, this.showError);
    }
    else this.setState({
      query: '',
      results: []
    });
  }

  checkReturn(e) {
    var query = e.target.value;
    if(e.nativeEvent.keyCode == 13) {
      if(this.state.results.length == 1) this.selectShow(this.state.results[0].id);
    }
  }

  showResults(json) {
    json = JSON.parse(json);
    this.setState({results: json.results});
  }

  showError(json) {
    json = JSON.parse(json);
    console.log('Search.showError', json);
  }

  selectShow(id) {
    AppState.app.show = id;
    AppState.app.season = 1;
    AppState.app.language = 'en';
    AppState.update();
    ReactDOM.findDOMNode(this.refs.searchInput).value = '';
  }

  setBackdrop(backdrop) {
    if(backdrop === null) document.querySelector('.backdrop').style.backgroundImage = 'none';
    else {
      var url = theMovieDb.common.images_uri + 'w1000' + backdrop;
      document.querySelector('.backdrop').style.backgroundImage = 'url('+url+')';
    }
  }
}
