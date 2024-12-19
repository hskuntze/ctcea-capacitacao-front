import { TablePagination } from "@mui/material";
import { AxiosRequestConfig } from "axios";
import Loader from "components/Loader";
import OMCard from "components/OMCard";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { OM } from "types/om";
import { requestBackend } from "utils/requests";

const OMList = () => {
  const [oms, setOms] = useState<OM[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const loadInfo = useCallback(() => {
    setLoading(true);

    const requestParams: AxiosRequestConfig = {
      url: "/oms",
      method: "GET",
      withCredentials: true,
    };

    requestBackend(requestParams)
      .then((res) => {
        setOms(res.data as OM[]);
      })
      .catch((err) => {
        toast.error("Erro ao tentar resgatar as organizações militares.");
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

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value.toLowerCase());
    setPage(0);
  };

  const filteredData = oms.filter((o) => {
    const searchTerm = filter.trim();
    if (!searchTerm) return true;

    return (
      o.bda.toLowerCase().includes(searchTerm) ||
      (o.sigla.toLowerCase().includes(searchTerm) ?? false) ||
      (o.cidadeestado.toLowerCase().includes(searchTerm) ?? false) ||
      (o.endereco.toLowerCase().includes(searchTerm) ?? false)
    );
  });

  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  useEffect(() => {
    loadInfo();
  }, [loadInfo]);

  return (
    <>
      <div className="top-list-buttons">
        <Link to="/sgc/om/inserir">
          <button type="button" className="button create-button">
            Nova OM
          </button>
        </Link>
        <button
          //onClick={handleExportPDF}
          type="button"
          className="act-button create-button"
        >
          <i className="bi bi-filetype-pdf" />
        </button>
        <button
          //onClick={handleExportToExcel}
          type="button"
          className="act-button create-button"
        >
          <i className="bi bi-file-earmark-excel" />
        </button>
      </div>
      <div className="filtro-container">
        <form>
          <div className="filtro-input-div form-floating">
            <input
              type="text"
              className="form-control filtro-input"
              id="nome-treinamento-filtro"
              placeholder="Digite um termo para filtrar"
              onChange={handleFilterChange}
            />
            <label htmlFor="nome-treinamento-filtro">
              Digite um termo para filtrar
            </label>
          </div>
          <button className="search-button" type="button">
            <i className="bi bi-search" />
          </button>
        </form>
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
                <th scope="col">Sigla</th>
                <th scope="col">Brigada</th>
                <th scope="col">Endereço</th>
                <th scope="col">Cidade/UF</th>
                <th scope="col">Ações</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {paginatedData.length > 0 ? (
                paginatedData.map((om) => (
                  <OMCard onLoad={loadInfo} key={om.codigo} element={om} />
                ))
              ) : (
                <tr>
                  <td colSpan={9}>
                    <div className="no-elements-on-table">
                      <span>Não existem OM's a serem exibidas.</span>
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
                    count={filteredData.length}
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

export default OMList;
