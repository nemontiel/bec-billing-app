import { useState } from "react";
import { DatePicker, ConfigProvider, Button } from "antd";
import usePaymentsStore from "../store/paymentsStore";
import locale from "antd/locale/es_ES";
import dayjs from "dayjs";

import "dayjs/locale/es-mx";
import { formats } from "dayjs/locale/es-mx";
import { useRef } from "react";

const today = dayjs();

const { RangePicker } = DatePicker;

const DateRangeFilter = () => {
  const [start, setStart] = useState(today);
  const [end, setEnd] = useState(today);
  const [titleDates, setTitleDates] = useState([]);
  const { fetchDateRange, fetchPayments, updateTableTitle } =
    usePaymentsStore();

  const handlePickerChange = (dates, dateStrings) => {
    const [start, end] = dateStrings;
    setTitleDates(dateStrings);
    const queryDateStart = dayjs(start, "DD-MM-YYYY");
    const queryDateEnd = dayjs(end, "DD-MM-YYYY");
    setStart(queryDateStart.format("YYYY-MM-DD"));
    setEnd(queryDateEnd.format("YYYY-MM-DD"));
  };
  function handleRangeClick() {
    fetchDateRange(start, end);
    updateTableTitle(`Pagos del ${titleDates[0]} al ${titleDates[1]}`);
  }

  function handleAllClick() {
    fetchPayments();
    updateTableTitle("Todos los pagos");
  }

  return (
    <div className="flex flex-col items-start gap-5 py-2 w-full  container ">
      <div className=" flex flex-col items-start center">
        <div className="">
          <h3 className="text-cyan-600 font-semibold ">
            Filtrar por rango de fechas
          </h3>
        </div>
        <div className="flex flex-row justify-center items-center gap-5">
          <ConfigProvider locale={locale}>
            <RangePicker
              format={"DD-MM-YYYY"}
              onChange={handlePickerChange}
              size="large"
            />
          </ConfigProvider>
          <Button onClick={handleRangeClick} size="large">
            Buscar
          </Button>
        </div>
      </div>

      <div className="flex flex-row justify-start gap-5 items-center ">
        <h3 className=" text-cyan-600 font-semibold ">
          Consultar todos los registros
        </h3>
        <Button onClick={handleAllClick} size="large">
          Consultar
        </Button>
      </div>
    </div>
  );
};

export default DateRangeFilter;
