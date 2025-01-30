import React from "react";
import { useFormik } from "formik";
import { ToastContainer, Bounce } from "react-toastify";
import { toastError, axiosPost, toastValidate } from "../utils/function";
import { useNavigate } from "react-router-dom";
export default function Login() {
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        onSubmit: async (values) => {
            if (!values.email || !values.password) {
                toastError("Tous les champs sont nécessaires");
                return;
            }

            try {
                const resp = await axiosPost("/login", {
                    email: values.email,
                    mdp: values.password,
                });


                if (!resp || typeof resp !== "object") {
                    toastError("Réponse invalide du serveur");
                    return;
                }

                if (resp.error) {
                    // Le serveur a retourné une erreur
                    toastError(resp.error);
                    return;
                }

                localStorage.setItem("token", resp.token);
                navigate("/");
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Se connecter a un compte</h1>
                <p className="text-gray-600">Connectez vous a notre banque dès maintenant</p>
                </div>

                <form onSubmit={formik.handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="text-sm font-medium text-gray-700 block">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            onChange={formik.handleChange}
                            value={formik.values.email}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="text-sm font-medium text-gray-700 block">Mot de passe</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            onChange={formik.handleChange}
                            value={formik.values.password}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Se connecter
                    </button>
                    </form>

                    <p className="mt-2 text-center text-sm text-gray-600">
                        Pas encore de compte ?{" "}
                        <a href="/" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Créer un compte
                        </a>
                    </p>
                    </div>
                    </div>
);
}