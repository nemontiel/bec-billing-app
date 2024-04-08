import PaymentsTable from "../components/PaymentsTable";
import DateRangeFilter from "../components/DateRangeFilter";

const Payments = () => {
  return (
    <div>
      <DateRangeFilter />
      <PaymentsTable />
    </div>
  );
};

export default Payments;
