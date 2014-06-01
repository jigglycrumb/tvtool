/** @jsx React.DOM */
var App = React.createClass({
  render: function() {
    return (
      <div id="App">
        <Header />
        <Search />
        <div id="TvShowContainer"></div>
        <div id="EpisodeListContainer"></div>
        <Footer />
      </div>
    );
  }
});