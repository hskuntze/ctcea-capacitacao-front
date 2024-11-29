import { Link } from "react-router-dom";
import "./styles.css";
import { useCallback, useEffect, useState } from "react";
import Loader from "components/Loader";
import { AxiosRequestConfig } from "axios";
import { requestBackend } from "utils/requests";
import { OcorrenciaType } from "types/ocorrencia";
import { TablePagination } from "@mui/material";
import OcorrenciaCard from "components/OcorrenciaCard";

const OcorrenciaList = () => {
  const [loading, setLoading] = useState(false);
  const [ocorrencias, setOcorrencias] = useState<OcorrenciaType[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const loadInfo = useCallback(() => {
    setLoading(true);

    const requestParams: AxiosRequestConfig = {
      url: "/ocorrencias",
      method: "GET",
      withCredentials: true,
    };

    requestBackend(requestParams)
      .then((res) => {
        setOcorrencias(res.data as OcorrenciaType[]);
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

  const paginatedData = ocorrencias
    ? ocorrencias.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : [];

  useEffect(() => {
    loadInfo();
  }, [loadInfo]);

  return (
    <>
      <div className="top-list-buttons">
        <Link to="/sgc/ocorrencia/inserir">
          <button type="button" className="button create-button">
            Nova ocorrência
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
                <th scope="col">Título</th>
                <th scope="col">Ações</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {paginatedData.length > 0 ? (
                paginatedData.map((t) => (
                  <OcorrenciaCard onLoad={loadInfo} key={t.id} element={t} />
                ))
              ) : (
                <tr>
                  <td colSpan={9}>
                    <div className="no-elements-on-table">
                      <span>Não existem ocorrências a serem exibidas.</span>
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
                    count={ocorrencias ? ocorrencias.length : 0}
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

export default OcorrenciaList;
