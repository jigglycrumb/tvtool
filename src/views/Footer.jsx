import React from "react";

export const Footer = () => {
  var year = new Date().getFullYear();

  return (
    <footer className="row text-center text-muted">
      <p className="col-12">
        This product uses the{" "}
        <a href="http://www.themoviedb.org/" target="_blank">
          TMDb
        </a>{" "}
        API but is not endorsed or certified by{" "}
        <a href="http://www.themoviedb.org/" target="_blank">
          TMDb
        </a>
        .
      </p>
      <p className="col-12">
        &copy; <a href="https://github.com/jigglycrumb">jigglycrumb</a> 2014-
        {year}
      </p>
    </footer>
  );
};
