import { useCallback, useState } from "react";
import { API_URL } from "../constants/api";
// const API_URL = "http://localhost:5001/api";

export const useTransactions = (userId, { showQuickSuccess, showError } = {}) => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    balance: 0,
    income: 0,
    expenses: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // useCallback is used for performance reasons, it will memoize the function
  const fetchTransactions = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/transactions/${userId}`);
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  }, [userId]);

  const fetchSummary = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/transactions/summary/${userId}`);
      const data = await response.json();
      setSummary(data);
    } catch (error) {
      console.error("Error fetching summary:", error);
    }
  }, [userId]);

  // call fetchTransactions and fetchSummary at once 
  const loadData = useCallback(async () => {
    if (!userId) return;

    setIsLoading(true);
    try {
      // can be run in parallel
      await Promise.all([fetchTransactions(), fetchSummary()]);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchTransactions, fetchSummary, userId]);

  const deleteTransaction = async (id) => {
    try {
      const response = await fetch(`${API_URL}/transactions/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete transaction");

      // Refresh data after deletion
      loadData();
      showQuickSuccess && showQuickSuccess("Transaction deleted successfully");
    } catch (error) {
      console.error("Error deleting transaction:", error);
      showError && showError("Error", error.message);
    }
  };

  const addTransaction = useCallback((newTransaction) => {
    // Add transaction optimistically to the local state
    setTransactions(prev => [newTransaction, ...prev]);
    
    // Update summary optimistically
    setSummary(prev => {
      const amount = newTransaction.amount;
      return {
        balance: prev.balance + amount,
        income: amount > 0 ? prev.income + amount : prev.income,
        expenses: amount < 0 ? prev.expenses + Math.abs(amount) : prev.expenses,
      };
    });
  }, []);

  return { transactions, summary, isLoading, loadData, deleteTransaction, addTransaction };
};