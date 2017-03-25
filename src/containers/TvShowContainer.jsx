import React from 'react';
import { connect } from 'react-redux';
import theMovieDb from 'themoviedb-javascript-library';

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

const TvShowContainer = React.createClass({
  render: function() {
    return (
      <h3>TvShowContainer</h3>
    );
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TvShowContainer);
