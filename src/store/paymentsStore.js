import { create } from "zustand";

const paymentsUrl = import.meta.env.VITE_URL_GET_PAYMENTS;

const usePaymentsStore = create((set) => ({
  payments: [],
  isLoading: false,
  error: null,
  tableTitle: "Autorizados",
  updateTableTitle: (newTitle) => set({ tableTitle: newTitle }),
  fetchPayments: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetch(paymentsUrl);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      //console.log(JSON.parse(data.body));
      set({ payments: JSON.parse(data.body), isLoading: false });
    } catch (error) {
      set({ isLoading: false, error: error.message });
      console.error("Error fetching payments:", error);
    }
  },
  fetchDateRange: async (start, end) => {
    set({ isLoading: true, error: null, payments: [] });
    try {
      const response = await fetch("/api", {
        method: "POST",
        body: JSON.stringify({ startDate: start, endDate: end }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      //console.log(JSON.parse(data.body));
      set({ payments: JSON.parse(data.body), isLoading: false });
    } catch (error) {
      set({ isLoading: false, error: error.message });
      console.error("Error fetching payments:", error);
    }
  },
  fetchAuthorized: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetch(paymentsUrl + "authorized/");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      // console.log(JSON.parse(data.body));
      set({ payments: JSON.parse(data.body), isLoading: false });
    } catch (error) {
      set({ isLoading: false, error: error.message });
      console.error("Error fetching payments:", error);
    }
  },
}));

export default usePaymentsStore;
