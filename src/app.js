import bootstrap from 'bootstrap/less/bootstrap';
import theMovieDb from 'themoviedb-javascript-library';
import AppState from './lib/AppState';
import React from 'react';
import ReactDOM from 'react-dom';
import ZeroClipboard from 'zeroclipboard';
import ZeroClipboardSWF from 'zeroclipboard/dist/ZeroClipboard.swf';
import styles from './styles/app';
import App from './components/App.jsx';

/*
  var update = new signals.Signal();
*/

theMovieDb.common.api_key = "0c00851b985d8ed85c29492b352c717e";
ZeroClipboard.config({ swfPath: ZeroClipboardSWF });

window.onload = function() {
  AppState.load();
  ReactDOM.render(<App app={AppState.app} />, document.getElementById('app'));
};
