import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toastError, axiosGet } from "../utils/function";
import axiosInstance from "../axiosConfig";
import GetTransation from "../components/getTransation";

export default function PrintTransation() {
    const { iban, param } = useParams();
    const [transactions, setTransactions] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [selectedIban, setSelectedIban] = useState(iban || "all");
    const [searchLabel, setSearchLabel] = useState("");

    const fetchTransactions = async (filter) => {
        try {
            let endpoint;
            if (selectedIban === "all") {
                endpoint = filter === "all" ? `/transactionsUser` : `/transactionsUserFilter/${filter}`;
                if (searchLabel) {
                    endpoint = `/transactionsUserFilterLabel/${filter}/${searchLabel}`
                }
            } else {
                endpoint = `/transactionsFilter/${selectedIban}/${filter}`;
                if (searchLabel) {
                    endpoint = `/transactionsFilterLabel/${selectedIban}/${filter}/${searchLabel}`
                }
            }
            axiosInstance.defaults.headers.common["Authorization"] = "Bearer " + localStorage.getItem("token");
            const params = {};
            const resp = await axiosGet(endpoint, { params });
            setTransactions(resp);
        } catch (error) {
            toastError("Error fetching transactions");
        }
    };

    const fetchAccounts = async () => {
        try {
            axiosInstance.defaults.headers.common["Authorization"] = "Bearer " + localStorage.getItem("token");
            const resp = await axiosGet('/comptes');
            setAccounts(resp);
        } catch (error) {
            toastError("Error fetching accounts");
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    useEffect(() => {
        const filter = param === "Dépenses" || param === "Revenue" ? param : "all";
        fetchTransactions(filter);
    }, [selectedIban, param, searchLabel]);

    return (
        <div className="p-4 bg-gray-100 min-h-screen">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold">Transactions</h2>
                <select className="border p-2 rounded mt-4" onChange={(e) => setSelectedIban(e.target.value)} value={selectedIban}>
                    <option value="all">Tous les comptes</option>
                    {accounts.map((account, index) => (
                        <option key={index} value={account.iban}>{account.iban}</option>
                    ))}
                </select>
                <div className="flex gap-2 mt-4">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded">
                        <a href={`/compte/${selectedIban}/all`}>Transactions</a>
                    </button>
                    <button className="bg-green-500 text-white px-4 py-2 rounded">
                        <a href={`/compte/${selectedIban}/Revenue`}>Revenus</a>
                    </button>
                    <button className="bg-red-500 text-white px-4 py-2 rounded">
                        <a href={`/compte/${selectedIban}/Dépenses`}>Dépenses</a>
                    </button>
                </div>
                <div className="mt-6">
                    <input type="text" placeholder="Search by label" className="border p-2 rounded mt-4 ml-2" value={searchLabel} onChange={(e) => setSearchLabel(e.target.value)} />
                    <button onClick={() => fetchTransactions(param)} className="bg-blue-500 text-white p-2 rounded mt-4 ml-2">Search</button>
                    {transactions.length > 0 ? (
                        transactions.map((transaction, index) => (
                            <GetTransation key={index} data={transaction} iban={selectedIban} />
                        ))
                    ) : (
                        <p className="text-gray-500">Aucune transaction trouvée</p>
                    )}
                </div>
            </div>
        </div>
    );
}
