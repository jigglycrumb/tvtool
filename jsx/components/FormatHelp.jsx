/** @jsx React.DOM */
var FormatHelp = React.createClass({
  render: function() {
    return (
      <tr style={this.props.style}>
        <th>&nbsp;</th>
        <th>
          <div className="well">
            <ul className="flat help-text">
              <li><p>The field above controls how the episode names are formatted. You can use these variables to insert episode data:</p></li>
              <li><a className="pointer" onClick={this.insertVariable}>(show)</a> The name of the show</li>
              <li><a className="pointer" onClick={this.insertVariable}>(season)</a> The season number</li>
              <li><a className="pointer" onClick={this.insertVariable}>(episode)</a> The episode number</li>
              <li><a className="pointer" onClick={this.insertVariable}>(title)</a> The episode name</li>
            </ul>
          </div>
        </th>
        <th>&nbsp;</th>
      </tr>
    )
  },
  insertVariable: function(e) {
    var text = e.target.innerHTML,
        formatString = document.getElementById('episode-format').value;

    AppState.app.format = formatString + text;
    AppState.update();
  }
});