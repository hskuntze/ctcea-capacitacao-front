import "./styles.css";
import { Link } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import Loader from "components/Loader";
import { CapacitadoType } from "types/capacitado";
import { AxiosRequestConfig } from "axios";
import { requestBackend } from "utils/requests";
import { TablePagination } from "@mui/material";
import CapacitadoCard from "components/CapacitadoCard";
import { formatarData, formatarModalidade } from "utils/functions";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import { toast } from "react-toastify";

const CapacitadoList = () => {
  const [capacitados, setCapacitados] = useState<CapacitadoType[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");
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
        toast.error("Erro ao tentar resgatar os capacitados.");
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

  const filteredData = capacitados.filter((c) => {
    const searchTerm = filter.trim();
    if (!searchTerm) return true;

    return (
      c.treinamento.treinamento.toLowerCase().includes(searchTerm) ||
      (c.nomeCompleto.toLowerCase().includes(searchTerm) ?? false) ||
      (c.treinamento.brigada.toLowerCase().includes(searchTerm) ?? false) ||
      (c.treinamento.om.sigla.toLowerCase().includes(searchTerm) ?? false) ||
      (c.turma.toLowerCase().includes(searchTerm) ?? false) ||
      (formatarData(c.treinamento.dataInicio)
        .toLowerCase()
        .includes(searchTerm) ??
        false) ||
      (formatarData(c.treinamento.dataFim).toLowerCase().includes(searchTerm) ??
        false) ||
      (formatarModalidade(Number(c.treinamento.modalidade))
        .toLowerCase()
        .includes(searchTerm) ??
        false)
    );
  });

  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleExportToExcel = () => {
    if (filteredData) {
      const capacitadosProcessado = filteredData.map((t) => ({
        ID: t.id,
        Tipo: t.tipo === 1 ? "Militar" : "Civil",
        "Nome completo": t.nomeCompleto,
        "E-mail": t.email,
        Telefone: t.celular,
        Função: t.funcao,
        Turma: t.turma,
        "Nome de guerra": t.nomeGuerra,
        Posto: t.posto ? t.posto.titulo : "",
        "Brigada do militar": t.brigadaMilitar,
        "OM do militar": t.instituicao,
        "Avaliação teórica?": t.avaliacaoTeorica === true ? "Sim" : "Não",
        "Exige nota teórica?": t.exigeNotaTeorica === true ? "Sim" : "Não",
        "Nota teórica": t.notaTeorica,
        "Observações da avaliação teórica": t.observacoesAvaliacaoTeorica,
        "Avaliação prática?": t.avaliacaoPratica === true ? "Sim" : "Não",
        "Exige nota prática?": t.exigeNotaPratica === true ? "Sim" : "Não",
        "Nota prática": t.notaPratica,
        "Observações da avaliação prática": t.observacoesAvaliacaoPratica,
        "Certificado?": t.certificado === true ? "Sim" : "Não",
        "Tipo do certificado": t.tipoCertificado ? t.tipoCertificado.map((tc) => `${tc.toUpperCase()}`).join("; ") : "",
        "Número de BI": t.numeroBi,
      }));

      const ws = XLSX.utils.json_to_sheet(capacitadosProcessado);
      const wb = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(wb, ws, "Capacitados");
      XLSX.writeFile(wb, "capacitados.xlsx");
    }
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Capacitados", 15, 20);

    doc.setFontSize(12);
    const yStart = 30;
    let y = yStart;
    const lineHeight = 10;
    const marginLeft = 15;
    const colWidth = 50;

    filteredData?.forEach((c, i) => {
      doc.setFont("helvetica", "bold");
      doc.text(c.nomeCompleto, marginLeft, y);
      y += lineHeight;

      let avalPratica = c.avaliacaoPratica === true ? "Sim" : "Não";
      let avalTeorica = c.avaliacaoTeorica === true ? "Sim" : "Não";
      let exigeNotaPratica = c.exigeNotaPratica === true ? "Sim" : "Não";
      let exigeNotaTeorica = c.exigeNotaTeorica === true ? "Sim" : "Não";
      let notaPratica = c.notaPratica ? String(c.notaPratica) : "";
      let notaTeorica = c.notaTeorica ? String(c.notaTeorica) : "";
      let posto = c.posto ? c.posto.titulo : "";
      let brigada = c.brigadaMilitar ? c.brigadaMilitar : "";
      let tipoCertificado = c.tipoCertificado
        ? c.tipoCertificado.join(", ")
        : "";

      const data = [
        ["E-mail", c.email],
        ["Celular", c.celular],
        ["Instituição/OM", c.instituicao ?? ""],
        ["Nome de guerra", c.nomeGuerra ?? ""],
        ["Número BI", c.numeroBi],
        ["Função", c.funcao],
        ["Turma", c.turma],
        ["Posto", posto],
        ["Brigada", brigada],
        ["Avaliação prática?", avalPratica],
        ["Avaliação teórica?", avalTeorica],
        ["Exige nota prática?", exigeNotaPratica],
        ["Exige nota teórica?", exigeNotaTeorica],
        ["Nota prática", notaPratica],
        ["Nota teórica", notaTeorica],
        ["Tipo certificado", tipoCertificado],
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

    doc.save("capacitados.pdf");
  };

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
                  <td colSpan={9}>
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

export default CapacitadoList;
