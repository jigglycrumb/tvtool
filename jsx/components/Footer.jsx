/** @jsx React.DOM */
var Footer = React.createClass({
  render: function() {
    return (
      <footer className="row text-center text-muted">
        <div className="col-xs-12">
          <Social />
        </div>
        <p className="col-xs-12">This product uses the TMDb API but is not endorsed or certified by TMDb.</p>
      </footer>
    );
  },
});