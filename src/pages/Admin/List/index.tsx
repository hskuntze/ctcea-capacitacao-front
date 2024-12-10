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
import * as XLSX from "xlsx";
import jsPDF from "jspdf";

const UsuarioList = () => {
  const [loading, setLoading] = useState(false);
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [filter, setFilter] = useState("");
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

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value.toLowerCase());
    setPage(0);
  };

  const filteredData = usuarios.filter((u) => {
    const searchTerm = filter.trim();
    if (!searchTerm) return true;

    return (
      u.nome.toLowerCase().includes(searchTerm) ||
      (u.sobrenome.toLowerCase().includes(searchTerm) ?? false) ||
      (u.identidade.toLowerCase().includes(searchTerm) ?? false) ||
      (u.email.toLowerCase().includes(searchTerm) ?? false) ||
      u.perfis.some((p) => p.autorizacao.toLowerCase().includes(searchTerm))
    );
  });

  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleExportToExcel = () => {
    if (filteredData) {
      const capacitadosProcessado = filteredData.map((u) => ({
        Nome: u.nome,
        Sobrenome: u.sobrenome,
        "Nome de guerra": u.nomeGuerra,
        "OM/Instituição": u.instituicao,
        Identidade: u.identidade,
        "E-mail": u.email,
        Telefone: u.telefone,
        Perfis: u.perfis.map((p) => `${p.autorizacao}`).join("; "),
        "Posto/graduação": u.posto ? u.posto.titulo : "",
      }));

      const ws = XLSX.utils.json_to_sheet(capacitadosProcessado);
      const wb = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(wb, ws, "Usuários");
      XLSX.writeFile(wb, "usuários.xlsx");
    }
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Usuarios", 5, 20);

    doc.setFontSize(12);
    const yStart = 30;
    let y = yStart;
    const lineHeight = 10;
    const marginLeft = 15;
    const colWidth = 50;

    filteredData?.forEach((u, i) => {
      doc.setFont("helvetica", "bold");
      doc.text(u.nome, marginLeft, y);
      y += lineHeight;

      let perfis = u.perfis.map((p) => `${p.autorizacao}`).join("; ");
      let posto = u.posto ? u.posto.titulo : "";

      const data = [
        ["Nome", u.nome],
        ["Sobrenome", u.sobrenome],
        ["Identidade", u.identidade],
        ["Email", u.email],
        ["Perfis", perfis],
        ["Nome de guerra", u.nomeGuerra ? u.nomeGuerra : ""],
        ["OM/Instituição", u.instituicao ? u.instituicao : ""],
        ["Telefone", u.telefone],
        ["Posto/graduação", posto],
      ];

      data.forEach(([k, v]) => {
        doc.setFont("helvetica", "bold");
        doc.text(k, marginLeft, y);
        doc.setFont("helvetica", "normal");
        doc.text(v, marginLeft + colWidth, y);
        y += lineHeight;

        if (y > 270) {
          doc.addPage();
          y = 20;
        }
      });

      y += 10;
    });

    doc.save("usuarios.pdf");
  };

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
          onClick={handleExportPDF}
          type="button"
          className="act-button create-button"
        >
          <i className="bi bi-filetype-pdf" />
        </button>
        <button
          onClick={handleExportToExcel}
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
              id="titulo-ocorrencia-filtro"
              placeholder="Digite um termo para filtrar"
              onChange={handleFilterChange}
            />
            <label htmlFor="titulo-ocorrencia-filtro">
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

export default UsuarioList;
