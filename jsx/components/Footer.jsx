/** @jsx React.DOM */
var Footer = React.createClass({
  render: function() {
    return (
      <footer className="row text-center text-muted">
        <div className="col-xs-12">
          <Social />
        </div>
        <p className="col-xs-12">This product uses the <a href="http://www.themoviedb.org/" target="_blank">TMDb</a> API but is not endorsed or certified by <a href="http://www.themoviedb.org/" target="_blank">TMDb</a>.</p>
        <p className="col-xs-12">&copy; <a href="http://hpcodecraft.me">hpcodecraft</a> 2014</p>
      </footer>
    );
  },
});