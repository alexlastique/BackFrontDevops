import React from "react";
import { useFormik } from "formik";
import { ToastContainer } from "react-toastify";
import { toastError, axiosPost, toastValidate } from "../function";
import axiosInstance from "../axiosConfig";
import * as yup from "yup";

export default function UpdatePassword() {
  const formik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: yup.object({
      currentPassword: yup.string().required("Mot de passe actuel requis"),
      newPassword: yup
        .string()
        .min(8, "Le mot de passe doit contenir au moins 8 caractères")
        .required("Nouveau mot de passe requis"),
      confirmPassword: yup
        .string()
        .oneOf([yup.ref("newPassword"), null], "Les mots de passe doivent correspondre")
        .required("Confirmation du mot de passe requise"),
    }),
    onSubmit: async (values) => {
      try {
        axiosInstance.defaults.headers.common["Authorization"] ="Bearer " + localStorage.getItem("token");
        const resp = await axiosPost("/change_password", {
          currentPassword: values.currentPassword,
          new_password: values.newPassword,
        });
        console.log(resp);
        if (resp.message == "Mot de passe incorrect") {
          toastError("Mot de passe incorrect");
        } else {
          toastValidate("Mot de passe mis à jour avec succès !");
          setTimeout(() => {
            localStorage.removeItem("token");
            window.location.href = "/";
          }, 5000);
        }
        
      } catch (error) {
        console.error("❌ Erreur Axios:", error);
        toastError(error.response?.data?.detail || "Erreur inconnue");
      }
    },
  });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Changer de mot de passe</h3>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
              Mot de passe actuel
            </label>
            <input
              id="currentPassword"
              name="currentPassword"
              type="password"
              onChange={formik.handleChange}
              value={formik.values.currentPassword}
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
              Nouveau mot de passe
            </label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              onChange={formik.handleChange}
              value={formik.values.newPassword}
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirmez le mot de passe
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              onChange={formik.handleChange}
              value={formik.values.confirmPassword}
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
          >
            Modifier
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}
