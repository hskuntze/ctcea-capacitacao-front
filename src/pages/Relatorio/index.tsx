import { useCallback, useEffect, useState } from "react";
import "./styles.css";
import { RelatorioType } from "types/relatorio";
import { AxiosRequestConfig } from "axios";
import { requestBackend } from "utils/requests";
import { toast } from "react-toastify";
import { formatarData, formatarStatus } from "utils/functions";
import { useForm } from "react-hook-form";

const Relatorio = () => {
  const { handleSubmit } = useForm();

  const [resultados, setResultados] = useState<RelatorioType[]>();
  const [optionsLoaded, setOptionsLoaded] = useState(false); // Estado para controlar a carga das opções

  const [treinamentoOptions, setTreinamentoOptions] = useState<string[]>([]);
  const [capacitadoOptions, setCapacitadoOptions] = useState<string[]>([]);
  const [siglaOptions, setSiglaOptions] = useState<string[]>([]);
  const [brigadaOptions, setBrigadaOptions] = useState<string[]>([]);

  const [treinamentoInput, setTreinamentoInput] = useState<string | null>(null);
  const [capacitadoInput, setCapacitadoInput] = useState<string | null>(null);
  const [siglaInput, setSiglaInput] = useState<string | null>(null);
  const [brigadaInput, setBrigadaInput] = useState<string | null>(null);

  const loadInfo = useCallback(() => {
    let t = treinamentoInput === null ? "" : treinamentoInput;
    let c = capacitadoInput === null ? "" : capacitadoInput;
    let s = siglaInput === null ? "" : siglaInput;
    let b = brigadaInput === null ? "" : brigadaInput;

    const requestParams: AxiosRequestConfig = {
      url: "/treinamentos/filtrar",
      method: "GET",
      withCredentials: true,
      params: {
        treinamento: t,
        sigla: s,
        nomeCompleto: c,
        bda: b,
      },
    };

    requestBackend(requestParams)
      .then((res) => {
        setResultados(res.data as RelatorioType[]);
      })
      .catch((err) => {
        toast.error("Erro ao tentar carregar informações de relatório.");
      });
  }, [brigadaInput, capacitadoInput, siglaInput, treinamentoInput]);

  useEffect(() => {
    loadInfo();
  }, [loadInfo]);

  useEffect(() => {
    if (resultados && !optionsLoaded) {
      const tOptions = new Set<string>();
      const cOptions = new Set<string>();
      const sOptions = new Set<string>();
      const bOptions = new Set<string>();

      resultados.forEach((r) => {
        tOptions.add(r.treinamento.treinamento);

        r.treinamento.capacitados.forEach((c) => {
          cOptions.add(c.nomeCompleto);
        });

        sOptions.add(r.treinamento.om.sigla);

        bOptions.add(r.treinamento.brigada);
      });

      // Atualize o estado com os valores únicos
      setTreinamentoOptions(Array.from(tOptions));
      setCapacitadoOptions(Array.from(cOptions));
      setSiglaOptions(Array.from(sOptions));
      setBrigadaOptions(Array.from(bOptions));
      setOptionsLoaded(true);
    }
  }, [resultados, optionsLoaded]);

  return (
    <div>
      <form onSubmit={handleSubmit(loadInfo)}>
        <select
          onChange={(e) => setTreinamentoInput(e.currentTarget.value)}
          name="treinamento-options"
          id="treinamento-options"
        >
          <option value="">Selecione um treinamento</option>
          {treinamentoOptions.length > 0 &&
            treinamentoOptions.map((opt) => <option value={opt}>{opt}</option>)}
        </select>
        <select
          onChange={(e) => setCapacitadoInput(e.currentTarget.value)}
          name="capacitados-options"
          id="capacitados-options"
        >
          <option value="">Selecione um capacitado</option>
          {capacitadoOptions.length > 0 &&
            capacitadoOptions.map((cap) => <option value={cap}>{cap}</option>)}
        </select>
        <select
          onChange={(e) => setSiglaInput(e.currentTarget.value)}
          name="sigla-options"
          id="sigla-options"
        >
          <option value="">Selecione uma OM</option>
          {siglaOptions.length > 0 &&
            siglaOptions.map((sigla) => <option value={sigla}>{sigla}</option>)}
        </select>
        <select
          onChange={(e) => setBrigadaInput(e.currentTarget.value)}
          name="brigada-options"
          id="brigada-options"
        >
          <option value="">Selecione uma brigada</option>
          {brigadaOptions.length > 0 &&
            brigadaOptions.map((brigada) => <option value={brigada}>{brigada}</option>)}
        </select>
        <button type="submit" className="button submit-button">
          <i className="bi bi-search" />
        </button>
      </form>
      <table>
        <thead>
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
        <tbody>
          {resultados &&
            resultados.map((r) => (
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
        <tfoot></tfoot>
      </table>
    </div>
  );
};

export default Relatorio;
