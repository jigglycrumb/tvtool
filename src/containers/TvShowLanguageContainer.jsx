import React from "react";
import theMovieDb from "themoviedb-javascript-library";
import { connect } from "react-redux";
import Button from "../views/Button";
import actions from "../state/actions";
const { selectLanguage, loadShowTranslationsSuccess } = actions;

const mapStateToProps = state => {
  return {
    show: state.show,
    language: state.language,
    translations: state.showdata.translations
  };
};

const mapDispatchToProps = dispatch => {
  return {
    loadShowTranslationsSuccess: translations =>
      dispatch(loadShowTranslationsSuccess(translations)),
    selectLanguage: language => dispatch(selectLanguage(language))
  };
};

class TvShowLanguageContainer extends React.Component {
  render() {
    return (
      <div className="btn-group">
        {this.props.translations.map(function(translation, i) {
          return (
            <Button
              key={"show-language-" + i}
              active={this.props.language === translation.iso_639_1}
              text={translation.english_name}
              onClick={this.props.selectLanguage.bind(
                this,
                translation.iso_639_1
              )}
            />
          );
        }, this)}
      </div>
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
