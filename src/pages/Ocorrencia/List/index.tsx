import { Link } from "react-router-dom";
import "./styles.css";
import { useCallback, useEffect, useState } from "react";
import Loader from "components/Loader";
import { AxiosRequestConfig } from "axios";
import { requestBackend } from "utils/requests";
import { OcorrenciaType } from "types/ocorrencia";
import { TablePagination } from "@mui/material";
import OcorrenciaCard from "components/OcorrenciaCard";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import { formatarData, formatarNivelImpacto, formatarStatusOcorrencia, formatarTipoOcorrencia } from "utils/functions";

const OcorrenciaList = () => {
  const [loading, setLoading] = useState(false);
  const [ocorrencias, setOcorrencias] = useState<OcorrenciaType[]>([]);
  const [filter, setFilter] = useState("");
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

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value.toLowerCase());
    setPage(0);
  };

  const filteredData = ocorrencias.filter((o) => {
    const searchTerm = filter.trim();
    if (!searchTerm) return true;

    return o.titulo.toLowerCase().includes(searchTerm);
  });

  const handleExportToExcel = () => {
    if (filteredData) {
      const avaliacoesProcessado = filteredData.map((o) => ({
        ...o,
      }));

      const ws = XLSX.utils.json_to_sheet(avaliacoesProcessado);
      const wb = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(wb, ws, "Avaliações");
      XLSX.writeFile(wb, "avaliacoes.xlsx");
    }
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Ocorrências", 5, 20);

    doc.setFontSize(12);
    const yStart = 50;
    let y = yStart;
    const lineHeight = 10;
    const marginLeft = 15;
    let colWidth = 125;

    filteredData?.forEach((o, i) => {
      doc.setFont("helvetica", "bold");
      doc.text(o.titulo, marginLeft, y);
      y += lineHeight;

      const data = [
        ["Treinamento", o.treinamento.treinamento],
        ["Data da ocorrência", formatarData(o.dataOcorrencia)],
        ["Tipo de ocorrência", formatarTipoOcorrencia(o.tipoOcorrencia)],
        ["Houve impacto da ocorrência?", o.impactoOcorrencia === true ? "Sim" : "Não"],
        ["Nível do impacto", formatarNivelImpacto(o.nivelImpacto)],
        ["Descrição do impacto", o.descricaoImpacto],
        ["Status da ocorrência", formatarStatusOcorrencia(o.statusClassificacao)],
        ["Probabilidade de recorrência", formatarNivelImpacto(o.probabilidadeRecorrencia)],
        ["Lições aprendidas", o.descricaoLicoesAprendidas],
        ["Nome do responsável pelo levantamento da ocorrência", o.nomeResponsavelOcorrencia],
        ["Instituição do responsável pelo levantamento da ocorrência", o.instituicaoResponsavelOcorrencia],
        ["Contato do responsável pelo levantamento da ocorrência", o.contatoResponsavelOcorrencia],
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

    doc.save("ocorrencias.pdf");
  };

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
        <Link to="/sgc/ocorrencia/inserir">
          <button type="button" className="button create-button">
            Nova ocorrência
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
