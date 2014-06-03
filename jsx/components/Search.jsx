/** @jsx React.DOM */
var Search = React.createClass({
  getInitialState: function() {
    return {
      show: {},
      translations: []
    }
  },
  render: function() {
    return (
      <div>
        <div className="row">
          <div className="col-xs-10 col-xs-offset-1">
            <div className="search-bar input-group input-group-lg">
              <span className="input-group-addon">
                <span className="glyphicon glyphicon-search"></span>
              </span>
              <input type="text" className="form-control" placeholder="TV show" defaultValue={this.props.app.query} onChange={this.updateQuery} />
            </div>
          </div>
        </div>
        <TvShow show={this.state.show} translations={this.state.translations} app={this.props.app} />
      </div>
    );
  },
  componentDidMount: function() {
    var query = this.props.app.query;
    if(query.length > 1) this.searchByQuery(query);
  },
  componentWillReceiveProps: function(nextProps) {
    var query = nextProps.app.query;
    if(query.length > 1) this.searchByQuery(query);
  },
  updateQuery: function(e) {
    AppState.app.query = e.target.value;
    AppState.update();
  },
  searchByQuery: function(query) {
    this.setState(this.getInitialState());
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