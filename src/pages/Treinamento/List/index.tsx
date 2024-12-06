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
import { toast } from "react-toastify";

const TreinamentoList = () => {
  const [treinamentos, setTreinamentos] = useState<TreinamentoType[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");
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
        toast.error("Erro ao tentar resgatar os treinamentos.");
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

  const filteredData = treinamentos.filter((t) => {
    const searchTerm = filter.trim();
    if (!searchTerm) return true;

    let executor = t.executor === 1 ? "eb" : "empresa";
    return (
      t.treinamento.toLowerCase().includes(searchTerm) ||
      (t.descricaoAtividade.toLowerCase().includes(searchTerm) ?? false) ||
      (t.material.toLowerCase().includes(searchTerm) ?? false) ||
      (t.brigada.toLowerCase().includes(searchTerm) ?? false) ||
      (t.om.sigla.toLowerCase().includes(searchTerm) ?? false) ||
      (t.sad.toLowerCase().includes(searchTerm) ?? false) ||
      (formatarData(t.dataInicio).toLowerCase().includes(searchTerm) ??
        false) ||
      (formatarData(t.dataFim).toLowerCase().includes(searchTerm) ?? false) ||
      (formatarStatus(t.status).toLowerCase().includes(searchTerm) ?? false) ||
      (formatarModalidade(Number(t.modalidade))
        .toLowerCase()
        .includes(searchTerm) ??
        false) ||
      (t.subsistema.toLowerCase().includes(searchTerm) ?? false) ||
      (t.instituicao.toLowerCase().includes(searchTerm) ?? false) ||
      (formatarTipo(t.tipo).toLowerCase().includes(searchTerm) ?? false) ||
      (executor.includes(searchTerm) ?? false)
    );
  });

  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleExportToExcel = () => {
    if (filteredData) {
      const treinamentoProcessado = filteredData.map((t) => ({
        ID: t.id,
        SAD: t.sad.toUpperCase(),
        Treinamento: t.treinamento,
        Tipo: formatarTipo(t.tipo),
        "Material/equipamento": t.material,
        Status: formatarStatus(t.status),
        Brigada: t.brigada,
        OM: t.om.sigla,
        Turmas: t.turmas.map((tm) => `${tm.nome}`).join("; "),
        Conjunto: t.subsistema,
        "Data início": formatarData(t.dataInicio),
        "Data fim": formatarData(t.dataFim),
        Modalidade: formatarModalidade(Number(t.modalidade)),
        Executor: t.executor === 1 ? "EB" : "Empresa",
        Vagas: t.vagas,
        "Descrição da atividade": t.descricaoAtividade,
        "Público alvo": formatarPublicoAlvo(t.publicoAlvo),
        "Carga horária": t.cargaHoraria,
        "Pré-requisitos": t.preRequisitos,
        Nivelamento: t.nivelamento === true ? "Sim" : "Não",
        "Nome do curso de nivelamento": t.descNivelamento,
        "Logística de treinamento": t.logisticaTreinamento,
        "Avaliação prática": t.avaliacaoPratica === true ? "Sim" : "Não",
        "Avaliação teórica": t.avaliacaoTeorica === true ? "Sim" : "Não",
        Certificado: t.certificado === true ? "Sim" : "Não",
        "Nome dos instrutores": t.instrutores.map((i) => `${i.nome}`).join("; "),
        "E-mail dos instrutores": t.instrutores.map((i) => `${i.email}`).join("; "),
        "Contato dos instrutores": t.instrutores.map((i) => `${i.contato}`).join("; "),
        Observações: t.observacoes,
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
    doc.text("Treinamentos", 15, 20);

    doc.setFontSize(12);
    const yStart = 30;
    let y = yStart;
    const lineHeight = 10;
    const marginLeft = 15;
    const colWidth = 60;

    filteredData?.forEach((t, i) => {
      doc.setFont("helvetica", "bold");
      doc.text(t.treinamento, marginLeft, y);
      y += lineHeight;

      const data = [
        ["ID", String(t.id)],
        ["SAD", t.sad.toUpperCase()],
        ["Tipo", formatarTipo(t.tipo)],
        ["Material/equipamento", t.material],
        ["Status", formatarTipo(t.tipo)],
        ["Brigada", t.brigada],
        ["OM", t.om.sigla],
        ["Turmas", t.turmas.map((tm) => `${tm.nome}`).join("; ")],
        ["Conjunto", t.subsistema],
        ["Data Início", formatarData(t.dataInicio)],
        ["Data Fim", formatarData(t.dataFim)],
        ["Modalidade", formatarModalidade(Number(t.modalidade))],
        ["Executor", t.executor === 1 ? "EB" : "Empresa"],
        ["Vagas", String(t.vagas)],
        ["Descrição da atividade", t.descricaoAtividade],
        ["Público Alvo", formatarPublicoAlvo(t.publicoAlvo)],
        ["Carga Horária", String(t.cargaHoraria)],
        ["Pré-Requisitos", t.preRequisitos],
        ["Nivelamento", String(t.nivelamento)],
        ["Nome do curso de nivelamento", t.descNivelamento],
        ["Logística do treinamento", t.logisticaTreinamento],
        [
          "Avaliação Prática",
          String(t.avaliacaoPratica) === "1" ? "Sim" : "Não",
        ],
        [
          "Avaliação Teórica",
          String(t.avaliacaoTeorica) === "1" ? "Sim" : "Não",
        ],
        ["Certificado", String(t.certificado) === "1" ? "Sim" : "Não"],
        ["Nome dos instrutores", t.instrutores.map((inst) => `${inst.nome}`).join("; ")],
        ["E-mail dos instrutores", t.instrutores.map((inst) => `${inst.email}`).join("; ")],
        ["Contato dos instrutores", t.instrutores.map((inst) => `${inst.contato}`).join("; ")],
        ["Observações", t.observacoes],
      ];

      data.forEach(([k, v]) => {
        doc.setFont("helvetica", "bold");
        doc.text(k, marginLeft, y);
        doc.setFont("helvetica", "normal");
        doc.text(v, 25 + colWidth, y);
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
      <div className="top-list-buttons">
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
                <th scope="col">Material</th>
                <th scope="col">OM</th>
                <th scope="col">Brigada</th>
                <th scope="col">Tipo</th>
                <th scope="col">Executor</th>
                <th scope="col">Instituição</th>
                <th scope="col">Status</th>
                <th scope="col">SAD</th>
                <th scope="col">Período</th>
                <th scope="col">Ações</th>
              </tr>
            </thead>
            <tbody className="table-body">
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

export default TreinamentoList;
