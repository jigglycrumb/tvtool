/** @jsx React.DOM */
var Search = React.createClass({
  render: function() {
    return (
      <div>
        <input type="search" placeholder="Enter a TV show" onChange={this.search} />
        <span ref="searchResults"></span>
      </div>
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
    React.renderComponent(<TvShow show={json} />, document.getElementById('TvShowContainer'));
  },
});