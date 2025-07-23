import { useSignals } from "@preact/signals-react/runtime";
import { useCallback, useEffect } from "react";
import { actions, language, show, showTranslations } from "../state/signals";
import theMovieDb from "../tmdb";

const TvShowLanguage = () => {
  useSignals();

  const loadTranslations = useCallback((id) => {
    if (id !== null) {
      theMovieDb.tv.getTranslations(
        { id: id },
        (json) => {
          actions.loadShowTranslationsSuccess(JSON.parse(json).translations);
        },
        (_json) => {
          // Error logging removed
        }
      );
    }
  }, []);

  useEffect(() => {
    loadTranslations(show.value);
  }, [loadTranslations]);

  return (
    <div className="select">
      <select
        onChange={(event) => actions.selectLanguage(event.target.value)}
        value={language.value}
      >
      {showTranslations.value.map((translation, _i) => {
        return (
          <option
            key={`show-language-${translation.iso_639_1}-${translation.iso_3166_1}`}
            value={translation.iso_639_1}
          >
            {translation.english_name}
          </option>
        );
      })}
      </select>
    </div>
  );
};

export default TvShowLanguage;
