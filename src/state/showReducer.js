const initialState = {
  format: '(show) - (season)x(episode) - (title)',
  language: 'en',
  search: {
    query: '',
    results: []
  },
  season: 1,
  show: null,
  space: ' ',
  zerofill: [0, 0],

};

function showReducer(state = initialState, action) {

  console.log(action);

  switch (action.type) {
  case 'SEARCH_SUCCESS':
    return Object.assign({}, state, { show: null, search: { query: action.query, results: action.results }});
  case 'SELECT_LANGUAGE':
    return { ...state, language: action.language };
  case 'SELECT_SHOW':
    return Object.assign({}, state, { show: action.id, language: 'en', season: 1, search: { query: "", results: [] }});
  default:
    return state;
  }
}

export default showReducer;
