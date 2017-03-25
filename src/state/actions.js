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
  selectShow: function(id) {
    return {
      type: 'SELECT_SHOW',
      id
    };
  },
};
