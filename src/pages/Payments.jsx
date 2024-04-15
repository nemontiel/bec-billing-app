import { Navigate } from "react-router-dom";
import { useAuthenticator } from "@aws-amplify/ui-react";

import PaymentsTable from "../components/PaymentsTable";
import DateRangeFilter from "../components/DateRangeFilter";

const Payments = () => {
  const { route } = useAuthenticator((context) => [context.route]);

  return route !== "authenticated" ? (
    <Navigate to="/" replace={true} />
  ) : (
    <div className="pt-10 flex flex-col items-center">
      <DateRangeFilter />
      <PaymentsTable />
    </div>
  );
};

export default Payments;
