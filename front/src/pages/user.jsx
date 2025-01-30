import React from "react";
import { useNavigate } from "react-router-dom";
import UpdatePassword from "../components/updatePassword";

export default function User() {
  const navigate = useNavigate();

  return (
    <div className="w-full p-4">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Mon profil</h1>
        </div>
      </div>
      <div className="flex flex-wrap gap-4 p-4">
        <UpdatePassword />
      </div>
      <button
        onClick={() => {
          localStorage.clear();
          navigate("/login");
        }}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Se déconnecter
      </button>
    </div>
  );
}
