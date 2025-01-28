import React from "react";
import { useFormik } from "formik";
import { ToastContainer, Bounce } from "react-toastify";
import { toastError, axiosPost } from "../function";

export default function Register() {
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    onSubmit: async (values) => {
      if (!values.email || !values.password || !values.confirmPassword) {
        toastError("Tout les champs sont nécéssaire");
        return;
      }
      if (values.password !== values.confirmPassword) {
        toastError("Les mots ne passe ne correspondent pas");
        return;
      }

      // 📌 1️⃣ Vérifier les données avant l'envoi
      console.log("Envoi des données :", {
        email: values.email,
        mdp: values.password,
      });

      // 📌 2️⃣ Vérifier si axiosPost retourne bien une promesse
      const testResp = axiosPost("/register", {
        email: values.email,
        mdp: values.password,
      });
      console.log("Type de retour axiosPost:", testResp);
      if (!(testResp instanceof Promise)) {
        toastError("axiosPost ne retourne pas une promesse");
        return;
      }
      try {
        // let resp = await axiosPost("/register", {
        //   email: values.email,
        //   mdp: values.password,
        // }
        // );
        let resp = await axiosPost("/register", {
          email: values.email,
          mdp: values.password,
        });

        // console.log(resp);
        console.log("Réponse AxiosPost corrigée :", resp);

        if (!resp || !resp.data) {
          toastError("Erreur lors de la création du compte");
          return;
        }

        const token = resp.data.token;
        if (token) {
          localStorage.setItem("token", token);
          window.location.href = "/";
        } else {
          toastError(resp.data.message);
        }
      } catch (error) {
        console.error("Erreur Axios:", error);
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
        <label htmlFor="email">email</label>
        <input
          id="email"
          name="email"
          type="email"
          onChange={formik.handleChange}
          value={formik.values.email}
        />
        <label htmlFor="password">password</label>
        <input
          id="password"
          name="password"
          type="password"
          onChange={formik.handleChange}
          value={formik.values.password}
        />
        <label htmlFor="confirmPassword">confirm password</label>
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
