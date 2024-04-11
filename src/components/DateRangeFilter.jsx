import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { useState } from "react";
import Paper from "@mui/material/Paper";
import usePaymentsStore from "../store/paymentsStore";
import "dayjs/locale/es";
import dayjs from "dayjs";

const DateRangeFilter = () => {
  const today = dayjs();
  const [start, setStart] = useState(today);
  const [end, setEnd] = useState(today);
  const { fetchDateRange, fetchPayments } = usePaymentsStore();

  function handleRangeClick() {
    fetchDateRange(start, end);
  }

  function handleResetClick() {
    setStart(today);
    setEnd(today);
    fetchPayments();
  }

  return (
    <Box
      className="flex flex-col items-start gap-5 py-2 w-full p-5 container"
      component={Paper}
    >
      <div>
        <h3 className="text-cyan-600 font-semibold ">
          Filtrar por rango de fechas
        </h3>
      </div>
      <div className="flex flex-row justify-center items-center gap-5">
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
          <DatePicker
            label="Desde"
            onChange={(e) => setStart(e.$d.toISOString().split("T")[0])}
          />
          <DatePicker
            label="Hasta"
            onChange={(e) => setEnd(e.$d.toISOString().split("T")[0])}
            maxDate={today}
            size="small"
          />
        </LocalizationProvider>
        <Button
          variant="contained"
          disableElevation
          onClick={handleRangeClick}
          sx={{ height: 36, backgroundColor: "#008fbe" }}
        >
          Buscar
        </Button>
      </div>
      <div>
        <Button variant="outlined" onClick={handleResetClick}>
          Ver todos
        </Button>
      </div>
    </Box>
  );
};
export default DateRangeFilter;
