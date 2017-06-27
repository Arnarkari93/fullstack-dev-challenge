import React from "react";
import PropTypes from "prop-types";

import "./InterestCalculationType.css";

const InterestCalculationType = ({ value, onSet }) => (
  <div className="fmz-interest-calculation-type">
    <button
      className={value === "Monthly" ? "active" : ""}
      onClick={() => onSet("Monthly")}
    >
      Monthly
    </button>
    <button
      className={value === "Quarterly" ? "active" : ""}
      onClick={() => onSet("Quarterly")}
    >
      Quarterly
    </button>
    <button
      className={value === "Annually" ? "active" : ""}
      onClick={() => onSet("Annually")}
    >
      Annually
    </button>
  </div>
);

InterestCalculationType.propTypes = {
  onSet: PropTypes.func
};

export default InterestCalculationType;
