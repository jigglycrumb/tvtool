import React from 'react';
import ReactDOM from 'react-dom';
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
        <tr onMouseOver={this.mouseover} onKeyDown={this.keydown}>
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
          client = new ZeroClipboard(ReactDOM.findDOMNode(this));

      client.on('ready', function(event) {

        client.clip(ReactDOM.findDOMNode(self));

        client.on('copy', function(event) {
          event.clipboardData.setData('text/plain', ReactDOM.findDOMNode(self.refs.name).value);
        });

        client.on('aftercopy', function(event) {
          self.markOk();
        });
      });

      this.setState({clipboard: client});
    }

    // update.add(this.unmark);
  }

  componentWillUnmount() {
    // update.remove(this.unmark);
  }

  mouseover() {
    const nameNode = ReactDOM.findDOMNode(this.refs.name);
    const noticeNode = ReactDOM.findDOMNode(this.refs.notice);

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
    ReactDOM.findDOMNode(this.refs.iconOk).style.display = 'inline';
    ReactDOM.findDOMNode(this).classList.add('success', 'has-success');
  }

  unmark() {
    ReactDOM.findDOMNode(this.refs.iconOk).style.display = 'none';
    ReactDOM.findDOMNode(this).classList.remove('success', 'has-success');
  }

  isFlash() {
    return this.state.clipboard instanceof ZeroClipboard;
  }
}
