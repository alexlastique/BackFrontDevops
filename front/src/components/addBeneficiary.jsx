import React from "react";
import { useFormik } from "formik";
import { axiosPost } from "../utils/function";
import axiosInstance from "../axiosConfig";

export default function AddBeneficiary({ onClose }) {
  const formik = useFormik({
    initialValues: {
      nom: "",
      iban: ""
    },
    onSubmit: async (values) => {
      try {
        axiosInstance.defaults.headers.common['Authorization'] = "bearer " + localStorage.getItem("token");
        await axiosPost("/beneficiary_add/", values);
        onClose();
      } catch (error) {
        console.error("Error adding beneficiary:", error);
      }
    },
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Ajouter un bénéficiaire</h2>
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Nom du compte</label>
            <input
              type="text"
              name="nom"
              onChange={formik.handleChange}
              className="border p-2 w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Numéro de compte</label>
            <input
              type="text"
              name="iban"
              onChange={formik.handleChange}
              className="border p-2 w-full"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}