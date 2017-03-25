const AppState = {
  app: {
    show: null,
    language: 'en',
    season: 1,
    format: '(show) - (season)x(episode) - (title)',
    zerofill: [0, 0],
    space: ' ',
  },
  update: function() {
    localStorage.setItem('episodehelper', JSON.stringify(this.app));
    // update.dispatch();
  },
  load: function() {
    var app = localStorage.getItem('episodehelper');
    if(null !== app && "undefined" !== app) this.app = JSON.parse(app);

    // console.info('loaded app state', this.app);
  }
};

export default AppState;
