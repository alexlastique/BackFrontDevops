import React from "react";

const DownloadButton = ({ periode, transactions }) => {
    const handleDownload = () => {
        if (transactions.length === 0) {
            alert("Aucune transaction à télécharger !");
            return;
        }

        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += `Releve de transactions - ${periode}\n\n`;
        csvContent += "Date,Libelle,Montant,Statut\n";

        transactions.forEach((transaction) => {
            csvContent += `${transaction.date},${transaction.label},${transaction.montant},${transaction.state}\n`;
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.href = encodedUri;
        link.download = `Releve_${periode}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <button
            className="bg-gray-700 text-white px-4 py-2 rounded mt-4"
            onClick={handleDownload}
        >
            Télécharger un relevé
        </button>
    );
};

export default DownloadButton;
