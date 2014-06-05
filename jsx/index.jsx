/** @jsx React.DOM */
var AppState = {
  app: {
    language: 'en',
    show: null,
    season: 1,
    format: '(show) - (season)x(episode) - (title)',
    zerofill: [0, 0],
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

window.onload = function() {
  AppState.load();
  React.renderComponent(<App app={AppState.app} />, document.body);
};