import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { toastError, axiosGet } from "../utils/function";
import GetTransation from "../components/getTransation";

export default function PrintTransation() {
    const { iban } = useParams();
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resp = await axiosGet(`/transactions/${iban}`);
                setTransactions(resp);
            } catch (error) {
                toastError("Error fetching transactions");
            }
        };

        fetchData();
    }, [iban]);

    return (
        <div>
            <h2>Transactions for IBAN: {iban}</h2>
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
