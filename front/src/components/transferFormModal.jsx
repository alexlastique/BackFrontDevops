import React from "react";
import { useFormik } from "formik";
import { axiosPost } from "../utils/function";
import axiosInstance from "../axiosConfig";
import { toast } from "react-toastify";
import TransactionToast from "./transactionToast";

export default function TransferFormModal({ account, beneficiary, onClose }) {
  const formik = useFormik({
    initialValues: {
      amount: 0,
      iban_orig: account?.iban || "",
      iban_dest: beneficiary?.iban || ""
    },
    onSubmit: async (values) => {
      try {
        axiosInstance.defaults.headers.common['Authorization'] = "bearer " + localStorage.getItem("token");
        const response = await axiosPost("/send_money", values);
        if (response.transaction_id) {
          toast.success(
            <TransactionToast 
              transactionId={response.transaction_id}
              timestamp={response.timestamp}
            />,
            {
              autoClose: 60000,
              closeOnClick: false,
              progress: 0.8,
              hideProgressBar: false,
              draggable: false,
            }
          );
        }
        alert("Virement effectué avec succès !");
        onClose();
      } catch (error) {
        if (error.data?.message) {
          toast.error(error.data.message);
        } else {
          toast.error("Erreur lors du virement");
        }
      }
    },
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Nouveau virement</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
            &times;
          </button>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">De :</label>
            <div className="mt-1 p-2 bg-gray-50 rounded">
              <p className="font-semibold">{account?.nom}</p>
              <p className="text-sm text-gray-600">{account?.iban}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">À :</label>
            <div className="mt-1 p-2 bg-gray-50 rounded">
              <p className="font-semibold">{beneficiary?.nom}</p>
              <p className="text-sm text-gray-600">{beneficiary?.iban}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Montant (€)</label>
            <input
              type="number"
              name="amount"
              value={formik.values.amount}
              onChange={formik.handleChange}
              className="mt-1 block w-full rounded-md border p-2"
              min="0.01"
              step="0.01"
              required
            />
          </div>

          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-500 hover:text-gray-700"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Confirmer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}