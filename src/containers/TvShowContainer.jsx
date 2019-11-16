import React from "react";
import { connect } from "react-redux";
import theMovieDb from "themoviedb-javascript-library";
import TvShow from "../views/TvShow";
import actions from "../state/actions";
const {
  loadShowInfoSuccess,
  setZerofill,
  setSpaceReplacement,
  selectSeason
} = actions;

const mapStateToProps = state => {
  return {
    language: state.language,
    show: state.show,
    info: state.showdata.info,
    space: state.space,
    zerofill: state.zerofill,
    season: state.season
  };
};

const mapDispatchToProps = dispatch => {
  return {
    loadShowInfoSuccess: info => dispatch(loadShowInfoSuccess(info)),
    setZerofill: zerofill => dispatch(setZerofill(zerofill)),
    setSpaceReplacement: space => dispatch(setSpaceReplacement(space)),
    selectSeason: season => dispatch(selectSeason(season))
  };
};

class TvShowContainer extends React.Component {
  render() {
    return (
      <TvShow
        language={this.props.language}
        show={this.props.show}
        info={this.props.info}
        space={this.props.space}
        season={this.props.season}
        zerofill={this.props.zerofill}
        setZerofill={this.props.setZerofill}
        setSpaceReplacement={this.props.setSpaceReplacement}
        selectSeason={this.props.selectSeason}
      />
    );
  }

  componentDidMount() {
    this.loadShow(this.props.show, this.props.language);
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.show !== prevProps.show ||
      this.props.language !== prevProps.language
    ) {
      this.loadShow(this.props.show, this.props.language);
    }
  }

  loadShow(id, language) {
    if (id !== null) {
      theMovieDb.tv.getById(
        { id: id, language: language },
        this.loadShowSuccess,
        this.loadShowError
      );
    }
  }

  loadShowSuccess = json => {
    json = JSON.parse(json);
    this.props.loadShowInfoSuccess(json);
  };

  loadShowError(json) {
    json = JSON.parse(json);
    console.error("TvShow.loadShowError", json);
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TvShowContainer);
