import React from "react";
import { connect } from "react-redux";
import EpisodeFormat from "../views/EpisodeFormat";
import theMovieDb from "themoviedb-javascript-library";
import actions from "../state/actions";
const { setEpisodeFormat } = actions;

const mapStateToProps = state => {
  return {
    format: state.format
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setEpisodeFormat: format => dispatch(setEpisodeFormat(format))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EpisodeFormat);
