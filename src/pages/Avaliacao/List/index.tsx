import { TablePagination } from "@mui/material";
import { AxiosRequestConfig } from "axios";
import AvaliacaoCard from "components/AvaliacaoCard";
import Loader from "components/Loader";
import jsPDF from "jspdf";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AvaliacaoType } from "types/avaliacao";
import { formatarAvaliacao, formatarData } from "utils/functions";
import { requestBackend } from "utils/requests";
import * as XLSX from "xlsx";

const AvaliacaoList = () => {
  const [avaliacoes, setAvaliacoes] = useState<AvaliacaoType[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const loadInfo = useCallback(() => {
    setLoading(true);

    const requestParams: AxiosRequestConfig = {
      url: "/avaliacoes",
      method: "GET",
      withCredentials: true,
    };

    requestBackend(requestParams)
      .then((res) => {
        setAvaliacoes(res.data as AvaliacaoType[]);
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

  const filteredData = avaliacoes.filter((c) => {
    const searchTerm = filter.trim();
    if (!searchTerm) return true;

    return (
      c.treinamento.treinamento.toLowerCase().includes(searchTerm) ||
      (c.treinamento.brigada.toLowerCase().includes(searchTerm) ?? false) ||
      (c.treinamento.om.sigla.toLowerCase().includes(searchTerm) ?? false)
    );
  });

  const handleExportToExcel = () => {
    if (filteredData) {
      const avaliacoesProcessado = filteredData.map((a) => ({
        Treinamento: a.treinamento.treinamento,
        "Data Início": formatarData(a.treinamento.dataInicio),
        "Data Fim": formatarData(a.treinamento.dataFim),
        Instrutores: a.treinamento.instrutores
          ? a.treinamento.instrutores
              .map(
                (instrutor, index) =>
                  `Instrutor ${index + 1}: ${instrutor.nome}`
              )
              .join("; ")
          : "Nenhum instrutor",
        "Apostila Atualizada": formatarAvaliacao(a.apostilaAtualizada),
        "Engajamento dos instrutores": a.treinamento.instrutores
          ? a.treinamento.instrutores
              .map(
                (i) => `${i.nome}: ${formatarAvaliacao(Number(i.engajamento))}`
              )
              .join("; ")
          : "",
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
    doc.text("Capacitados", 5, 20);

    doc.setFontSize(12);
    const yStart = 50;
    let y = yStart;
    const lineHeight = 10;
    const marginLeft = 15;
    let colWidth = 140;
    let colWidthInstrutor = 35;

    filteredData?.forEach((a, i) => {
      doc.setFont("helvetica", "bold");
      doc.text(a.treinamento.treinamento, marginLeft, y);
      y += lineHeight;

      const data = [
        [
          "Qualidade geral da apostila do treinamento?",
          formatarAvaliacao(a.qualidadeMaterial),
        ],
        [
          "Apostila estava objetiva e clara para entendimento?",
          formatarAvaliacao(a.apostilaObjetiva),
        ],
        [
          "Apostila estava atualizada e em sequência adequada?",
          formatarAvaliacao(a.apostilaAtualizada),
        ],
        [
          "Questões estavam relacionadas ao conteúdo minstrado em aula?",
          formatarAvaliacao(a.questoesRelacionadas),
        ],
        [
          "Questões estavam claras e abrangentes?",
          formatarAvaliacao(a.questoesClaras),
        ],
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

      if (a.treinamento.instrutores && a.treinamento.instrutores.length > 0) {
        doc.setFont("helvetica", "bold");
        doc.text("Instrutores:", marginLeft, y);
        y += lineHeight;

        a.treinamento.instrutores.forEach((instrutor, index) => {
          doc.setFont("helvetica", "bold");
          doc.text(`Instrutor ${index + 1}:`, marginLeft, y);
          doc.setFont("helvetica", "normal");
          doc.text(`Nome: ${instrutor.nome}`, marginLeft + colWidthInstrutor, y);
          y += lineHeight;

          doc.text(
            `Engajamento: ${formatarAvaliacao(Number(instrutor.engajamento)) ?? "Não informado"}`,
            marginLeft + colWidthInstrutor,
            y
          );
          y += lineHeight;

          doc.text(
            `Clareza: ${formatarAvaliacao(Number(instrutor.clareza)) ?? "Não informado"}`,
            marginLeft + colWidthInstrutor,
            y
          );
          y += lineHeight;

          doc.text(
            `Nível de conhecimento técnico: ${formatarAvaliacao(Number(instrutor.nivelConhecimento)) ?? "Não informado"}`,
            marginLeft + colWidthInstrutor,
            y
          );
          y += lineHeight;

          doc.text(
            `Capacidade de responder a perguntas: ${formatarAvaliacao(Number(instrutor.capacidadeResposta)) ?? "Não informado"}`,
            marginLeft + colWidthInstrutor,
            y
          );
          y += lineHeight;

          doc.text(
            `Capacidade de gerir a aula e o tempo: ${formatarAvaliacao(Number(instrutor.capacidadeGerirAula)) ?? "Não informado"}`,
            marginLeft + colWidthInstrutor,
            y
          );
          y += lineHeight;

          if (y > 270) {
            doc.addPage();
            y = 20;
          }
        });
      } else {
        doc.setFont("helvetica", "italic");
        doc.text("Nenhum instrutor registrado.", marginLeft, y);
        y += lineHeight;
      }

      y += 10;
    });

    doc.save("capacitados.pdf");
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
        <Link to="/sgc/avaliacao/inserir">
          <button type="button" className="button create-button">
            Nova avaliação
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
                <th scope="col">Treinamento</th>
                <th scope="col">Ações</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {paginatedData.length > 0 ? (
                paginatedData.map((t) => (
                  <AvaliacaoCard onLoad={loadInfo} key={t.id} element={t} />
                ))
              ) : (
                <tr>
                  <td colSpan={2}>
                    <div className="no-elements-on-table">
                      <span>Não existem avaliações a serem exibidas.</span>
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
                    count={paginatedData.length}
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

export default AvaliacaoList;
