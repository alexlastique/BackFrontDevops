import React, { useEffect, useState } from 'react';
import Chart from '../components/chart';
import BigChart from '../components/bigChart';
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

    const [dataFlux, setDataFlux] = useState({
        labels: [],
        lineData: [],
        barData1: [],
        barData2: [],
    });

    useEffect(() => {
        fetchTransaction();
    }, []);

    useEffect(() => {
        fetchTransaction();
    }, [dataFlux]);

    const fetchTransaction = async () => {
        axiosInstance.defaults.headers.common["Authorization"] = "bearer " + localStorage.getItem("token");
        const resp = await axiosPost("/transaction_all");
        
        let currentLabelD = 0;
        let currentLabelE = 0;
        let currentLabelS = 0;
        let labelsD = [resp[0].transactions.date.split("T")[1].split(":")[0] + " h"];
        let dataD = [0];
        let labelsE = [resp[0].transactions.date.split("T")[1].split(":")[0] + " h"];
        let dataE = [0];
        let labelsS = [resp[0].transactions.date.split("T")[1].split(":")[0] + " h"];
        let dataS = [0];

        resp.forEach((element) => {
            const transactionDate = element.transactions.date.split("T")[1].split(":")[0] + " h";

            if (element.transactions.compte_sender_id == element.iban) {
                if (transactionDate !== labelsD[currentLabelD]) {
                    currentLabelD++;
                    labelsD.push(transactionDate);
                    dataD[currentLabelD] = dataD[currentLabelD - 1];
                }
                dataD[currentLabelD] -= element.transactions.montant;
            }

            if (element.transactions.compte_receiver_id == element.iban) {
                if (transactionDate !== labelsE[currentLabelE]) {
                    currentLabelE++;
                    labelsE.push(transactionDate);
                    dataE[currentLabelE] = dataE[currentLabelE - 1];
                }
                dataE[currentLabelE] += element.transactions.montant;
            }

            if (transactionDate !== labelsS[currentLabelS]) {
                currentLabelS++;
                labelsS.push(transactionDate);
                dataS[currentLabelS] = dataS[currentLabelS - 1];
            }
            if (element.transactions.compte_sender_id == element.iban) {
                dataS[currentLabelS] -= element.transactions.montant;
            } else if (element.transactions.compte_receiver_id == element.iban) {
                dataS[currentLabelS] += element.transactions.montant;
            }
        });

        let labelsF = dataSolde.labels;
        let dataFS = dataSolde.datasets[0].data;
        let dataFE = [];
        let soldeFE = 0;
        let dataFD = [];
        let soldeFD = 0;

        labelsF.forEach((element, key) => {
            if (dataEntry.labels.includes(element)) {
                let index = dataEntry.labels.indexOf(element);
                dataFE.push((dataEntry.datasets[0].data[index] ?? 0) - soldeFE);
                soldeFE += (dataEntry.datasets[0].data[index] ?? 0) - soldeFE;
            } else {
                dataFE.push(0);
            }

            if (dataDepense.labels.includes(element)) {
                let index = dataDepense.labels.indexOf(element);
                dataFD.push(Math.abs(dataDepense.datasets[0].data[index] ?? 0) - soldeFD);
                soldeFD += Math.abs(dataDepense.datasets[0].data[index] ?? 0) - soldeFD;
            } else {
                dataFD.push(0);
            }
        });

        setDataFlux({
            labels: labelsF,
            lineData: dataFS,
            barData1: dataFE,
            barData2: dataFD
        });

        setDataDepense({
            labels: labelsD,
            datasets: [
                {
                    data: dataD,
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
            <BigChart name="Mon Flux" data={dataFlux}/>
        </div>
    );
}