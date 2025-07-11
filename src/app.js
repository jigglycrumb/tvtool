import "bootstrap/dist/css/bootstrap.css";
import theMovieDb from "./tmdb";
import React from "react";
import "./styles/app.css";
import App from "./views/App";
import store from "./state/store";
import { Provider, connect } from "react-redux";
import { createRoot } from "react-dom/client";

store.subscribe(() => {
  // console.log('Store changed', store.getState());
  localStorage.setItem("TvTool", JSON.stringify(store.getState()));
});

theMovieDb.common.api_key = "0c00851b985d8ed85c29492b352c717e";
theMovieDb.common.base_uri = "https://api.themoviedb.org/3/";
theMovieDb.common.images_uri = "https://image.tmdb.org/t/p/";

const container = document.getElementById("app");
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
