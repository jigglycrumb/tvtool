import React from 'react';
import theMovieDb from 'themoviedb-javascript-library';
import { connect } from 'react-redux';
import Button from '../views/Button';
import actions from '../state/actions';
const { selectLanguage, loadShowTranslationsSuccess } = actions;

const mapStateToProps = (state) => {
  return {
    show: state.show,
    language: state.language,
    translations: state.showdata.translations,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loadShowTranslationsSuccess: (translations) => dispatch(loadShowTranslationsSuccess(translations)),
    selectLanguage: (language) => dispatch(selectLanguage(language)),
  };
};

const TvShowLanguageContainer = React.createClass({
  render: function() {
    return (
      <div className="btn-group btn-group-md">
        {this.props.translations.map(function(translation, i) {
          return (
            <Button
              key={'show-language-'+i}
              active={this.props.language === translation.iso_639_1}
              text={translation.english_name}
              onClick={this.props.selectLanguage.bind(this, translation.iso_639_1)} />
          );
        }, this)}
      </div>
    );
  },

  componentDidMount: function() {
    this.loadTranslations(this.props.show);
  },

  componentWillReceiveProps: function(nextProps) {
    if(this.props.show !== nextProps.show) {
      this.loadTranslations(nextProps.show);
    }
  },

  loadTranslations: function(id) {
    if(id !== null) {
      theMovieDb.tv.getTranslations({"id": id}, this.showTranslations, this.showError);
    }
  },

  showTranslations: function(json) {
    this.props.loadShowTranslationsSuccess(JSON.parse(json).translations);
  },

  showShow: function(json) {
    this.props.loadTranslationsInfoSuccess(JSON.parse(json));
  },

  showError: function(json) {
    console.error('TvShowLanguageContainer.showError', JSON.parse(json));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TvShowLanguageContainer);
