import React from "react";
import { useFormik } from "formik";
import InputField from "./InputField";
import SelectField from "./SelectField";
import Button from "./Button";

const AccountForm = ({ onSubmit, onClose }) => {
  const formik = useFormik({
    initialValues: {
      name: "",
      type: "Courant",
    },
    onSubmit,
  });

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Ajouter un compte</h2>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <InputField
            label="Nom du compte"
            type="text"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
          />
          <SelectField
            label="Type de compte"
            name="type"
            value={formik.values.type}
            onChange={formik.handleChange}
            options={[
              { value: "Courant", label: "Compte courant" },
              { value: "Epargne", label: "Compte épargne" },
            ]}
          />
          <div className="flex justify-between">
            <Button
              type="button"
              className="bg-gray-300 text-black hover:bg-gray-400"
              onClick={onClose}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Créer un compte
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountForm;
