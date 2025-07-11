import { signal, computed, batch } from "@preact/signals";
import initialState from "./initialState";

// Create signals based on initial state
export const format = signal(initialState.format);
export const language = signal(initialState.language);
export const searchQuery = signal(initialState.search.query);
export const searchResults = signal(initialState.search.results);
export const season = signal(initialState.season);
export const show = signal(initialState.show);
export const space = signal(initialState.space);
export const zerofill = signal(initialState.zerofill);
export const filterChars = signal(initialState.filterChars);
export const showLoaded = signal(initialState.showLoaded);
export const showInfo = signal(initialState.showdata.info);
export const showTranslations = signal(initialState.showdata.translations);
export const episodes = signal(initialState.episodes);

// Computed values
export const search = computed(() => ({
  query: searchQuery.value,
  results: searchResults.value,
}));

export const showdata = computed(() => ({
  info: showInfo.value,
  translations: showTranslations.value,
}));

// Actions (replacing Redux action creators)
export const actions = {
  restoreState: (state) => {
    batch(() => {
      format.value = state.format;
      language.value = state.language;
      searchQuery.value = state.search.query;
      searchResults.value = state.search.results;
      season.value = state.season;
      show.value = state.show;
      space.value = state.space;
      zerofill.value = state.zerofill;
      filterChars.value = state.filterChars;
      showLoaded.value = state.showLoaded;
      showInfo.value = state.showdata.info;
      showTranslations.value = state.showdata.translations;
      episodes.value = state.episodes;
    });
  },

  searchSuccess: (query, results) => {
    batch(() => {
      show.value = null;
      searchQuery.value = query;
      searchResults.value = results;
    });
  },

  selectLanguage: (newLanguage) => {
    language.value = newLanguage;
  },

  selectSeason: (newSeason) => {
    season.value = newSeason;
  },

  selectShow: (id) => {
    batch(() => {
      show.value = id;
      language.value = "en";
      season.value = 1;
      searchQuery.value = "";
      searchResults.value = [];
    });
  },

  loadShowInfoSuccess: (info) => {
    // Guess season zerofill
    const newZerofill = [("" + info.seasons.length).length - 1, zerofill.value[1]];

    batch(() => {
      showLoaded.value = true;
      showInfo.value = info;
      zerofill.value = newZerofill;
    });
  },

  loadShowTranslationsSuccess: (translations) => {
    showTranslations.value = translations;
  },

  loadEpisodesSuccess: (newEpisodes) => {
    episodes.value = newEpisodes;
  },

  setZerofill: (newZerofill) => {
    zerofill.value = newZerofill;
  },

  setSpaceReplacement: (newSpace) => {
    space.value = newSpace;
  },

  setEpisodeFormat: (newFormat) => {
    format.value = newFormat;
  },

  toggleFilterChars: (newFilterChars) => {
    filterChars.value = newFilterChars;
  },
};

// Helper to save state to localStorage
export const saveState = () => {
  const state = {
    format: format.value,
    language: language.value,
    search: {
      query: searchQuery.value,
      results: searchResults.value,
    },
    season: season.value,
    show: show.value,
    space: space.value,
    zerofill: zerofill.value,
    filterChars: filterChars.value,
    showLoaded: showLoaded.value,
    showdata: {
      info: showInfo.value,
      translations: showTranslations.value,
    },
    episodes: episodes.value,
  };

  localStorage.setItem("TvTool", JSON.stringify(state));
};

// Setup localStorage persistence
if (typeof window !== "undefined") {
  // Load state from localStorage on initialization
  const storedState = localStorage.getItem("TvTool");
  if (storedState !== null) {
    try {
      const state = JSON.parse(storedState);
      console.info("Restored state from localStorage");
      actions.restoreState(state);
    } catch (e) {
      console.error("Failed to restore state from localStorage");
    }
  } else {
    console.info("Found no previous state in localStorage, using defaults");
  }

  // Subscribe to changes to save to localStorage
  Object.values({
    format,
    language,
    searchQuery,
    searchResults,
    season,
    show,
    space,
    zerofill,
    filterChars,
    showLoaded,
    showInfo,
    showTranslations,
    episodes,
  }).forEach((signal) => {
    signal.subscribe(() => {
      saveState();
    });
  });
}
