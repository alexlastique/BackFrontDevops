import React from "react";
import { useFormik } from "formik";
import { ToastContainer } from "react-toastify";
import { toastError, axiosPost, toastValidate } from "../utils/function";
import axiosInstance from "../axiosConfig";

export default function UpdatePassword() {
  const formik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    onSubmit: async (values) => {
      if (!values.currentPassword || !values.newPassword || !values.confirmPassword) {
        toastError("Tous les champs sont nécessaires");
        return;
      }
      const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
      if (!passwordRegex.test(values.newPassword)) {
        toastError("Le mot de passe doit contenir au moins 8 caractères, une lettre, un chiffre et un caractère spécial");
        return;
      }
      if (values.newPassword !== values.confirmPassword) {
        toastError("Les mots de passe ne correspondent pas");
        return;
      }
      try {
        await axiosPost("/update-password", values);
        toastValidate("Mot de passe mis à jour avec succès");
      } catch (error) {
        toastError("Erreur lors de la mise à jour du mot de passe");
      }
    },
  });

  return (
    <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-4">Mettre à jour le mot de passe</h2>
      <form onSubmit={formik.handleSubmit}>
        <div className="mb-4">
          <label htmlFor="currentPassword" className="block text-gray-700">Mot de passe actuel</label>
          <input
            id="currentPassword"
            name="currentPassword"
            type="password"
            onChange={formik.handleChange}
            value={formik.values.currentPassword}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="newPassword" className="block text-gray-700">Nouveau mot de passe</label>
          <input
            id="newPassword"
            name="newPassword"
            type="password"
            onChange={formik.handleChange}
            value={formik.values.newPassword}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block text-gray-700">Confirmer le mot de passe</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            onChange={formik.handleChange}
            value={formik.values.confirmPassword}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Mettre à jour
        </button>
      </form>
    </div>
  );
}
