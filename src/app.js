import "bootstrap/dist/css/bootstrap.css";
import theMovieDb from "./tmdb";
import React from "react";
import "./styles/app.css";
import App from "./views/App";
import { createRoot } from "react-dom/client";
import "./state/signals"; // Import signals to initialize them

theMovieDb.common.api_key = "0c00851b985d8ed85c29492b352c717e";
theMovieDb.common.base_uri = "https://api.themoviedb.org/3/";
theMovieDb.common.images_uri = "https://image.tmdb.org/t/p/";

const container = document.getElementById("app");
const root = createRoot(container);
root.render(<App />);
