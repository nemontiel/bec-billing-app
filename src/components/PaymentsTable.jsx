import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import usePaymentsStore from "../store/paymentsStore";
import TablePaginationActions from "./TablePaginationActions";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";

const PaymentsTable = () => {
  const { payments, isLoading, error, fetchPayments } = usePaymentsStore();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - payments.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  function formatDate(stringDate) {
    const date = new Date(stringDate);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const formattedDate = `${day < 10 ? "0" + day : day}-${
      month < 10 ? "0" + month : month
    }-${year}`;
    return formattedDate;
  }

  const headers = [
    "Fecha de Pago",
    "Orden de Compra",
    "Código de Autorización",
    "Monto",
    "Email",
    "RUT",
    "Nombre",
    "Apellido",
    "Factura",
    "Razón Social",
    "Dirección",
    "Comuna",
  ];

  useEffect(() => {
    fetchPayments();
  }, []);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ marginTop: 10 }}>
        <Alert severity="error">
          Ha ocurrido un error recuperando los datos.
        </Alert>
      </Box>
    );
  }

  return (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {headers.map((el, idx) => (
                <TableCell key={idx}>{el}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? payments.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
              : payments
            ).map((el) => (
              <TableRow key={el.num_orden}>
                <TableCell>{formatDate(el.fecha_actualizacion)}</TableCell>
                <TableCell>{el.num_orden}</TableCell>
                <TableCell>Cod. autorización</TableCell>
                <TableCell>{el.monto}</TableCell>
                <TableCell>{el.email}</TableCell>
                <TableCell>{el.rut}</TableCell>
                <TableCell>{el.nombre}</TableCell>
                <TableCell>Apellido</TableCell>
                <TableCell>{el.es_boleta}</TableCell>
                <TableCell>Razón Social</TableCell>
                <TableCell>{el.direccion}</TableCell>
                <TableCell>{el.comuna}</TableCell>
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: "Todos", value: -1 }]}
                colSpan={3}
                count={payments.length}
                rowsPerPage={rowsPerPage}
                page={page}
                slotProps={{
                  select: {
                    inputProps: {
                      "aria-label": "filas por página",
                    },
                    native: true,
                  },
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </div>
  );
};

export default PaymentsTable;