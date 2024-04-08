import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { useState } from "react";
import usePaymentsStore from "../store/paymentsStore";
import "dayjs/locale/es";
import dayjs from "dayjs";

const DateRangeFilter = () => {
  const today = dayjs();
  const [start, setStart] = useState(today);
  const [end, setEnd] = useState(today);
  const { fetchDateRange } = usePaymentsStore();

  function handleClick() {
    fetchDateRange(start, end);
  }

  return (
    <Box display="flex" justifyContent="center" gap={4}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
        <DatePicker
          label="Desde"
          onChange={(e) => setStart(e.$d.toISOString().split("T")[0])}
        />
        <DatePicker
          label="Hasta"
          onChange={(e) => setEnd(e.$d.toISOString().split("T")[0])}
          maxDate={today}
        />
      </LocalizationProvider>
      <Button variant="contained" size="medium" onClick={handleClick}>
        Buscar
      </Button>
    </Box>
  );
};
export default DateRangeFilter;
