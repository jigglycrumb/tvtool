import React from 'react';

export default class Header extends React.Component {
  render() {
    return (
      <header className="page-header">
        <div className="backdrop"></div>
        <div className="backdrop-overlay"></div>
        <h1 className="row">
          <span className="col-xs-10 col-xs-offset-1">
            ShowTool<br />
            <small>Rename TV show episodes with ease.</small>
          </span>
        </h1>
      </header>
    );
  }
}
