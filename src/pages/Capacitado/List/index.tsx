import "./styles.css";
import { Link } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import Loader from "components/Loader";
import { CapacitadoType } from "types/capacitado";
import { AxiosRequestConfig } from "axios";
import { requestBackend } from "utils/requests";
import { TablePagination } from "@mui/material";
import CapacitadoCard from "components/CapacitadoCard";

const CapacitadoList = () => {
  const [capacitados, setCapacitados] = useState<CapacitadoType[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const loadInfo = useCallback(() => {
    setLoading(true);

    const requestParams: AxiosRequestConfig = {
      url: "/capacitados",
      method: "GET",
      withCredentials: true,
    };

    requestBackend(requestParams)
      .then((res) => {
        setCapacitados(res.data as CapacitadoType[]);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handlePageChange = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    pageNumber: number
  ) => {
    setPage(pageNumber);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedData = capacitados
    ? capacitados.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : [];

  useEffect(() => {
    loadInfo();
  }, [loadInfo]);

  return (
    <>
      <div className="top-list-buttons">
        <Link to="/sgc/capacitado/inserir">
          <button type="button" className="button create-button">
            Novo capacitado
          </button>
        </Link>
        <button
          //   onClick={handleExportPDF}
          type="button"
          className="act-button create-button"
        >
          <i className="bi bi-filetype-pdf" />
        </button>
        <button
          //   onClick={handleExportToExcel}
          type="button"
          className="act-button create-button"
        >
          <i className="bi bi-file-earmark-excel" />
        </button>
      </div>
      <div className="list-container">
        {loading ? (
          <div className="loader-div">
            <Loader height="100" width="100" />
          </div>
        ) : (
          <table className="table-container">
            <thead className="table-head">
              <tr>
                <th scope="col">Nome do capacitado</th>
                <th scope="col">Treinamento</th>
                <th scope="col">Brigada</th>
                <th scope="col">OM</th>
                <th scope="col">Turma</th>
                <th scope="col">Data início</th>
                <th scope="col">Data fim</th>
                <th scope="col">Modalidade</th>
                <th scope="col">Ações</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {paginatedData.length > 0 ? (
                paginatedData.map((t) => (
                  <CapacitadoCard onLoad={loadInfo} key={t.id} element={t} />
                ))
              ) : (
                <tr>
                  <td colSpan={14}>
                    <div className="no-elements-on-table">
                      <span>Não existem capacitados a serem exibidos.</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr>
                <td>
                  <TablePagination
                    className="table-pagination-container"
                    component="div"
                    count={capacitados ? capacitados.length : 0}
                    page={page}
                    onPageChange={handlePageChange}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Registros por página: "
                    labelDisplayedRows={({ from, to, count }) => {
                      return `${from} - ${to} de ${count}`;
                    }}
                    classes={{
                      selectLabel: "pagination-select-label",
                      displayedRows: "pagination-displayed-rows-label",
                      select: "pagination-select",
                      toolbar: "pagination-toolbar",
                    }}
                  />
                </td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>
    </>
  );
};

export default CapacitadoList;
