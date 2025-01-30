import React, { useState, useEffect } from "react";
import { ToastContainer, Bounce } from "react-toastify";
import { toastError, axiosGet } from "../utils/function";
import axiosInstance from "../axiosConfig";
import Account from "../components/account";
import DeleteAccount from "../components/accountDelete";
import AddAccount from "../components/addAccount";

export default function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [total, setTotal] = useState(0);
  const [deletePopUp, setDeletePopUp] = useState(false);
  const [deleteAccountIban, setDeleteAccountIban] = useState("");

  const fetchAccounts = async () => {
    try {
      axiosInstance.defaults.headers.common["Authorization"] =
        "bearer " + localStorage.getItem("token");
      const resp = await axiosGet("/comptes");
      setAccounts(resp);
    } catch (error) {
      console.error("Error fetching accounts:", error);
      toastError("Failed to fetch accounts");
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const deleteAccountPopUp = (accountIban) => {
    setDeletePopUp(true);
    setDeleteAccountIban(accountIban);
  };

  const cancelDeleteAccount = () => {
    setDeletePopUp(false);
    fetchAccounts();
  };

  useEffect(() => {
    let sum = 0;
    accounts.forEach((account) => {
      sum += account.solde;
    });
    setTotal(sum);
  }, [accounts]);

  return (
    <div className="w-full">
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
      <div className="p-4">
        <div className="mb-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Mes comptes</h1>
            <h2 className="text-xl">Total des actifs : {total} €</h2>
          </div>
          <AddAccount onAccountCreated={fetchAccounts} />
        </div>
      </div>
      <div className="flex flex-wrap gap-4 p-4">
        {accounts.map((account) => (
          <Account key={account.id} account={account} className="w-1/3" onSendMessage={ deleteAccountPopUp } />
        ))}
      </div>
      {deletePopUp && (
        <DeleteAccount iban={ deleteAccountIban } onCancel={ cancelDeleteAccount } />
      )}
    </div>
  );
}
