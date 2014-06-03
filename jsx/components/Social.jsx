/** @jsx React.DOM */
var Social = React.createClass({
  render: function() {
    return (
      <div className="social">
        <div className="addthis_toolbox addthis_default_style addthis_32x32_style">
          <a className="addthis_button_flattr.com"></a>
          <a className="addthis_button_preferred_1"></a>
          <a className="addthis_button_preferred_2"></a>
          <a className="addthis_button_preferred_3"></a>
          <a className="addthis_button_compact"></a>
          <a className="addthis_counter addthis_bubble_style"></a>
        </div>
      </div>
    );
  }
});