import React from 'react';

export default function Transaction({ data, iban }) {
    if (data.compte_sender_id === iban) {
        return (
            <div>
                <p><strong>Récepteur:</strong> {data.compte_receiver_id}</p>
                <p><strong>Montant:</strong> {data.montant} €</p>
                <p><strong>Date:</strong> {new Date(data.date).toLocaleString()}</p>
                <p><strong>État:</strong> {data.state}</p>
                <p>-</p>
            </div>
        );
    } else {
        return (
            <div>
                <p><strong>Expéditeur:</strong> {data.compte_sender_id}</p>
                <p><strong>Montant:</strong> {data.montant} €</p>
                <p><strong>Date:</strong> {new Date(data.date).toLocaleString()}</p>
                <p><strong>État:</strong> {data.state}</p>
                <p>+</p>
            </div>
        );
    }
}