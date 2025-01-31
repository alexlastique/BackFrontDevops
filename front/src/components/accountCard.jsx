import React from "react";

export default function AccountCard({ account, isSelected, onClick }) {
  return (
    <div
      className={`p-4 rounded-lg cursor-pointer transition-all ${
        isSelected ? "bg-blue-100 border-2 border-blue-500" : "bg-white hover:bg-gray-50"
      }`}
      onClick={onClick}
    >
      <h3 className="font-bold">{account.nom}</h3>
      <p className="text-sm text-gray-600">{account.iban}</p>
      <p className="mt-2 text-lg font-semibold">{account.solde}€</p>
    </div>
  );
}