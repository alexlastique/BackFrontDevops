import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import TransactionFilter from "./TransactionFilter";
import DownloadButton from "./downloadButton";

const DownloadFileBuilding = ({ periode, transactions }) => {
  console.log(
    "📌 Transactions reçues dans DownloadFileBuilding :",
    transactions
  );
  console.log("📌 Période reçue dans DownloadFileBuilding :", periode);

  const [filteredTransactions, setFilteredTransactions] = useState([]);

  const filterTransactionsByPeriod = (periode) => {
    if (!periode || periode.length !== 6) {
      console.log("🚨 Période invalide");
      return [];
    }
    if (!Array.isArray(transactions)) {
      console.log("🚨 transactions n'est pas un tableau");
      return [];
    }

    const month = parseInt(periode.substring(0, 2), 10);
    const year = parseInt(periode.substring(2), 10);

    if (isNaN(month) || isNaN(year)) {
      console.log("🚨 La période est invalide (mois ou année incorrects)");
      return [];
    }

    console.log("📅 Mois :", month, " Année :", year);

    return transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      const transactionMonth = transactionDate.getMonth() + 1;
      const transactionYear = transactionDate.getFullYear();

      console.log(
        "🔍 Transaction : ",
        transactionDate,
        "Mois : ",
        transactionMonth,
        "Année : ",
        transactionYear
      );

      return transactionYear === year && transactionMonth === month;
    });
  };

  // 📌 Applique automatiquement le filtre dès le début et à chaque mise à jour de la période ou des transactions
  useEffect(() => {
    console.log("🔄 Application automatique du filtre avec période :", periode);
    setFilteredTransactions(filterTransactionsByPeriod(periode));
  }, [periode, transactions]);

  const handleFilterUpdate = (periode) => {
    console.log("📅 Filtre mis à jour avec la période :", periode);
    const newFilteredTransactions = filterTransactionsByPeriod(periode);
    setFilteredTransactions(newFilteredTransactions);
  };

  return (
    <div>
      <h2>Téléchargement du relevé</h2>
      <TransactionFilter onFilterUpdate={handleFilterUpdate} />
      <DownloadButton periode={periode} transactions={filteredTransactions} />
    </div>
  );
};

DownloadFileBuilding.propTypes = {
  periode: PropTypes.string.isRequired,
  transactions: PropTypes.array.isRequired,
};

export default DownloadFileBuilding;
