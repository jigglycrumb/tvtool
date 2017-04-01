import React from 'react';
import ZeroClipboard from 'zeroclipboard';

export default class Episode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clipboard: null
    };

    this.mouseover = this.mouseover.bind(this);
    this.keydown = this.keydown.bind(this);
  }

  render() {
    var notice = 'Press Ctrl+C to copy',
        isMac = navigator.platform.toUpperCase().indexOf('MAC') !== -1;

    if(isMac) notice = 'Press Cmd+C to copy';
    if(this.isFlash()) notice = 'Click to copy';

    return (
        <tr ref="self" onMouseOver={this.mouseover} onKeyDown={this.keydown}>
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
  }

  componentDidMount() {
    if(ZeroClipboard.isFlashUnusable() === false) {
      var self = this,
          client = new ZeroClipboard(this.refs.self);

      client.on('ready', function(event) {

        client.clip(self.refs.self);

        client.on('copy', function(event) {
          event.clipboardData.setData('text/plain', self.refs.name.value);
        });

        client.on('aftercopy', function(event) {
          self.markOk();
        });
      });

      this.setState({clipboard: client});
    }
  }

  componentDidUpdate() {
    this.unmark();
  }

  mouseover() {
    const nameNode = this.refs.name;
    const noticeNode = this.refs.notice;

    [].forEach.call(document.querySelectorAll('.copy-notice'), function(el) { el.style.display = 'none'; });
    noticeNode.style.display = 'inline';

    if(!this.isFlash()) {
      nameNode.focus();
      nameNode.select();
    }
  }

  keydown(e) {
    if(this.isFlash()) return false;
    if(e.keyCode == 67 && (e.metaKey === true || e.ctrlKey === true)) {
      // user pressed ctrl+c, cmd+c
      this.markOk();
    }
  }

  markOk() {
    this.refs.iconOk.style.display = 'inline';
    this.refs.self.classList.add('success', 'has-success');
  }

  unmark() {
    this.refs.iconOk.style.display = 'none';
    this.refs.self.classList.remove('success', 'has-success');
  }

  isFlash() {
    return this.state.clipboard instanceof ZeroClipboard;
  }
}
