import React from 'react';

const Header = () => {
  return (
    <header className="page-header">
      <div className="backdrop"></div>
      <div className="backdrop-overlay"></div>
      <h1 className="row">
        <span className="col-xs-10 col-xs-offset-1">
          TvTool<br />
          <small>Rename tv show episodes with ease.</small>
        </span>
      </h1>
    </header>
  );
};

export default Header;
