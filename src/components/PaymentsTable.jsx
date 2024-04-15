import { useEffect, useState, useRef } from "react";
import usePaymentsStore from "../store/paymentsStore";
import { Table, Spin, Alert, Button, Space, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import dayjs from "dayjs";
import * as XLSX from "xlsx";

const PaymentsTable = () => {
  const {
    payments,
    isLoading,
    error,
    fetchPayments,
    fetchAuthorized,
    tableTitle,
    updateTableTitle,
  } = usePaymentsStore();
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  useEffect(() => {
    //fetchPayments();
    fetchAuthorized();
  }, []);

  const columns = [
    {
      title: "Fecha de Pago",
      dataIndex: "fecha",
      sorter: (a, b) =>
        dayjs(a.fecha, "DD-MM-YYYY") - dayjs(b.fecha, "DD-MM-YYYY"),
      sortDirections: ["ascend", "descend", "ascend"],
      align: "right",
    },
    {
      title: "O. de Compra",
      dataIndex: "orden",
      align: "right",
      ...getColumnSearchProps("orden"),
    },
    {
      title: "Estado",
      dataIndex: "estado",
      filters: [
        { text: "Autorizado", value: "Autorizado" },
        { text: "Pendiente", value: "Pendiente" },
      ],
      filterMode: "tree",
      filerSearch: true,
      onFilter: (value, record) => record.estado.startsWith(value),
    },
    { title: "Cód. Autorización", dataIndex: "codigo", align: "right" },
    {
      title: "Monto",
      dataIndex: "monto",
      align: "right",
      sorter: (a, b) => a.monto - b.monto,
      sortDirections: ["ascend", "descend", "ascend"],
    },
    { title: "Email", dataIndex: "email" },
    { title: "RUT Cliente", dataIndex: "rut_cliente" },
    { title: "Nombre", dataIndex: "nombre", ...getColumnSearchProps("nombre") },
    {
      title: "Factura",
      dataIndex: "factura",
      filters: [
        { text: "Sí", value: "Sí" },
        { text: "No", value: "No" },
      ],
      filterMode: "tree",
      filerSearch: true,
      onFilter: (value, record) => record.factura.startsWith(value),
    },
    { title: "RUT Empresa", dataIndex: "rut_empresa " },
    {
      title: "Razón Social",
      dataIndex: "razon",
      ...getColumnSearchProps("razon"),
    },
    { title: "Giro", dataIndex: "giro" },
    { title: "Dirección", dataIndex: "direccion" },
    { title: "Comuna", dataIndex: "coumna" },
  ];

  const tableData = (array) => {
    let data = array.map((item) => {
      const metadatos = JSON.parse(item.metadatos);
      let codigo;

      if (
        metadatos !== null &&
        metadatos.authorization_code !== "" &&
        metadatos.authorization_code !== undefined
      ) {
        codigo = metadatos.authorization_code;
      } else if (metadatos !== null && metadatos.details !== undefined) {
        codigo = metadatos.details[0].authorization_code;
      } else {
        codigo = ""; // Otra opción si no se encuentra el estado
      }

      return {
        fecha: dayjs(item.fecha_actualizacion).format("DD-MM-YYYY"),
        orden: item.num_orden,
        estado: item.estado_trx == 1 ? "Autorizado" : "Pendiente",
        codigo: codigo,
        monto: item.monto,
        email: item.email,
        rut_cliente: item.rut,
        nombre: item.nombre,
        factura: !item.es_boleta ? "Sí" : "No",
        rut_empresa: item.rut_empresa,
        razon: item.razon_Social,
        giro: item.giro,
        direccion: item.direccion,
        comuna: item.comuna,
      };
    });
    return data;
  };

  const createXlsx = () => {
    const xlsxData = tableData(payments);
    const worksheet = XLSX.utils.json_to_sheet(xlsxData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.sheet_add_aoa(
      worksheet,
      [
        [
          "Fecha de Pago",
          "Orden de Compra",
          "Estado",
          "Código Autorización",
          "Monto",
          "Email",
          "RUT Cliente",
          "Nombre",
          "Factura",
          "RUT Empresa",
          "Razón Social",
          "Giro",
          "Dirección",
          "Comuna",
        ],
      ],
      { origin: "A1" }
    );
    XLSX.utils.book_append_sheet(workbook, worksheet, "Pagos");
    XLSX.writeFile(workbook, "Pagos.xlsx", { compression: true });
  };

  if (isLoading) {
    return (
      <div className="flex flex-row justify-center items-center mt-20">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-10">
        <Alert
          message="Error"
          description="Se ha producido un error recuperando los datos"
          type="error"
        />
      </div>
    );
  }

  return (
    <div className="py-2 flex flex-col px-5 w-full">
      <div className="bg-stone-100 p-5 w-full flex flex-col">
        <h3 className="text-cyan-600 font-semibold self-start p-2">
          {tableTitle}
        </h3>
        <Table
          columns={columns}
          dataSource={tableData(payments)}
          align="right"
          className="w-full"
          scroll={{ x: "max-content" }}
        />
      </div>
      <div className="flex flex-row justify-end py-5">
        <Button onClick={createXlsx} size="large">
          Exportar a Excel
        </Button>
      </div>
    </div>
  );
};

export default PaymentsTable;
