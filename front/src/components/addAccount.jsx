import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Button from "./Button";
import AccountForm from "./AccountForm";

export default function AddAccount() {
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
    } catch (error) {
      console.error("Erreur lors de la création du compte :", error);
      toast.error("Une erreur est survenue.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <Button
        onClick={() => setIsModalOpen(true)}
        className="bg-indigo-600 text-white hover:bg-indigo-700"
      >
        Ajouter un compte
      </Button>
      {isModalOpen && (
        <AccountForm
          onSubmit={handleSubmit}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
