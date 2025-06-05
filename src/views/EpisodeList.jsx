import React from "react";
import EpisodeFormatContainer from "../containers/EpisodeFormatContainer";
import { Episode } from "./Episode";
import { CopyAllButton } from "./CopyAllButton";

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

      <CopyAllButton episodes={episodes} />
    </div>
  );
};
