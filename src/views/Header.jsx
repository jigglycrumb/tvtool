import React from "react";

const Header = () => {
  return (
    <header className="page-header">
      <div className="backdrop" />
      <div className="backdrop-overlay" />
      <h1 className="row">
        <span className="col-10 offset-1">
          TvTool
          <br />
          <small>Rename tv show episodes with ease.</small>
        </span>
      </h1>
    </header>
  );
};

export default Header;
