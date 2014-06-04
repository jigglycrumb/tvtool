/** @jsx React.DOM */
var AppState = {
  app: {
    query: '',
    language: 'en',
    season: 1,
    format: '(show) - (season)x(episode) - (title)',
    zerofill: 0,
  },
  update: function() {
    localStorage.setItem('app', JSON.stringify(this.app));
    update.dispatch();
  },
  load: function() {
    var app = localStorage.getItem('app');
    if(null !== app && "undefined" !== app) this.app = JSON.parse(app);
  }
};

var update = new signals.Signal();

window.onload = function() {
  AppState.load();
  React.renderComponent(<App app={AppState.app} />, document.body);
};