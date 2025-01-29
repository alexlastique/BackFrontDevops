import React, { useState, useEffect } from "react";
import { ToastContainer, Bounce } from "react-toastify";
import { toastError, axiosGet } from "../utils/function";
import axiosInstance from "../axiosConfig";
import Account from "../components/account";

/**
 * Accounts component fetches and displays a list of user accounts along with their total balance.
 * 
 * @returns {JSX.Element} A React component that renders the accounts and their total balance.
 */
export default function Accounts() {
    const [accounts, setAccounts] = useState([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                axiosInstance.defaults.headers.common['Authorization'] = "bearer " + localStorage.getItem("token");
                const resp = await axiosGet("/comptes");
                setAccounts(resp);
            } catch (error) {
                console.error("Error fetching accounts:", error);
                toastError("Failed to fetch accounts");
            }
        };

        fetchAccounts();
    }, []);

    useEffect(() => {
        let sum = 0;
        accounts.forEach((account) => {
            sum += account.solde;
        });
        setTotal(sum);
    }, [accounts]);

    return (
        <>
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
                    <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                        Ajouter un compte
                    </button>
                </div>
            </div>
            <div className="flex flex-wrap gap-4">
                {accounts.map((account) => (
                    <Account key={account.id} account={account} className="w-1/3" />
                ))}
            </div>
        </>
    );
}