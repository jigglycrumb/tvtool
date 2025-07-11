import React, { useEffect } from "react";
import theMovieDb from "../tmdb";
import { language, show, showTranslations, actions } from "../state/signals";

const TvShowLanguage = () => {
  useEffect(() => {
    loadTranslations(show.value);
  }, [show.value]);

  const loadTranslations = (id) => {
    if (id !== null) {
      theMovieDb.tv.getTranslations(
        { id: id },
        (json) => {
          actions.loadShowTranslationsSuccess(JSON.parse(json).translations);
        },
        (json) => {
          console.error("TvShowLanguage.showError", JSON.parse(json));
        }
      );
    }
  };

  return (
    <select
      className="form-control"
      onChange={(event) => actions.selectLanguage(event.target.value)}
      value={language.value}
    >
      {showTranslations.value.map((translation, i) => {
        return (
          <option key={"show-language-" + i} value={translation.iso_639_1}>
            {translation.english_name}
          </option>
        );
      })}
    </select>
  );
};

export default TvShowLanguage;
