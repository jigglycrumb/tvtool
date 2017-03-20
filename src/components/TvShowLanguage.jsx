/** @jsx React.DOM */
var TvShowLanguage = React.createClass({
  render: function() {
    var cx = React.addons.classSet;
    var classes = cx({
      'btn': true,
      'btn-default': true,
      'active': this.props.active
    });
    return (
      <button type="button" className={classes} onClick={this.changeLanguage}>{this.props.translation.english_name}</button>
    )
  },
  changeLanguage: function() {
    var language = this.props.translation.iso_639_1;
    AppState.app.language = language;
    AppState.update();
  },
});