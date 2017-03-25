import { connect } from 'react-redux';
import TvShowLanguage from '../views/TvShowLanguage';
import actions from '../state/actions';
const { selectLanguage } = actions;

const mapStateToProps = (state) => {
  return {
    //language: state.language
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    selectLanguage: () => dispatch(selectLanguage('de'))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TvShowLanguage);
