import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import usePaymentsStore from "../store/paymentsStore";
import TablePaginationActions from "./TablePaginationActions";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import { useRef } from "react";
import { utils, writeFileXLSX } from "xlsx";
import * as XLSX from "xlsx";
import dayjs from "dayjs";

const PaymentsTable = () => {
  const { payments, isLoading, error, fetchPayments } = usePaymentsStore();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const tbl = useRef(null);

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - payments.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatDate = (date) => {
    const formattedDate = dayjs(date).format("DD-MM-YYYY");
    return formattedDate;
  };

  const headers = [
    "Fecha de Pago",
    "Orden de Compra",
    "Código de Autorización",
    "Monto",
    "Email",
    "RUT",
    "Nombre",
    "Factura",
    "Razón Social",
    "Dirección",
    "Comuna",
  ];

  useEffect(() => {
    //fetchPayments();
  }, []);

  const createXlsx = () => {
    const xlsxPayments = formatPayments(payments);
    const worksheet = XLSX.utils.json_to_sheet(xlsxPayments);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.sheet_add_aoa(
      worksheet,
      [
        [
          "Fecha de Pago",
          "Orden de Compra",
          "Cod_Autorización",
          "Monto",
          "Email",
          "RUT",
          "Nombre",
          "Factura",
          "Dirección",
          "Comuna",
        ],
      ],
      { origin: "A1" }
    );
    XLSX.utils.book_append_sheet(workbook, worksheet, "Pagos");
    XLSX.writeFile(workbook, "Pagos.xlsx", { compression: true });
  };

  const formatPayments = (arr) => {
    const formatted = arr.map((el) => ({
      ...el,
      fecha_actualizacion: formatDate(el.fecha_actualizacion),
      es_boleta: !el.es_boleta ? "Sí" : "No",
    }));
    return formatted;
  };

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
    <div className="container py-2 flex flex-col justify-center">
      <TableContainer component={Paper} className="">
        <Table ref={tbl} className="w-full">
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
                <TableCell
                  sx={{
                    maxWidth: 100,
                    overflowX: "hidden",
                  }}
                >
                  {el.token}
                </TableCell>
                <TableCell>{el.monto}</TableCell>
                <TableCell>{el.email}</TableCell>
                <TableCell>{el.rut}</TableCell>
                <TableCell>{el.nombre}</TableCell>
                <TableCell>{!el.es_boleta ? "Sí" : "No"}</TableCell>
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
        </Table>
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
      </TableContainer>
      <div className="py-2 flex flex-row justify-end gap-5">
        <Button
          variant="contained"
          onClick={createXlsx}
          sx={{ backgroundColor: "#008fbe" }}
        >
          Descargar
        </Button>
      </div>
    </div>
  );
};

export default PaymentsTable;
