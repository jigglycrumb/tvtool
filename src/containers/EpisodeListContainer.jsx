import React from "react";
import { connect } from "react-redux";
import { EpisodeList } from "../views/EpisodeList";
import theMovieDb from "../tmdb";
import actions from "../state/actions";
const { loadEpisodesSuccess } = actions;

const mapStateToProps = (state) => {
  return {
    showLoaded: state.showLoaded,
    show: state.show,
    season: state.season,
    language: state.language,
    space: state.space,
    zerofill: state.zerofill,
    format: state.format,
    info: state.showdata.info,
    episodes: state.episodes,
    filterChars: state.filterChars,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loadEpisodesSuccess: (episodes) => dispatch(loadEpisodesSuccess(episodes)),
  };
};

class EpisodeListContainer extends React.Component {
  render() {
    return (
      <EpisodeList
        showLoaded={this.props.showLoaded}
        episodes={this.props.episodes}
      />
    );
  }

  componentDidMount() {
    this.loadEpisodes(this.props.show, this.props.season, this.props.language);
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.show !== prevProps.show ||
      this.props.language !== prevProps.language ||
      this.props.season !== prevProps.season ||
      this.props.showLoaded !== prevProps.showLoaded ||
      this.props.space !== prevProps.space ||
      this.props.zerofill !== prevProps.zerofill ||
      this.props.format !== prevProps.format ||
      this.props.filterChars !== prevProps.filterChars
    ) {
      this.loadEpisodes(
        this.props.show,
        this.props.season,
        this.props.language,
      );
    }
  }

  loadEpisodes(show, season, language) {
    theMovieDb.tvSeasons.getById(
      {
        id: show,
        season_number: season,
        language: language,
      },
      this.showEpisodes,
      this.showError,
    );
  }

  showEpisodes = (json) => {
    json = JSON.parse(json);
    var self = this,
      episodes = [],
      dict = {
        show: this.props.info.name,
        season: this.props.season,
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

    function replace(text = "") {
      text = text.replace(
        new RegExp("[(]([a-z ]*)[)]", "gim"),
        function (a, b) {
          return dict[b.toLowerCase()] || a;
        },
      );
      return text;
    }

    function replaceSpaces(text) {
      text = text.replace(new RegExp("( )", "gim"), function (a, b) {
        return self.props.space;
      });
      return text;
    }

    function cutSpacesAndCapitalize(text) {
      text = text.replace(new RegExp("( [a-z*])", "gim"), function (a, b) {
        return a.charAt(1).toUpperCase();
      });
      return text;
    }

    function filterChars(text) {
      text = text.split(" /").join(",");
      text = text.split("/").join(",");
      text = text.split("\\").join(",");
      text = text.split(":").join(" -");
      text = text.split("?").join("");
      text = text.split("!").join("");
      return text;
    }

    function buildEpisodeName(episode) {
      dict.episode = zerofill(1, episode.episode_number);
      dict.title = episode.name;
      var ep = replace(self.props.format);
      if (self.props.space === "") ep = cutSpacesAndCapitalize(ep);
      ep = replaceSpaces(ep);
      if (self.props.filterChars === true) {
        ep = filterChars(ep);
      }
      episodes.push({ title: ep, overview: episode.overview });
    }

    json.episodes.forEach(function (episode) {
      buildEpisodeName(episode);
    });

    this.props.loadEpisodesSuccess(episodes);
  };

  showError(json) {
    json = JSON.parse(json);
    console.error("Episodes.showError", json);
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EpisodeListContainer);
