import initialState from './initialState';

function showReducer(state = initialState, action) {

  // console.log(action);

  switch (action.type) {
  case 'SEARCH_SUCCESS':
    return Object.assign({}, state, { show: null, search: { query: action.query, results: action.results }});
  case 'SELECT_LANGUAGE':
    return { ...state, language: action.language };
  case 'SELECT_SEASON':
    return { ...state, season: action.season };
  case 'SELECT_SHOW':
    return Object.assign({}, state, { show: action.id, language: 'en', season: 1, search: { query: "", results: [] }});
  case 'LOAD_INFO_SUCCESS':
    return Object.assign({}, state, {showdata: {info: action.info, translations: state.showdata.translations}});
  case 'LOAD_TRANSLATIONS_SUCCESS':
    return Object.assign({}, state, {showdata: {info: state.showdata.info, translations: action.translations}});
  case 'SET_ZEROFILL':
    return { ...state, zerofill: action.zerofill };
  case 'SET_SPACE':
    return { ...state, space: action.space };
  default:
    return state;
  }
}

export default showReducer;
