import React, { useEffect, useState } from 'react';
import Chart from '../components/chart';
import axiosInstance from '../axiosConfig';
import { axiosPost } from '../utils/function';

export default function Dashboard() {
    
    const [dataDepense, setDataDepense] = useState({
        labels: [],
        datasets: [
            {
                data: [],
            },
        ],
    });
    const [dataEntry, setDataEntry] = useState({
        labels: [],
        datasets: [
            {
                data: [],
            },
        ],
        
    });
    const [dataSolde, setDataSolde] = useState({
        labels: [],
        datasets: [
            {
                data: [],
            },
        ],
    });

    useEffect(() => {
        fetchTransaction();
    }, []);

    const fetchTransaction = async () => {
        axiosInstance.defaults.headers.common["Authorization"] = "bearer " + localStorage.getItem("token");
        const resp = await axiosPost("/transaction_all");

        let currentLabelD = 0;
        let currentLabelE = 0;
        let currentLabelS = 0;
        let labelsD = [];
        let dataD = [0];
        let labelsE = [];
        let dataE = [0];
        let labelsS = [];
        let dataS = [0];

        if (resp.length > 0) {
            resp.forEach((element) => {
                const transactionDate = element.transactions.date.split("T")[1].split(":")[0];

                if (element.transactions.compte_sender_id == element.iban) {
                    if (currentLabelD === -1 || transactionDate !== labelsD[currentLabelD]) {
                        currentLabelD++;
                        labelsD.push(transactionDate + " h");
                        dataD[currentLabelD] = dataD[currentLabelD - 1];
                    }
                    dataD[currentLabelD] -= element.transactions.montant;
                }

                if (element.transactions.compte_receiver_id == element.iban) {
                    if (currentLabelE === -1 || transactionDate !== labelsE[currentLabelE]) {
                        currentLabelE++;
                        labelsE.push(transactionDate + " h");
                        dataE[currentLabelE] = dataE[currentLabelE - 1];
                    }
                    dataE[currentLabelE] += element.transactions.montant;
                }

                if (currentLabelS === -1 || transactionDate !== labelsS[currentLabelS]) {
                    currentLabelS++;
                    labelsS.push(transactionDate + " h");
                    dataS[currentLabelS] = dataS[currentLabelS - 1];
                }
                if (element.transactions.compte_sender_id == element.iban) {
                    dataS[currentLabelS] -= element.transactions.montant;
                } else if (element.transactions.compte_receiver_id == element.iban) {
                    dataS[currentLabelS] += element.transactions.montant;
                }
            });
        }


        setDataDepense({
            labels: labelsD, // ou labelsE ou labelsS selon ce que vous voulez afficher
            datasets: [
                {
                    data: dataD, // ou dataE ou dataS selon ce que vous voulez afficher
                },
            ],
        });
        setDataEntry({
            labels: labelsE,
            datasets: [
                {
                    data: dataE,
                },
            ],
        })
        setDataSolde({
            labels: labelsS,
            datasets: [
                {
                    data: dataS,
                },
            ],
        })
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <Chart name={"Solde"} data={dataSolde} />
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <Chart name={"Entrées"} data={dataEntry} />
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <Chart name={"Sortie"} data={dataDepense} />
                </div>
            </div>
        </div>
    );
}