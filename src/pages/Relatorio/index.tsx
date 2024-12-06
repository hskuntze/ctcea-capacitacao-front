import { useCallback, useEffect, useState } from "react";
import "./styles.css";
import { RelatorioType } from "types/relatorio";
import { AxiosRequestConfig } from "axios";
import { requestBackend } from "utils/requests";
import { toast } from "react-toastify";
import {
  formatarData,
  formatarInversoStatus,
  formatarStatus,
} from "utils/functions";
import { useForm } from "react-hook-form";
import { TablePagination } from "@mui/material";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";

const Relatorio = () => {
  const { handleSubmit } = useForm();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [resultados, setResultados] = useState<RelatorioType[]>([]);
  const [optionsLoaded, setOptionsLoaded] = useState(false); // Estado para controlar a carga das opções

  const [treinamentoOptions, setTreinamentoOptions] = useState<string[]>([]);
  const [capacitadoOptions, setCapacitadoOptions] = useState<string[]>([]);
  const [siglaOptions, setSiglaOptions] = useState<string[]>([]);
  const [brigadaOptions, setBrigadaOptions] = useState<string[]>([]);
  const [statusOptions, setStatusOptions] = useState<string[]>([]);

  const [treinamentoInput, setTreinamentoInput] = useState<string | null>(null);
  const [capacitadoInput, setCapacitadoInput] = useState<string | null>(null);
  const [siglaInput, setSiglaInput] = useState<string | null>(null);
  const [brigadaInput, setBrigadaInput] = useState<string | null>(null);
  const [statusInput, setStatusInput] = useState<number | null>(null);

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

  const handleClearFilter = () => {
    setBrigadaInput("");
    setTreinamentoInput("");
    setCapacitadoInput("");
    setSiglaInput("");
    setStatusInput(-1);
  };

  const handleExportToExcel = () => {
    if (resultados) {
      const capacitadosProcessado = resultados.map((r) => ({
        Treinamento: r.treinamento.treinamento,
        Status: formatarStatus(r.treinamento.status),
        Brigada: r.treinamento.brigada,
        OM: r.treinamento.om.sigla,
        "Data início": formatarData(r.treinamento.dataInicio),
        "Data fim": formatarData(r.treinamento.dataFim),
        Capacitados: r.nomesCompletos,
      }));

      const ws = XLSX.utils.json_to_sheet(capacitadosProcessado);
      const wb = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(wb, ws, "Relatório");
      XLSX.writeFile(wb, "relatorio.xlsx");
    }
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Relatório", 5, 20);

    doc.setFontSize(12);
    const yStart = 30;
    let y = yStart;
    const lineHeight = 10;
    const marginLeft = 15;
    const colWidth = 50;

    resultados?.forEach((r, i) => {
      doc.setFont("helvetica", "bold");
      doc.text(r.treinamento.treinamento, marginLeft, y);
      y += lineHeight;

      const data = [
        ["Status", formatarStatus(r.treinamento.status)],
        ["Brigada", r.treinamento.brigada],
        ["OM", r.treinamento.om.sigla],
        ["Data início", formatarData(r.treinamento.dataInicio)],
        ["Data fim", formatarData(r.treinamento.dataFim)],
        ["Capacitados", r.nomesCompletos],
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

    doc.save("relatorio.pdf");
  };

  const loadInfo = useCallback(() => {
    let t = treinamentoInput === null ? "" : treinamentoInput;
    let c = capacitadoInput === null ? "" : capacitadoInput;
    let s = siglaInput === null ? "" : siglaInput;
    let b = brigadaInput === null ? "" : brigadaInput;
    let st = statusInput === null ? -1 : statusInput;

    const requestParams: AxiosRequestConfig = {
      url: "/treinamentos/filtrar",
      method: "GET",
      withCredentials: true,
      params: {
        treinamento: t,
        sigla: s,
        nomeCompleto: c,
        bda: b,
        status: st,
      },
    };

    requestBackend(requestParams)
      .then((res) => {
        setResultados(res.data as RelatorioType[]);
      })
      .catch((err) => {
        toast.error("Erro ao tentar carregar informações de relatório.");
      });
  }, [
    brigadaInput,
    capacitadoInput,
    siglaInput,
    treinamentoInput,
    statusInput,
  ]);

  const paginatedData = resultados.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  useEffect(() => {
    if (resultados.length !== 0 && !optionsLoaded) {
      const tOptions = new Set<string>();
      const cOptions = new Set<string>();
      const sOptions = new Set<string>();
      const bOptions = new Set<string>();
      const stOptions = new Set<string>();

      resultados.forEach((r) => {
        tOptions.add(r.treinamento.treinamento);
        r.treinamento.capacitados.forEach((c) => {
          cOptions.add(c.nomeCompleto);
        });
        sOptions.add(r.treinamento.om.sigla);
        bOptions.add(r.treinamento.brigada);
        stOptions.add(formatarStatus(r.treinamento.status));
      });

      // Atualize o estado com os valores únicos
      setTreinamentoOptions(Array.from(tOptions));
      setCapacitadoOptions(Array.from(cOptions));
      setSiglaOptions(Array.from(sOptions));
      setBrigadaOptions(Array.from(bOptions));
      setStatusOptions(Array.from(stOptions));
      setOptionsLoaded(true);
    }
  }, [resultados, optionsLoaded]);

  useEffect(() => {
    loadInfo();
  }, [loadInfo]);

  return (
    <div>
      <form onSubmit={handleSubmit(loadInfo)} className="relatorio-filtro">
        <select
          value={treinamentoInput ? treinamentoInput : ""}
          onChange={(e) => setTreinamentoInput(e.currentTarget.value)}
          name="treinamento-options"
          id="treinamento-options"
          className="form-select"
        >
          <option value="">Treinamento</option>
          {treinamentoOptions.length > 0 &&
            treinamentoOptions.map((opt) => <option value={opt}>{opt}</option>)}
        </select>
        <select
          value={capacitadoInput ? capacitadoInput : ""}
          onChange={(e) => setCapacitadoInput(e.currentTarget.value)}
          name="capacitados-options"
          id="capacitados-options"
          className="form-select"
        >
          <option value="">Capacitado</option>
          {capacitadoOptions.length > 0 &&
            capacitadoOptions.map((cap) => <option value={cap}>{cap}</option>)}
        </select>
        <select
          value={siglaInput ? siglaInput : ""}
          onChange={(e) => setSiglaInput(e.currentTarget.value)}
          name="sigla-options"
          id="sigla-options"
          className="form-select"
        >
          <option value="">OM</option>
          {siglaOptions.length > 0 &&
            siglaOptions.map((sigla) => <option value={sigla}>{sigla}</option>)}
        </select>
        <select
          value={brigadaInput ? brigadaInput : ""}
          onChange={(e) => setBrigadaInput(e.currentTarget.value)}
          name="brigada-options"
          id="brigada-options"
          className="form-select"
        >
          <option value="">Brigada</option>
          {brigadaOptions.length > 0 &&
            brigadaOptions.map((brigada) => (
              <option value={brigada}>{brigada}</option>
            ))}
        </select>
        <select
          value={statusInput ? formatarStatus(statusInput) : "-1"}
          onChange={(e) => setStatusInput(formatarInversoStatus(e.currentTarget.value))}
          name="status-options"
          id="status-options"
          className="form-select"
        >
          <option value="-1">Status</option>
          {statusOptions.length > 0 &&
            statusOptions.map((stt) => <option value={stt}>{stt}</option>)}
        </select>
        <button
          onClick={handleClearFilter}
          type="button"
          className="relatorio-button"
        >
          <i className="bi bi-x-lg" />
        </button>
        <button type="submit" className="relatorio-button">
          <i className="bi bi-search" />
        </button>
      </form>
      <div className="list-container">
        <table className="table-container">
          <thead className="table-head">
            <tr>
              <th scope="col">Treinamento</th>
              <th scope="col">Status</th>
              <th scope="col">Brigada</th>
              <th scope="col">OM</th>
              <th scope="col">Data início</th>
              <th scope="col">Data fim</th>
              <th scope="col">Capacitados</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {paginatedData &&
              paginatedData.map((r) => (
                <tr>
                  <td>{r.treinamento.treinamento}</td>
                  <td>{formatarStatus(r.treinamento.status)}</td>
                  <td>{r.treinamento.brigada}</td>
                  <td>{r.treinamento.om.sigla}</td>
                  <td>{formatarData(r.treinamento.dataInicio)}</td>
                  <td>{formatarData(r.treinamento.dataFim)}</td>
                  <td>{r.nomesCompletos}</td>
                </tr>
              ))}
          </tbody>
          <tfoot>
            <tr>
              <td>
                <TablePagination
                  className="table-pagination-container"
                  component="div"
                  count={resultados.length}
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
        <div className="relatorio-export-buttons">
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
      </div>
    </div>
  );
};

export default Relatorio;
