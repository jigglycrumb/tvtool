/** @jsx React.DOM */
var App = React.createClass({
  render: function() {
    return (
      <div className="app container">
        <Header />
        <Search app={this.props.app} />
        <Footer />
      </div>
    );
  },
  componentDidMount: function() {
    update.add(this.updateProps);
  },
  updateProps: function() {
    this.setProps({app: AppState.app});
  },
});
