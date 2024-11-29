import { Link } from "react-router-dom";
import "./styles.css";
import { useCallback, useEffect, useState } from "react";
import { User } from "types/user";
import { AxiosRequestConfig } from "axios";
import { requestBackend } from "utils/requests";
import Loader from "components/Loader";
import UsuarioCard from "components/UsuarioCard";
import { TablePagination } from "@mui/material";
import { toast } from "react-toastify";

const UsuarioList = () => {
  const [loading, setLoading] = useState(false);
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const loadInfo = useCallback(() => {
    setLoading(true);

    const requestParams: AxiosRequestConfig = {
      url: "/usuarios",
      method: "GET",
      withCredentials: true,
    };

    requestBackend(requestParams)
      .then((res) => {
        setUsuarios(res.data as User[]);
      })
      .catch((err) => {
        toast.error("Erro ao resgatar os usuários.");
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

  const paginatedData = usuarios
    ? usuarios.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : [];

  useEffect(() => {
    loadInfo();
  }, [loadInfo]);

  return (
    <>
      <div className="top-list-buttons">
        <Link to="/sgc/usuario/inserir">
          <button type="button" className="button create-button">
            Novo usuário
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
                <th scope="col">Nome</th>
                <th scope="col">Sobrenome</th>
                <th scope="col">Identidade</th>
                <th scope="col">E-mail</th>
                <th scope="col">Perfil</th>
                <th scope="col">Ações</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {paginatedData.length > 0 ? (
                paginatedData.map((t) => (
                  <UsuarioCard onLoad={loadInfo} key={t.id} element={t} />
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
                    count={usuarios ? usuarios.length : 0}
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

export default UsuarioList;
