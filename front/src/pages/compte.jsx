import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toastError, axiosGet } from "../utils/function";
import axiosInstance from "../axiosConfig";
import GetTransation from "../components/getTransation";

export default function PrintTransation() {
    const { iban, param } = useParams();
    const [transactions, setTransactions] = useState([]);
    const [button, setButton] = useState(true);

    const fetchTransactions = async (filter) => {
        try {
            const endpoint = button
                ? `/transactionsUserFilter/${filter}`
                : `/transactionsFilter/${iban}/${filter}`;
            axiosInstance.defaults.headers.common["Authorization"] = "Bearer " + localStorage.getItem("token");
            const resp = await axiosGet(endpoint);
            setTransactions(resp);
        } catch (error) {
            toastError("Error fetching transactions");
        }
    };

    useEffect(() => {
        console.log(param);
        const filter = param === "dépenses" || param === "revenus" ? param : "all";
        fetchTransactions(filter);
    }, [iban, param, button]);

    return (
        <div>
            <h2>Transactions for IBAN: {iban}</h2>
            <button onClick={() => setButton(!button)}>Changer de filtre</button>
            {transactions.length > 0 ? (
                transactions.map((transaction, index) => (
                    <GetTransation key={index} data={transaction} iban={iban} />
                ))
            ) : (
                <p>No transactions found</p>
            )}
        </div>
    );
}
