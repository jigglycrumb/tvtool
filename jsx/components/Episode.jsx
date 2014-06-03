/** @jsx React.DOM */
var Episode = React.createClass({
  render: function() {

    var notice = 'Press Ctrl+C to copy',
        isMac = navigator.platform.toUpperCase().indexOf('MAC') !== -1;

    if(isMac) notice = 'Press Cmd+C to copy';

    return (
      <tr onMouseOver={this.mouseover} onMouseOut={this.mouseout}>
        <td className="col-xs-3 text-right">
          <small ref="notice" className="copy-notice"><em className="text-muted">{notice}</em></small>
        </td>
        <td className="col-xs-9">
          <input ref="name" className="episode form-control" type="text" value={this.props.name} readOnly />
        </td>
      </tr>
    );
  },
  mouseover: function() {
    this.refs.notice.getDOMNode().style.display = 'inline';
    this.refs.name.getDOMNode().focus();
    this.refs.name.getDOMNode().select();
  },
  mouseout: function() {
    this.refs.notice.getDOMNode().style.display = 'none';
  }
});