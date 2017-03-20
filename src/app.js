import bootstrap from 'bootstrap/dist/css/bootstrap';
import styles from './styles/app';

import theMovieDb from 'themoviedb-javascript-library';
import AppState from './lib/AppState';


theMovieDb.common.api_key = "0c00851b985d8ed85c29492b352c717e";


import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App.jsx';

window.onload = function() {
  AppState.load();
  ReactDOM.render(<App app={AppState.app} />, document.getElementById('app'));
};



/*
var AppState = {
  app: {
    language: 'en',
    show: null,
    season: 1,
    format: '(show) - (season)x(episode) - (title)',
    zerofill: [0, 0],
    space: ' ',
  },
  update: function() {
    localStorage.setItem('episodehelper', JSON.stringify(this.app));
    update.dispatch();
  },
  load: function() {
    var app = localStorage.getItem('episodehelper');
    if(null !== app && "undefined" !== app) this.app = JSON.parse(app);
  }
};

var update = new signals.Signal();
ZeroClipboard.config( { swfPath: 'bower_components/zeroclipboard/dist/ZeroClipboard.swf' } );

window.onload = function() {
  AppState.load();
  React.renderComponent(<App app={AppState.app} />, document.body);
};
*/
