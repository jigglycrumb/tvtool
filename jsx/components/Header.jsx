/** @jsx React.DOM */
var Header = React.createClass({
  render: function() {
    return (
      <header className="page-header">
        <div className="backdrop"></div>
        <div className="backdrop-overlay"></div>
        <h1 className="row">
          <span className="col-xs-10 col-xs-offset-1">
            episode helper<br />
            <small>rename your TV show episodes easier.</small>
          </span>
        </h1>
      </header>
    );
  }
});