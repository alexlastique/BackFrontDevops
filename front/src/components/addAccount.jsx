import React, { useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import { toast } from "react-toastify";

const InputField = ({ label, type, name, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
    />
  </div>
);

const SelectField = ({ label, name, value, onChange, options }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

const Button = ({ type, onClick, children, className }) => (
  <button
    type={type}
    onClick={onClick}
    className={`px-4 py-2 rounded-md ${className}`}
  >
    {children}
  </button>
);

const AccountForm = ({ onSubmit, onClose }) => {
  const formik = useFormik({
    initialValues: {
      name: "",
      type: "Courant",
    },
    onSubmit,
  });

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Ajouter un compte</h2>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <InputField
            label="Nom du compte"
            type="text"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
          />
          <SelectField
            label="Type de compte"
            name="type"
            value={formik.values.type}
            onChange={formik.handleChange}
            options={[
              { value: "Courant", label: "Compte courant" },
              { value: "Epargne", label: "Compte épargne" },
            ]}
          />
          <div className="flex justify-between">
            <Button
              type="button"
              className="bg-gray-300 text-black hover:bg-gray-400"
              onClick={onClose}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Créer un compte
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function AddAccount() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // console.log("Valeurs du formulaire avant soumission :", formik.values);

  const handleSubmit = async (values) => {
    console.log("Données envoyées :", values);

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
        console.log("Compte ajouté :", response.data);
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
