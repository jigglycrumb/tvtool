import React, { useEffect } from "react";
import theMovieDb from "../tmdb";
import { Episode } from "./Episode";
import { CopyAllButton } from "./CopyAllButton";
import EpisodeFormat from "./EpisodeFormat";
import { 
  show, 
  showLoaded, 
  season, 
  language, 
  space, 
  zerofill, 
  format, 
  showInfo, 
  episodes, 
  filterChars, 
  actions 
} from "../state/signals";

const EpisodeList = () => {
  useEffect(() => {
    loadEpisodes(show.value, season.value, language.value);
  }, [
    show.value,
    season.value,
    language.value,
    showLoaded.value,
    space.value,
    zerofill.value,
    format.value,
    filterChars.value
  ]);

  const loadEpisodes = (showId, seasonNumber, languageCode) => {
    theMovieDb.tvSeasons.getById(
      {
        id: showId,
        season_number: seasonNumber,
        language: languageCode,
      },
      showEpisodes,
      (json) => {
        const data = JSON.parse(json);
        console.error("Episodes.showError", data);
      }
    );
  };

  const showEpisodes = (json) => {
    const data = JSON.parse(json);
    const episodesList = [];
    const dict = {
      show: showInfo.value.name,
      season: season.value,
    };

    function zerofillNumber(index, number) {
      if (zerofill.value[index] > 0) {
        let pad = "";
        const len = ("" + number).length;
        for (let i = 0; i < zerofill.value[index] - len + 1; i++)
          pad += "0";
        number = pad + number;
      }
      return number;
    }

    dict.season = zerofillNumber(0, dict.season);

    function replace(text = "") {
      text = text.replace(
        new RegExp("[(]([a-z ]*)[)]", "gim"),
        (a, b) => {
          return dict[b.toLowerCase()] || a;
        }
      );
      return text;
    }

    function replaceSpaces(text) {
      text = text.replace(new RegExp("( )", "gim"), () => {
        return space.value;
      });
      return text;
    }

    function cutSpacesAndCapitalize(text) {
      text = text.replace(new RegExp("( [a-z*])", "gim"), (a) => {
        return a.charAt(1).toUpperCase();
      });
      return text;
    }

    function filterProblematicChars(text) {
      text = text.split(" / ").join(" & ");
      text = text.split("/").join(",");
      text = text.split("\\").join(",");
      text = text.split(":").join(" -");
      text = text.split("?").join("");
      text = text.split("!").join("");
      return text;
    }

    function buildEpisodeName(episode) {
      dict.episode = zerofillNumber(1, episode.episode_number);
      dict.title = episode.name;
      let ep = replace(format.value);
      if (space.value === "") ep = cutSpacesAndCapitalize(ep);
      ep = replaceSpaces(ep);
      if (filterChars.value === true) {
        ep = filterProblematicChars(ep);
      }
      episodesList.push({ title: ep, overview: episode.overview });
    }

    data.episodes.forEach((episode) => {
      buildEpisodeName(episode);
    });

    actions.loadEpisodesSuccess(episodesList);
  };

  if (showLoaded.value === false) {
    return <div>Loading</div>;
  }

  return (
    <div className="row">
      <table className="table">
        <EpisodeFormat />
        <tbody>
          {episodes.value.map((episode, index) => {
            return <Episode key={index} episode={episode} />;
          })}
        </tbody>
      </table>

      <CopyAllButton episodes={episodes.value} />
    </div>
  );
};

export default EpisodeList;
