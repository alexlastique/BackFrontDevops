import React from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const BigChart = ({ name, data, options, type }) => {
    const chartData = {
        labels: data.labels,
        datasets: [
            {
                type: 'line',
                data: data.lineData,
                borderColor: 'lightgray',
                borderWidth: 5,
            },
            {
                type: 'bar',
                label: 'Barre 1',
                data: data.barData1,
                backgroundColor: 'Green',
            },
            {
                type: 'bar',
                label: 'Barre 2',
                data: data.barData2,
                backgroundColor: 'Red',
            },
        ],
    };

    const chartOptions = {
        elements: {
            line: {
                tension: 0, // Désactiver la courbure des lignes
                borderWidth: 5, // Enlever les lignes
            },
            point: {
                radius: 5, // Taille des points
            },
        },
        scales: {
            x: {
                display: false,
            },
            y: {
                display: true,
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
                        if (context.dataset.label === 'Barre 2') {
                            return '- ' + context.raw + " €"; // Ajouter "-" avant chaque valeur de Barre 2
                        }
                        return context.raw + " €"; // Ajouter "€" après chaque valeur
                    },
                    },
            },
        },
    };

    return (
        <div>
            <h1 className="text-xl font-semibold mb-2">{name}</h1>
            <Line data={chartData} options={chartOptions} />
        </div>
    );
};

export default BigChart;