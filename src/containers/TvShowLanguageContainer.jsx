import React from "react";
import theMovieDb from "themoviedb-javascript-library";
import { connect } from "react-redux";
import actions from "../state/actions";
const { selectLanguage, loadShowTranslationsSuccess } = actions;

const mapStateToProps = state => {
  return {
    show: state.show,
    language: state.language,
    translations: state.showdata.translations,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    loadShowTranslationsSuccess: translations =>
      dispatch(loadShowTranslationsSuccess(translations)),
    selectLanguage: language => dispatch(selectLanguage(language)),
  };
};

class TvShowLanguageContainer extends React.Component {
  render() {
    return (
      <select
        className="form-control"
        onChange={event => this.props.selectLanguage(event.target.value)}
        defaultValue={this.props.language}
      >
        {this.props.translations.map(function (translation, i) {
          return (
            <option key={"show-language-" + i} value={translation.iso_639_1}>
              {translation.english_name}
            </option>
          );
        }, this)}
      </select>
    );
  }

  componentDidMount() {
    this.loadTranslations(this.props.show);
  }

  componentDidUpdate(prevProps) {
    if (this.props.show !== prevProps.show) {
      this.loadTranslations(this.props.show);
    }
  }

  loadTranslations(id) {
    if (id !== null) {
      theMovieDb.tv.getTranslations(
        { id: id },
        this.showTranslations,
        this.showError
      );
    }
  }

  showTranslations = json => {
    this.props.loadShowTranslationsSuccess(JSON.parse(json).translations);
  };

  showShow(json) {
    this.props.loadTranslationsInfoSuccess(JSON.parse(json));
  }

  showError(json) {
    console.error("TvShowLanguageContainer.showError", JSON.parse(json));
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TvShowLanguageContainer);
