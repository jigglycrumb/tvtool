import React from "react";
import EpisodeFormatContainer from "../containers/EpisodeFormatContainer";
import { Episode } from "./Episode";

export const EpisodeList = ({ showLoaded, episodes }) => {
  if (showLoaded === false) {
    return <div>Loading</div>;
  }

  return (
    <div className="row">
      <table className="table">
        <EpisodeFormatContainer />
        <tbody>
          {episodes.map(function (episode, index) {
            return <Episode key={index} episode={episode} />;
          })}
        </tbody>
      </table>
    </div>
  );
};
