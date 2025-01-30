import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Register from "./pages/register";
import AddAccount from "./components/addAccount";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AddAccount />
  </StrictMode>
);
