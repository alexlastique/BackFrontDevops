import React, { useState, useEffect } from "react";
import { axiosGet } from "../utils/function";
import axiosInstance from "../axiosConfig";
import AddBeneficiary from "../components/AddBeneficiary";
import TransferFormModal from "../components/transferFormModal";
import BeneficiaryCard from "../components/BeneficiaryCard";
import AccountCard from "../components/accountCard";

export default function Transfer() {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);
  const [showAddBeneficiary, setShowAddBeneficiary] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);

  const fetchData = async () => {
    try {
      axiosInstance.defaults.headers.common['Authorization'] = "bearer " + localStorage.getItem("token");
      const [benefResp, accountsResp] = await Promise.all([
        axiosGet("/beneficiaries"),
        axiosGet("/comptes")
      ]);
      setBeneficiaries(benefResp || []);
      setAccounts(accountsResp || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedAccount && selectedBeneficiary) {
      setShowTransferModal(true);
    }
  }, [selectedAccount, selectedBeneficiary]);

  const resetSelections = () => {
    setSelectedAccount(null);
    setSelectedBeneficiary(null);
    setShowTransferModal(false);
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      {showTransferModal && (
        <TransferFormModal
          account={selectedAccount}
          beneficiary={selectedBeneficiary}
          onClose={resetSelections}
        />
      )}

      {showAddBeneficiary && (
        <AddBeneficiary 
          onClose={() => {
            setShowAddBeneficiary(false);
            fetchData();
          }}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Mes Comptes ({accounts.length})</h2>
          <div className="grid grid-cols-1 gap-4">
            {accounts.map((account) => (
              <AccountCard
                key={account.iban}
                account={account}
                isSelected={selectedAccount?.iban === account.iban}
                onClick={() => setSelectedAccount(account)}
              />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Bénéficiaires ({beneficiaries.length})</h2>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={() => setShowAddBeneficiary(true)}
            >
              Ajouter un bénéficiaire
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {beneficiaries.map((benef) => (
              <BeneficiaryCard
                key={benef.iban}
                benef={benef}
                isSelected={selectedBeneficiary?.iban === benef.iban}
                onClick={() => setSelectedBeneficiary(benef)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}