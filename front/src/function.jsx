import { toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "./axiosConfig";

export function toastError(
  params,
  position = "top-right",
  autoClose = 5000,
  hideProgressBar = false,
  closeOnClick = false,
  pauseOnHover = true,
  draggable = true,
  progress = undefined,
  theme = "dark",
  transition = Bounce
) {
  toast.error(params, {
    position: position,
    autoClose: autoClose,
    hideProgressBar: hideProgressBar,
    closeOnClick: closeOnClick,
    pauseOnHover: pauseOnHover,
    draggable: draggable,
    progress: progress,
    theme: theme,
    transition: transition,
  });
}

export async function axiosPost(link, params) {
  try {
    const response = await axiosInstance.post(link, params);
    return response.data; // ✅ Retourne les données correctement
  } catch (error) {
    console.error("Erreur AxiosPost :", error);
    return error.response
      ? error.response.data
      : { message: "Erreur inconnue" };
  }
}
