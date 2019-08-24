import React from "react";
import { connect } from "react-redux";
import EpisodeList from "../views/EpisodeList";
import theMovieDb from "themoviedb-javascript-library";
import actions from "../state/actions";
const { loadEpisodesSuccess } = actions;

const mapStateToProps = state => {
  return {
    showLoaded: state.showLoaded,
    show: state.show,
    season: state.season,
    language: state.language,
    space: state.space,
    zerofill: state.zerofill,
    format: state.format,
    info: state.showdata.info,
    episodes: state.episodes
  };
};

const mapDispatchToProps = dispatch => {
  return {
    loadEpisodesSuccess: episodes => dispatch(loadEpisodesSuccess(episodes))
  };
};

const EpisodeListContainer = React.createClass({
  render: function() {
    return (
      <EpisodeList
        showLoaded={this.props.showLoaded}
        episodes={this.props.episodes}
      />
    );
  },

  componentDidMount: function() {
    this.loadEpisodes(this.props.show, this.props.season, this.props.language);
  },

  componentWillReceiveProps: function(nextProps) {
    if (
      this.props.show !== nextProps.show ||
      this.props.language !== nextProps.language ||
      this.props.season !== nextProps.season ||
      this.props.showLoaded !== nextProps.showLoaded ||
      this.props.zerofill !== nextProps.zerofill ||
      this.props.format !== nextProps.format
    ) {
      this.loadEpisodes(nextProps.show, nextProps.season, nextProps.language);
    }
  },

  loadEpisodes: function(show, season, language) {
    theMovieDb.tvSeasons.getById(
      {
        id: show,
        season_number: season,
        language: language
      },
      this.showEpisodes,
      this.showError
    );
  },

  showEpisodes: function(json) {
    json = JSON.parse(json);
    var self = this,
      episodes = [],
      dict = {
        show: this.props.info.name,
        season: this.props.season
      };

    function zerofill(index, number) {
      if (self.props.zerofill[index] > 0) {
        var pad = "",
          len = ("" + number).length;
        for (var i = 0; i < self.props.zerofill[index] - len + 1; i++)
          pad += "0";
        number = pad + number;
      }
      return number;
    }

    dict.season = zerofill(0, dict.season);

    function replace(text) {
      text = text.replace(new RegExp("[(]([a-z ]*)[)]", "gim"), function(a, b) {
        return dict[b.toLowerCase()] || a;
      });
      return text;
    }

    function replaceSpaces(text) {
      text = text.replace(new RegExp("( )", "gim"), function(a, b) {
        return self.props.space;
      });
      return text;
    }

    function cutSpacesAndCapitalize(text) {
      text = text.replace(new RegExp("( [a-z*])", "gim"), function(a, b) {
        return a.charAt(1).toUpperCase();
      });
      return text;
    }

    function buildEpisodeName(episode) {
      dict.episode = zerofill(1, episode.episode_number);
      dict.title = episode.name;
      var ep = replace(self.props.format);
      if (self.props.space === "") ep = cutSpacesAndCapitalize(ep);
      ep = replaceSpaces(ep);
      episodes.push(ep);
    }

    json.episodes.forEach(function(episode) {
      buildEpisodeName(episode);
    });

    this.props.loadEpisodesSuccess(episodes);
  },

  showError: function(json) {
    json = JSON.parse(json);
    console.error("Episodes.showError", json);
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EpisodeListContainer);
