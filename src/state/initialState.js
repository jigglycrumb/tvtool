const state = {
  format: "(show) - (season)x(episode) - (title)",
  language: "en",
  search: {
    query: "",
    results: [],
  },
  season: 1,
  show: null,
  space: " ",
  zerofill: [0, 0],
  filterChars: false,
  showLoaded: false,
  showdata: {
    info: {
      seasons: [],
    },
    translations: [],
  },
  episodes: [],
};

export default state;
