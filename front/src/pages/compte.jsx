import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toastError, axiosGet } from "../utils/function";
import axiosInstance from "../axiosConfig";
import GetTransaction from "../components/getTransaction";
import DownloadFileBuilding  from "../components/boutonTele";

const groupTransactionsByMonth = (transactions) => {
    return transactions.reduce((groups, transaction) => {
        const date = new Date(transaction.date);
        const month = date.toLocaleString('default', { month: 'long', year: 'numeric' });
        if (!groups[month]) {
            groups[month] = [];
        }
        groups[month].push(transaction);
        return groups;
    }, {});
};

const Compte = ({ transactions, selectedIban }) => {
    const groupedTransactions = groupTransactionsByMonth(transactions);

    return (
        <div>
            {Object.keys(groupedTransactions).length > 0 ? (
                Object.keys(groupedTransactions).map((month) => (
                    <div key={month}>
                        <h3 className="text-lg font-bold">{month}</h3>
                        {groupedTransactions[month].map((transaction, index) => (
                            <GetTransaction key={index} data={transaction} iban={selectedIban} />
                        ))}
                    </div>
                ))
            ) : (
                <p className="text-gray-500">Aucune transaction trouvée</p>
            )}
        </div>
    );
};

export default function PrintTransaction() {
    const { iban, param } = useParams();
    const [transactions, setTransactions] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [selectedIban, setSelectedIban] = useState(iban || "all");
    const [searchLabel, setSearchLabel] = useState("");
    const [solde, setSolde] = useState(0);
    const [soldeAttente, setSoldeAttente] = useState(0);
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

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
            setSoldeAttente(resp.filter(transaction => transaction.state === "En attente").reduce((total, transaction) => total + transaction.montant, 0));
        } catch (error) {
            toastError("Error fetching transactions");
        }
    };

    const fetchAccounts = async () => {
        try {
            axiosInstance.defaults.headers.common["Authorization"] = "Bearer " + localStorage.getItem("token");
            const resp = await axiosGet('/comptes');
            setAccounts(resp);
            if (iban === "all") {
                setSolde(resp.reduce((total, account) => total + account.solde, 0));
            } else {
                setSolde(resp.filter(account => account.iban === iban).reduce((total, account) => total + account.solde, 0));
            }
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
        if (selectedIban === "all") {
            setSolde(accounts.reduce((total, account) => total + account.solde, 0));
        } else {
            setSolde(accounts.filter(account => account.iban === selectedIban).reduce((total, account) => total + account.solde, 0));
        }
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
                <p>{solde} €</p>
                <p>En attente : {soldeAttente} €</p>
                <div className="mt-6">
                    <input type="text" placeholder="Search by label" className="border p-2 rounded mt-4 ml-2" value={searchLabel} onChange={(e) => setSearchLabel(e.target.value)} /> <br />
                    <input type="month" name="month" id="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}/>
                    <DownloadFileBuilding   periode={selectedMonth} transactions={transactions} />
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
                    <Compte transactions={transactions} selectedIban={selectedIban} />
                </div>
            </div>
        </div>
    );
}
