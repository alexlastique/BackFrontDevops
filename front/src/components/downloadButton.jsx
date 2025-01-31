import React from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import SimpleButton from "./simpleButton";

const DownloadButton = ({ periode, transactions }) => {
  const handleDownload = () => {
    const doc = new jsPDF();
    doc.text(`Relevé de compte - ${periode}`, 14, 20);

    if (transactions.length === 0) {
      doc.text("Aucune transaction pour cette période.", 14, 30);
    } else {
      autoTable(doc, {
        startY: 30,
        head: [["Expediteur", "Recepteur", "Date", "Montant (€)", "État"]],
        body: transactions.map((t) => [
          t.compte_sender_id == 0 ? "Depot" : t.compte_sender_id,
          t.compte_receiver_id,
          t.date,
          t.montant.toFixed(2),
          t.state,
        ]),
      });
    }

    doc.save(`Relevé_${periode}.pdf`);
  };

  return (
    <SimpleButton onClick={handleDownload} disabled={transactions.length === 0}>
      Télécharger un relevé
    </SimpleButton>
  );
};

export default DownloadButton;
