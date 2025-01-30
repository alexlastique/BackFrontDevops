import React from "react";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function Chart({name, data}) {

    const options = {
        elements: {
            line: {
                tension: 0, // Désactiver la courbure des lignes
                borderWidth: 5, // Enlever les lignes
            },
            point: {
                radius: 1, // Taille des points
            },
        },
        scales: {
            x: {
                display: false,
            },
            y: {
                display: false,
            },
        },
        plugins: {
            legend: {
                display: false, // Désactiver la légende
            },
            tooltip: {
                backgroundColor: 'white', // Couleur de fond de la popup
                titleColor: 'black', // Couleur du titre
                bodyColor: 'black', // Couleur du corps
                borderColor: 'black', // Couleur de la bordure
                borderWidth: 1, // Largeur de la bordure
                displayColors: false, // Enlever l'icône à gauche
                callbacks: {
                    label: function (context) {
                        return context.raw + " €"; // Ajouter "€" après chaque valeur
                    },
                },
            },
        },
    };

    return (
        <div>
            <h1 className="text-xl font-semibold mb-2">{name}</h1>
            <Line data={data} options={options}/>
        </div>
    );
}