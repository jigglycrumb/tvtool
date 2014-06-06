/** @jsx React.DOM */
var Episode = React.createClass({
  getInitialState: function() {
    return {
      clipboard: null,
    }
  },
  render: function() {

    var notice = 'Press Ctrl+C to copy',
        isMac = navigator.platform.toUpperCase().indexOf('MAC') !== -1;

    if(isMac) notice = 'Press Cmd+C to copy';
    if(this.isFlash()) notice = 'Click to copy';

    return (
      <tr onMouseOver={this.mouseover} onMouseOut={this.mouseout} onKeyDown={this.keydown}>
        <td className="col-xs-3 text-right">
          <small ref="notice" className="copy-notice"><em className="text-muted">{notice}</em></small>
        </td>
        <td className="col-xs-8">
          <input ref="name" className="episode form-control" type="text" value={this.props.name} readOnly />
        </td>
        <td className="col-xs-1">
          <span ref="iconOk" className="glyphicon glyphicon-ok copy-ok" />
        </td>
      </tr>
    );
  },
  componentDidMount: function() {
    if(ZeroClipboard.isFlashUnusable() === false) {
      var self = this,
          client = new ZeroClipboard(this.getDOMNode());

      client.on('ready', function(event) {

        client.clip(self.getDOMNode());

        client.on('copy', function(event) {
          event.clipboardData.setData('text/plain', self.refs.name.getDOMNode().value);
        });

        client.on('aftercopy', function(event) {
          self.markOk();
        });
      });

      this.setState({clipboard: client});
    }

    update.add(this.unmark);
  },
  componentWillUnmount: function() {
    update.remove(this.unmark);
  },
  mouseover: function() {
    [].forEach.call(document.querySelectorAll('.copy-notice'), function(el) { el.style.display = 'none'; });
    this.refs.notice.getDOMNode().style.display = 'inline';
    if(!this.isFlash()) {
      this.refs.name.getDOMNode().focus();
      this.refs.name.getDOMNode().select();
    }
  },
  keydown: function(e) {
    if(this.isFlash()) return false;
    var c = 67;
    if(e.keyCode == 67 && (e.metaKey == true || e.ctrlKey == true)) {
      // user pressed ctrl+c, cmd+c
      this.markOk();
    }
  },
  markOk: function() {
    this.refs.iconOk.getDOMNode().style.display = 'inline';
    this.getDOMNode().classList.add('success', 'has-success');
  },
  unmark: function() {
    this.refs.iconOk.getDOMNode().style.display = 'none';
    this.getDOMNode().classList.remove('success', 'has-success');
  },
  isFlash: function() {
    return this.state.clipboard instanceof ZeroClipboard;
  },
});