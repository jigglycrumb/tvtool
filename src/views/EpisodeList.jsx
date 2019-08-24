import React from "react";
import EpisodeFormatContainer from "../containers/EpisodeFormatContainer";
import Episode from "./Episode";

const EpisodeList = ({ showLoaded, episodes }) => {
  if (showLoaded === false) {
    return <div>Loading</div>;
  }

  return (
    <div className="row">
      <table className="table table-striped table-hover">
        <EpisodeFormatContainer />
        <tbody>
          {episodes.map(function(episode, index) {
            return <Episode key={index} name={episode} />;
          }, this)}
        </tbody>
      </table>
    </div>
  );
};

export default EpisodeList;
