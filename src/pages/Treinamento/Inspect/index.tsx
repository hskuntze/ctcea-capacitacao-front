import { useParams } from "react-router-dom";
import "./styles.css";
import { useCallback, useEffect, useState } from "react";
import { AxiosRequestConfig } from "axios";
import { requestBackend } from "utils/requests";
import { TreinamentoType } from "types/treinamento";
import Loader from "components/Loader";
import { formatarData } from "utils/functions";

const TreinamentoInspect = () => {
  const urlParams = useParams();

  const [treinamento, setTreinamento] = useState<TreinamentoType>();
  const [loading, setLoading] = useState(false);

  const loadInfo = useCallback(() => {
    setLoading(true);

    const requestParams: AxiosRequestConfig = {
      url: `/treinamentos/${urlParams.id}`,
      withCredentials: true,
      method: "GET",
    };

    requestBackend(requestParams)
      .then((res) => {
        setTreinamento(res.data as TreinamentoType);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [urlParams.id]);

  useEffect(() => {
    loadInfo();
  }, [loadInfo]);

  return (
    <div className="treinamento-inspect-container">
      {loading ? (
        <div className="loading-div">
          <Loader />
        </div>
      ) : (
        <div className="treinamento-inspect-content">
          <h5>{treinamento?.treinamento}</h5>
          <span>
            <b>SAD:</b> {treinamento?.sad.toUpperCase()}
          </span>
          <span>
            <b>Material:</b> {treinamento?.material}
          </span>
          <span>
            <b>Tipo:</b> {treinamento?.tipo}
          </span>
          <span>
            <b>Subsistema:</b> {treinamento?.subsistema}
          </span>
          <span>
            <b>Modalidade:</b> {treinamento?.modalidade}
          </span>
          <span>
            <b>Brigada:</b> {treinamento?.brigada}
          </span>
          <span>
            <b>OM:</b> {treinamento?.om}
          </span>
          <span>
            <b>Grupo:</b> {treinamento?.grupo === 1 ? "Grupo 01" : "Grupo 02"}
          </span>
          <span>
            <b>Executor:</b> {treinamento?.executor === 1 ? "EB" : "Empresa"}
          </span>
          <span>
            <b>Instituição:</b> {treinamento?.instituicao}
          </span>
          <span>
            <b>Data Início:</b> {formatarData(treinamento ? treinamento.dataInicio : "")}
          </span>
          <span>
            <b>Data Fim:</b> {formatarData(treinamento ? treinamento.dataFim : "")}
          </span>
          <span>
            <b>Vagas:</b> {treinamento?.vagas}
          </span>
          <span>
            <b>Status:</b> {treinamento?.status}
          </span>
          <span>
            <b>Avaliação Prática:</b>{" "}
            {treinamento?.avaliacaoPratica ? "Sim" : "Não"}
          </span>
          <span>
            <b>Avaliação Teórica:</b>{" "}
            {treinamento?.avaliacaoTeorica ? "Sim" : "Não"}
          </span>
          <span>
            <b>Nome dos Instrutores:</b> {treinamento?.nomeInstrutores}
          </span>
          <span>
            <b>Contato dos Instrutores:</b> {treinamento?.contatoInstrutores}
          </span>
          <span>
            <b>Certificado:</b> {treinamento?.certificado ? "Sim" : "Não"}
          </span>
          <span>
            <b>Logística do Treinamento:</b> {treinamento?.logisticaTreinamento}
          </span>
          <span>
            <b>Nivelamento:</b> {treinamento?.nivelamento ? "Sim" : "Não"}
          </span>
          <span>
            <b>Carga Horária:</b> {treinamento?.cargaHoraria}
          </span>
          <span>
            <b>Público Alvo:</b> {treinamento?.publicoAlvo ? "Sim" : "Não"}
          </span>
          <span>
            <b>Descrição da Atividade:</b> {treinamento?.descricaoAtividade}
          </span>
          <span>
            <b>Material Didático:</b> {treinamento?.materialDidatico}
          </span>
          <span>
            <b>Observações:</b> {treinamento?.observacoes}
          </span>
          <span>
            <b>Pré-requisitos:</b> {treinamento?.preRequisitos}
          </span>
        </div>
      )}
    </div>
  );
};

export default TreinamentoInspect;
