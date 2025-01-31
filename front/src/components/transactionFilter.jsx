import React, { useState } from "react";
import SimpleButton from "./simpleButton";
import PropTypes from "prop-types";

const TransactionFilter = ({ onFilterUpdate }) => {
  const [periode, setPeriode] = useState("");

  const handleFilter = () => {
    if (periode.length === 6) {
      onFilterUpdate(periode); // Notifier le parent (DownloadFileBuilding)
    }
  };

  return (
    <div>
      <input
        type="text"
        value={periode}
        onChange={(e) => setPeriode(e.target.value)}
        placeholder="MMYYYY"
      />
      <SimpleButton onClick={handleFilter}>Filtrer</SimpleButton>
    </div>
  );
};

TransactionFilter.propTypes = {
  onFilterUpdate: PropTypes.func.isRequired,
};

export default TransactionFilter;
