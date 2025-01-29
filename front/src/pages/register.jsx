import React from "react";
import { useFormik } from "formik";
import { ToastContainer, Bounce } from "react-toastify";
import { toastError, axiosPost, toastValidate } from "../function";

export default function Register() {
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
      if (values.password !== values.confirmPassword) {
        toastError("Les mots de passe ne correspondent pas");
        return;
      }


      try {

        const resp = await axiosPost("/register", {
          email: values.email,
          mdp: values.password,
        });

        console.log(resp);

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
      } catch (error) {
        console.error("❌ Erreur Axios:", error);
        toastError("Erreur de connexion au serveur");
      }
    },
  });

  return (
    <div>
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
      <h1>Register</h1>
      <form onSubmit={formik.handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          onChange={formik.handleChange}
          value={formik.values.email}
        />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          onChange={formik.handleChange}
          value={formik.values.password}
        />
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          onChange={formik.handleChange}
          value={formik.values.confirmPassword}
        />
        <input type="submit" value="Envoyer" />
      </form>
    </div>
  );
}
