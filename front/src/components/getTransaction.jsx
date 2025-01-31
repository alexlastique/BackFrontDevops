import React from "react";

export default function Transaction({ data, iban }) {
  const isOutgoing = data.compte_sender_id === iban;

  return (
    <div className="p-4 border rounded-lg shadow-sm mb-3 bg-white flex justify-between items-center">
      <div>
        <p className="font-medium">
          {isOutgoing ? "Récepteur" : "Expéditeur"}:{" "}
          <span className="text-gray-600">{isOutgoing ? data.compte_receiver_id : data.compte_sender_id}</span>
        </p>
        <p className="text-gray-500 text-sm">{new Date(data.date).toLocaleString()}</p>
        <p className={`text-sm font-semibold ${data.state === "En cours" ? "text-blue-500" : "text-gray-700"}`}>
          {data.state}
        </p>
      </div>
      <div className="text-right">
        <p className={`text-lg font-bold ${isOutgoing ? "text-red-500" : "text-green-500"}`}>
          {isOutgoing ? "-" : "+"} {data.montant} €
        </p>
      </div>
    </div>
  );
}
