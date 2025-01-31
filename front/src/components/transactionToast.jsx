import { useState, useEffect } from "react";
import { axiosPost } from "../utils/function";
import { toastError, toastValidate } from "../utils/function";

const TransactionToast = ({ transactionId, timestamp }) => {
  const [timeLeft, setTimeLeft] = useState(() => {
    const initialTime = 60 - (Date.now()/1000 - timestamp);
    return Math.max(0, Math.floor(initialTime));
  });

  useEffect(() => {
    if(timeLeft <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleCancel = async () => {
    try {
      await axiosPost("/cancel_transaction", { id: transactionId });
      toastValidate("Transaction annulée avec succès !");
    } catch (error) {
      toastError(error.data?.message || "Échec de l'annulation");
    }
  };

  return (
    <div className="flex items-center gap-4 p-2">
      <div className="flex-1">
        <p className="font-medium">Virement en cours</p>
        <p className="text-sm text-gray-600">
          {timeLeft > 0 
            ? `Annulable dans ${timeLeft}s`
            : 'Trop tard pour annuler'}
        </p>
      </div>
      
      {timeLeft > 0 && (
        <button
          onClick={handleCancel}
          className="px-3 py-1 text-sm bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"
        >
          Annuler
        </button>
      )}
    </div>
  );
};

export default TransactionToast;