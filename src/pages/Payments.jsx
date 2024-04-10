import { Navigate } from "react-router-dom";
import PaymentsTable from "../components/PaymentsTable";
import DateRangeFilter from "../components/DateRangeFilter";
import { useAuthenticator } from "@aws-amplify/ui-react";

const Payments = () => {
  const { route } = useAuthenticator((context) => [context.route]);

  return route !== "authenticated" ? (
    <Navigate to="/" replace={true} />
  ) : (
    <div className="p-10">
      <DateRangeFilter />
      <PaymentsTable />
    </div>
  );
};

export default Payments;
