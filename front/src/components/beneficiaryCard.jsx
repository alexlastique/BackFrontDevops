import React from "react";

export default function BeneficiaryCard({ benef, isSelected, onClick }) {
  return (
    <div
      className={`p-4 rounded-lg cursor-pointer transition-all ${
        isSelected ? "bg-green-100 border-2 border-green-500" : "bg-white hover:bg-gray-50"
      }`}
      onClick={onClick}
    >
      <h3 className="font-bold">{benef.nom}</h3>
      <p className="text-sm text-gray-600 break-all">{benef.iban}</p>
    </div>
  );
}