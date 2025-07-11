import { useSignals } from "@preact/signals-react/runtime";
import { useCallback, useEffect } from "react";
import {
  actions,
  episodes,
  filterChars,
  format,
  language,
  season,
  show,
  showInfo,
  showLoaded,
  space,
  zerofill,
} from "../state/signals";
import theMovieDb from "../tmdb";
import { CopyAllButton } from "./CopyAllButton";
import { Episode } from "./Episode";
import EpisodeFormat from "./EpisodeFormat";

const EpisodeList = () => {
  useSignals();

  const showEpisodes = useCallback(
    (json) => {
      const data = JSON.parse(json);
      const episodesList = [];
      const dict = {
        show: showInfo.value.name,
        season: season.value,
      };

      function zerofillNumber(index, number) {
        if (zerofill.value[index] > 0) {
          let pad = "";
          const len = `${number}`.length;
          for (let i = 0; i < zerofill.value[index] - len + 1; i++) pad += "0";
          number = pad + number;
        }
        return number;
      }

      dict.season = zerofillNumber(0, dict.season);

      function replace(text = "") {
        text = text.replace(/[(]([a-z ]*)[)]/gim, (a, b) => {
          return dict[b.toLowerCase()] || a;
        });
        return text;
      }

      function replaceSpaces(text) {
        text = text.replace(/( )/gim, () => {
          return space.value;
        });
        return text;
      }

      function cutSpacesAndCapitalize(text) {
        text = text.replace(/( [a-z*])/gim, (a) => {
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
    },

    [showInfo.value, language.value, season.value, zerofill.value, space.value, filterChars.value]
  );

  const loadEpisodes = useCallback(
    (showId, seasonNumber, languageCode) => {
      theMovieDb.tvSeasons.getById(
        {
          id: showId,
          season_number: seasonNumber,
          language: languageCode,
        },
        showEpisodes,
        (json) => {
          const _data = JSON.parse(json);
          // Error logging removed
        }
      );
    },
    [showEpisodes]
  );

  useEffect(() => {
    loadEpisodes(show.value, season.value, language.value);
  }, [loadEpisodes]);

  if (showLoaded.value === false) {
    return <div>Loading</div>;
  }

  return (
    <div className="row">
      <table className="table">
        <EpisodeFormat />
        <tbody>
          {episodes.value.map((episode, _index) => {
            // Using episode title as key is safer than index
            return <Episode key={`episode-${episode.title}`} episode={episode} />;
          })}
        </tbody>
      </table>

      <CopyAllButton episodes={episodes.value} />
    </div>
  );
};

export default EpisodeList;
