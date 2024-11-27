import { useCallback, useEffect, useState } from "react";
import "./styles.css";
import { TreinamentoType } from "types/treinamento";
import { AxiosRequestConfig } from "axios";
import { requestBackend } from "utils/requests";
import TreinamentoCard from "components/TreinamentoCard";
import { Link } from "react-router-dom";
import Loader from "components/Loader";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import {
  formatarData,
  formatarModalidade,
  formatarPublicoAlvo,
  formatarStatus,
  formatarTipo,
} from "utils/functions";
import { TablePagination } from "@mui/material";

const TreinamentoList = () => {
  const [treinamentos, setTreinamentos] = useState<TreinamentoType[]>();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const loadInfo = useCallback(() => {
    setLoading(true);

    const requestParams: AxiosRequestConfig = {
      url: "/treinamentos",
      method: "GET",
      withCredentials: true,
    };

    requestBackend(requestParams)
      .then((res) => {
        setTreinamentos(res.data as TreinamentoType[]);
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

  const paginatedData = treinamentos
    ? treinamentos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : [];

  const handleExportToExcel = () => {
    if (treinamentos) {
      const treinamentoProcessado = treinamentos.map((t) => ({
        ...t,
        avaliacaoPratica: t.avaliacaoPratica === true ? "Sim" : "Não",
        avaliacaoTeorica: t.avaliacaoTeorica === true ? "Sim" : "Não",
        certificado: t.certificado === true ? "Sim" : "Não",
        nivelamento: t.nivelamento === true ? "Sim" : "Não",
        publicoAlvo: formatarPublicoAlvo(t.publicoAlvo),
        dataInicio: formatarData(t.dataInicio),
        dataFim: formatarData(t.dataFim),
        status: formatarStatus(t.status),
        tipo: formatarTipo(t.tipo),
        modalidade: formatarModalidade(Number(t.modalidade)),
        executor: t.executor === 1 ? "EB" : "Empresa",
      }));

      const ws = XLSX.utils.json_to_sheet(treinamentoProcessado);
      const wb = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(wb, ws, "Treinamentos");
      XLSX.writeFile(wb, "treinamentos.xlsx");
    }
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Treinamentos", 5, 20);

    doc.setFontSize(12);
    const yStart = 30;
    let y = yStart;
    const lineHeight = 10;
    const marginLeft = 15;
    const colWidth = 50;

    treinamentos?.forEach((t, i) => {
      doc.setFont("helvetica", "bold");
      doc.text(t.treinamento, marginLeft, y);
      y += lineHeight;

      const data = [
        ["Tipo", formatarTipo(t.tipo)],
        ["Material", t.material],
        ["Data Início", formatarData(t.dataInicio)],
        ["Data Fim", formatarData(t.dataFim)],
        ["Vagas", String(t.vagas)],
        ["Status", formatarTipo(t.tipo)],
        [
          "Avaliação Prática",
          String(t.avaliacaoPratica) === "1" ? "Sim" : "Não",
        ],
        [
          "Avaliação Teórica",
          String(t.avaliacaoTeorica) === "1" ? "Sim" : "Não",
        ],
        ["Certificado", String(t.certificado) === "1" ? "Sim" : "Não"],
        ["Logística do t", t.logisticaTreinamento],
        ["Nivelamento", String(t.nivelamento)],
        ["Carga Horária", String(t.cargaHoraria)],
        ["Público Alvo", formatarPublicoAlvo(t.publicoAlvo)],
        ["Descrição da Atividade", t.descricaoAtividade],
        ["Observações", t.observacoes],
        ["Pré-Requisitos", t.preRequisitos],
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

    doc.save("treinamentos.pdf");
  };

  useEffect(() => {
    loadInfo();
  }, [loadInfo]);

  return (
    <>
      <div className="treinamento-list-buttons">
        <Link to="/sgc/treinamento/inserir">
          <button type="button" className="button create-button">
            Novo treinamento
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
      <div className="treinamento-list-container">
        {loading ? (
          <div className="loader-div">
            <Loader height="100" width="100" />
          </div>
        ) : (
          <table className="treinamento-table-container">
            <thead className="treinamento-table-head">
              <tr>
                <th scope="col">Treinamento</th>
                <th scope="col">Material</th>
                <th scope="col">OM</th>
                <th scope="col">Brigada</th>
                <th scope="col">Tipo</th>
                <th scope="col">Executor</th>
                <th scope="col">Instituição</th>
                <th scope="col">Status</th>
                <th scope="col">Vagas</th>
                <th scope="col">Subsistema</th>
                <th scope="col">SAD</th>
                <th scope="col">Data início</th>
                <th scope="col">Data fim</th>
                <th scope="col">Ações</th>
              </tr>
            </thead>
            <tbody className="treinamento-table-body">
              {paginatedData.length > 0 ? (
                paginatedData.map((t) => (
                  <TreinamentoCard onLoad={loadInfo} key={t.id} element={t} />
                ))
              ) : (
                <tr>
                  <td colSpan={14}>
                    <div className="no-elements-on-table">
                      <span>Não existem treinamentos a serem exibidos.</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr>
                <td>
                  <TablePagination
                    className="treinamento-table-pagination-container"
                    component="div"
                    count={treinamentos ? treinamentos.length : 0}
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

export default TreinamentoList;
