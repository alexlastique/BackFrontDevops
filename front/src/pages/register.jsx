import React from "react";
import { useFormik } from "formik";
import axiosInstance from "../axiosConfig";
import { toast, Bounce, ToastContainer } from "react-toastify"; 
import 'react-toastify/dist/ReactToastify.css';

export default function Register() {
    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
            confirmPassword: "",
        },
        onSubmit: (values) => {
            if (!values.email || !values.password || !values.confirmPassword) {
                toast.error("Tout les champs sont nécéssaire", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    transition: Bounce,
                    });
                return;
            }
            if (values.password !== values.confirmPassword) {
                toast.error("Les mots ne passe ne corresponde pas", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    transition: Bounce,
                    });
                return;
            }

            axiosInstance.post("/register", {
                    "email": values.email,
                    "mdp": values.password
                })
                .then(resp => { 
                    console.log(resp);
                    const token = resp.data.token;
                    if(token) {
                        localStorage.setItem("token", token);
                        window.location.href = "/";
                    }else {
                        toast.error(resp.data.message, {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: false,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "dark",
                            transition: Bounce,
                            });
                    }
                })
                .catch(error => {
                    console.log(error);
                })
                        
        }
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
                <input id="email" name="email" type="email" onChange={formik.handleChange} value={formik.values.email} />
                <label htmlFor="password">password</label>
                <input id="password" name="password" type="password" onChange={formik.handleChange} value={formik.values.password} />
                <label htmlFor="confirmPassword">confirm password</label>
                <input id="confirmPassword" name="confirmPassword" type="password" onChange={formik.handleChange} value={formik.values.confirmPassword} />
               <input type="submit" value="Envoyer" />
            </form>
        </div>
    );
}