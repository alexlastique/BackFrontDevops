import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Button from "./Button";
import AccountForm from "./AccountForm";

export default function AddAccount({ onAccountCreated }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = async (values) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/account_add/",
        { name: values.name, accountType: values.type },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.message) {
        toast.error(response.data.message);
      } else {
        toast.success("Compte créé avec succès !");
      }
      setIsModalOpen(false);

      if (onAccountCreated) {
        onAccountCreated(); // 🔹 Rafraîchit la liste des comptes dans Accounts.jsx
      }
    } catch (error) {
      console.error("Erreur lors de la création du compte :", error);
      toast.error("Une erreur est survenue.");
    }
  };

  return (
    <div className="relative">
      <Button
        onClick={() => setIsModalOpen(true)}
        className="bg-indigo-600 text-white hover:bg-indigo-700"
      >
        Ajouter un compte
      </Button>

      {isModalOpen && (
        <>
          {/* Overlay sombre avec une opacité réduite */}
          <div className="fixed inset-0 bg-gray-500 opacity-75"></div>

          {/* Contenu de la modale */}
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <AccountForm
                onSubmit={handleSubmit}
                onClose={() => setIsModalOpen(false)}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
