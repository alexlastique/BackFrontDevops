import React, { useState, useEffect } from "react";
import DownloadFileBuilding from "../components/DownloadFileBuilding";

const Download = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    // 🔹 Simule un appel API (remplace par ton vrai endpoint si nécessaire)
    setTransactions([
      { date: "2024-11-23", montant: 50.75, etat: "En attente" },
      { date: "2024-12-01", montant: 50.75, etat: "En attente" },
      { date: "2024-12-02", montant: 200.0, etat: "Rejeté" },
      { date: "2024-12-04", montant: 150.0, etat: "Validé" },
      { date: "2025-01-10", montant: 100.5, etat: "Validé" },
      { date: "2025-01-15", montant: 50.75, etat: "En attente" },
      { date: "2025-01-20", montant: 200.0, etat: "Rejeté" },
      { date: "2025-02-03", montant: 150.0, etat: "Validé" },
      { date: "2025-02-08", montant: 50.75, etat: "En attente" },
      { date: "2025-02-17", montant: 200.0, etat: "Rejeté" },
    ]);
  }, []);

  return (
    <div>
      <h1>Page de Téléchargement</h1>
      <DownloadFileBuilding periode="112024" transactions={transactions} />
    </div>
  );
};

export default Download;
