import React, { useState } from "react";
import { InfoIcon } from "@primer/octicons-react";
import { zeroFillSeason, zeroFillEpisode } from "../signals";

export const ZeroFill = () => {
  console.log("ZeroFill render", zeroFillSeason.value, zeroFillEpisode.value);

  const [zerofillhelpVisible, setZerofillhelpVisible] = useState(false);
  // return null;

  return (
    <div className="row">
      <div className="col-3 text-right">
        <h5>Zerofill</h5>
      </div>
      <div className="col-2 text-right">
        <span className="h5">Season</span>
      </div>
      <div className="col-2">
        <input
          type="number"
          min="0"
          max="3"
          className="form-control"
          defaultValue={zeroFillSeason.value}
          onChange={e => {
            console.log("fill", e.target.value);
            zeroFillSeason.value = parseInt(e.target.value);
          }}
        />
      </div>
      <div className="col-2 text-right">
        <span className="h5">Episode</span>
      </div>
      <div className="col-2">
        <input
          type="number"
          min="0"
          max="3"
          className="form-control"
          defaultValue={zeroFillEpisode.value}
          onChange={e => {
            zeroFillEpisode.value = parseInt(e.target.value);
          }}
        />
      </div>
      <div className="col-1 no-padding">
        <span
          onClick={() => setZerofillhelpVisible(!zerofillhelpVisible)}
          style={{
            color: "blue",
            cursor: "pointer",
            position: "relative",
          }}
        >
          <InfoIcon size="medium" />
        </span>
      </div>
      <div
        className="col-8 offset-3"
        style={{ display: zerofillhelpVisible ? "table-row" : "none" }}
      >
        <div className="alert alert-info help-text">
          Zerofill adds leading zeroes to episode and season numbers.
        </div>
      </div>
    </div>
  );
};
