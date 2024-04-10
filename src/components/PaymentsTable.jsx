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
import dayjs from "dayjs";
import { CSVLink } from "react-csv";

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
    "Apellido",
    "Factura",
    "Razón Social",
    "Dirección",
    "Comuna",
  ];

  useEffect(() => {
    //fetchPayments();
  }, []);

  const downloadCSV = () => {
    // Convertir los datos en formato CSV
    const csvContent =
      "data:text/csv;charset=utf-8," +
      payments.map((row) => Object.values(row).join(",")).join("\n");
    // Crear un enlace temporal y simular el clic para descargar el archivo CSV
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const convertToCSV = () => {
    // Agregar los encabezados
    let csv = headers.join(",") + "\n";

    // Agregar los datos
    payments.forEach((row) => {
      const values = headers.map((header) => row[header]);
      csv += values.join(",") + "\n";
    });

    return csv;
  };

  // Función para descargar el archivo CSV
  const downloadCSV2 = () => {
    const csv = convertToCSV();
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "datos.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
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
    <div className="container py-2">
      <TableContainer component={Paper}>
        <Table ref={tbl}>
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
      <Button
        variant="contained"
        onClick={() => {
          // generate workbook from table element
          const wb = utils.table_to_book(tbl.current, {
            dateNF: "dd-mm-yyyy;@",
            cellDates: true,
            raw: true,
          });
          // write to XLSX
          writeFileXLSX(wb, "SheetJSReactExport.xlsx");
        }}
      >
        Descargar
      </Button>
      <Button variant="contained" onClick={downloadCSV}>
        CSV
      </Button>
      <CSVLink data={payments}>Descargar CSV</CSVLink>
    </div>
  );
};

export default PaymentsTable;
