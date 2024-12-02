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

  const filteredData = capacitados.filter((c) => {
    const searchTerm = filter.trim();
    if (!searchTerm) return true;

    return (
      c.treinamento.treinamento.toLowerCase().includes(searchTerm) ||
      (c.nomeCompleto.toLowerCase().includes(searchTerm) ?? false) ||
      (c.treinamento.brigada.toLowerCase().includes(searchTerm) ?? false) ||
      (c.treinamento.om.toLowerCase().includes(searchTerm) ?? false) ||
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
        ...t
      }));

      const ws = XLSX.utils.json_to_sheet(capacitadosProcessado);
      const wb = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(wb, ws, "Treinamentos");
      XLSX.writeFile(wb, "treinamentos.xlsx");
    }
  };

  // const handleExportPDF = () => {
  //   const doc = new jsPDF();

  //   doc.setFontSize(18);
  //   doc.text("Treinamentos", 5, 20);

  //   doc.setFontSize(12);
  //   const yStart = 30;
  //   let y = yStart;
  //   const lineHeight = 10;
  //   const marginLeft = 15;
  //   const colWidth = 50;

  //   filteredData?.forEach((t, i) => {
  //     doc.setFont("helvetica", "bold");
  //     doc.text(t.treinamento, marginLeft, y);
  //     y += lineHeight;

  //     const data = [
  //       ["Tipo", formatarTipo(t.tipo)],
  //       ["Material", t.material],
  //       ["Data Início", formatarData(t.dataInicio)],
  //       ["Data Fim", formatarData(t.dataFim)],
  //       ["Vagas", String(t.vagas)],
  //       ["Status", formatarTipo(t.tipo)],
  //       [
  //         "Avaliação Prática",
  //         String(t.avaliacaoPratica) === "1" ? "Sim" : "Não",
  //       ],
  //       [
  //         "Avaliação Teórica",
  //         String(t.avaliacaoTeorica) === "1" ? "Sim" : "Não",
  //       ],
  //       ["Certificado", String(t.certificado) === "1" ? "Sim" : "Não"],
  //       ["Logística do t", t.logisticaTreinamento],
  //       ["Nivelamento", String(t.nivelamento)],
  //       ["Carga Horária", String(t.cargaHoraria)],
  //       ["Público Alvo", formatarPublicoAlvo(t.publicoAlvo)],
  //       ["Descrição da Atividade", t.descricaoAtividade],
  //       ["Observações", t.observacoes],
  //       ["Pré-Requisitos", t.preRequisitos],
  //     ];

  //     data.forEach(([k, v]) => {
  //       doc.setFont("helvetica", "bold");
  //       doc.text(k, marginLeft, y);
  //       doc.setFont("helvetica", "normal");
  //       doc.text(v, marginLeft + colWidth, y);
  //       y += lineHeight;

  //       if (y > 270) {
  //         doc.addPage();
  //         y = 20;
  //       }
  //     });

  //     y += 10;
  //   });

  //   doc.save("treinamentos.pdf");
  // };

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
          //   onClick={handleExportPDF}
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
