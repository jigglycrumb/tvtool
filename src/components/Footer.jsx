import React from 'react';

export default class Footer extends React.Component {
  render() {
    var year = new Date().getFullYear();

    return (
      <footer className="row text-center text-muted">
        <p className="col-xs-12">This product uses the <a href="http://www.themoviedb.org/" target="_blank">TMDb</a> API but is not endorsed or certified by <a href="http://www.themoviedb.org/" target="_blank">TMDb</a>.</p>
        <p className="col-xs-12">&copy; <a href="http://hpcodecraft.me">hpcodecraft</a> 2014-{year}</p>
      </footer>
    );
  }
}
