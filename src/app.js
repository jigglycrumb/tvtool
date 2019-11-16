import bootstrap from "bootstrap/dist/css/bootstrap";
import theMovieDb from "themoviedb-javascript-library";
import React from "react";
import ReactDOM from "react-dom";
import styles from "./styles/app";
import App from "./views/App.jsx";
import store from "./state/store";
import { Provider, connect } from "react-redux";

store.subscribe(() => {
  // console.log('Store changed', store.getState());
  localStorage.setItem("TvTool", JSON.stringify(store.getState()));
});

theMovieDb.common.api_key = "0c00851b985d8ed85c29492b352c717e";

window.onload = function() {
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById("app")
  );
};
