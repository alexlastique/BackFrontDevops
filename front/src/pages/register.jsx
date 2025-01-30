import React from "react";
import { useFormik } from "formik";
import { ToastContainer, Bounce } from "react-toastify";
import { toastError, axiosPost } from "../utils/function";
import { useNavigate } from "react-router-dom";
export default function Register() {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    onSubmit: async (values) => {
      if (!values.email || !values.password || !values.confirmPassword) {
        toastError("Tous les champs sont nécessaires");
        return;
      }
      const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
      if (!passwordRegex.test(values.password)) {
        toastError("Le mot de passe doit contenir au moins 8 caractères, une lettre, un chiffre et un caractère spécial");
        return;
      }
      if (values.password !== values.confirmPassword) {
        toastError("Les mots de passe ne correspondent pas");
        return;
      }

      try {

        const resp = await axiosPost("/register", {
          email: values.email,
          mdp: values.password,
        });

        if (!resp || typeof resp !== "object") {
          toastError("Réponse invalide du serveur");
          return;
        }

        if (resp.error) {
          toastError(resp.error);
          return;
        }

        localStorage.setItem("token", resp.token);
        navigate("/login");
      } catch (error) {
        console.error("❌ Erreur Axios:", error);
        toastError("Erreur de connexion au serveur");
      }
    },
  });

  return (
    <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md mx-4">
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Bounce}
        />
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Créer un compte</h1>
          <p className="text-gray-600">Rejoignez notre banque dès maintenant</p>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              onChange={formik.handleChange}
              value={formik.values.email}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              onChange={formik.handleChange}
              value={formik.values.password}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirmer le mot de passe
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              onChange={formik.handleChange}
              value={formik.values.confirmPassword}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-black font-medium py-3 px-4 rounded-lg transition-colors duration-200"
          >
            S'inscrire
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Déjà un compte ?{" "}
          <a href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
            Se connecter
          </a>
        </p>
      </div>
    </div>
  );
}