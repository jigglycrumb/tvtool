export default {
  searchSuccess: function(query, results) {
    return {
      type: 'SEARCH_SUCCESS',
      query,
      results
    };
  },
  selectLanguage: function(language) {
    return {
      type: 'SELECT_LANGUAGE',
      language
    };
  },
  selectSeason: function(season) {
    return {
      type: 'SELECT_SEASON',
      season
    };
  },
  selectShow: function(id) {
    return {
      type: 'SELECT_SHOW',
      id
    };
  },
  loadShowInfoSuccess: function(info) {
    return {
      type: 'LOAD_INFO_SUCCESS',
      info
    };
  },
  loadShowTranslationsSuccess: function(translations) {
    return {
      type: 'LOAD_TRANSLATIONS_SUCCESS',
      translations
    };
  },
  setZerofill: function(zerofill) {
    return {
      type: 'SET_ZEROFILL',
      zerofill
    };
  },
  setSpaceReplacement: function(space) {
    return {
      type: 'SET_SPACE',
      space
    };
  },
};
