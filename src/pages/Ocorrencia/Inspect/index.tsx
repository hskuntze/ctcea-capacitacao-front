import { useParams } from "react-router-dom";
import "./styles.css";
import { OcorrenciaType } from "types/ocorrencia";
import { useCallback, useEffect, useState } from "react";
import { AxiosRequestConfig } from "axios";
import { toast } from "react-toastify";
import { requestBackend } from "utils/requests";
import Loader from "components/Loader";
import {
  formatarData,
  formatarProbabilidadeRecorrencia,
  formatarStatusOcorrencia,
  formatarTipoOcorrencia,
} from "utils/functions";

const OcorrenciaInspect = () => {
  const urlParams = useParams();

  const [ocorrencia, setOcorrencia] = useState<OcorrenciaType>();
  const [loading, setLoading] = useState(false);

  const loadInfo = useCallback(() => {
    setLoading(true);

    const requestParams: AxiosRequestConfig = {
      url: `/ocorrencias/${urlParams.id}`,
      method: "GET",
      withCredentials: true,
    };

    requestBackend(requestParams)
      .then((res) => {
        setOcorrencia(res.data as OcorrenciaType);
      })
      .catch((err) => {
        toast.error("Erro ao resgatar dados da ocorrência.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [urlParams.id]);

  useEffect(() => {
    loadInfo();
  }, [loadInfo]);

  return (
    <div className="inspect-container">
      <div>
        {loading ? (
          <div className="loading-div">
            <Loader />
          </div>
        ) : (
          <div className="inspect-content">
            <h5>{ocorrencia?.titulo}</h5>
            <span>
              <b>Data da ocorrência: </b>{" "}
              {formatarData(ocorrencia ? ocorrencia.dataOcorrencia : "")}
            </span>
            <span>
              <b>Tipo de ocorrência: </b>{" "}
              {formatarTipoOcorrencia(
                ocorrencia ? ocorrencia.tipoOcorrencia : -1
              )}
            </span>
            <span>
              <b>Houve impacto da ocorrência?</b>{" "}
              {ocorrencia?.impactoOcorrencia === true ? "Sim" : "Não"}
            </span>
            <span>
              <b>Descrição do impacto:</b> {ocorrencia?.descricaoImpacto}
            </span>
            <span>
              <b>Status da ocorrência</b>{" "}
              {formatarStatusOcorrencia(
                ocorrencia ? ocorrencia.statusClassificacao : -1
              )}
            </span>
            {ocorrencia?.statusClassificacao === 1 && (
              <>
                <span>
                  <b>Solução adotada:</b> {ocorrencia.solucaoAdotada}
                </span>
                <span>
                  <b>Data da solução:</b> {formatarData(ocorrencia.dataSolucao)}
                </span>
                <span>
                  <b>Nome do responsável pela solução:</b>{" "}
                  {ocorrencia.nomeResponsavelSolucao}
                </span>
                <span>
                  <b>Instituição do responsável pela solução:</b>{" "}
                  {ocorrencia.instituicaoResponsavelSolucao}
                </span>
                <span>
                  <b>Contato do responsável pela solução:</b>{" "}
                  {ocorrencia.contatoResponsavelSolucao}
                </span>
              </>
            )}
            {(ocorrencia?.statusClassificacao === 2 ||
              ocorrencia?.statusClassificacao === 3) && (
              <>
                <span>
                  <b>Descrição da classificação:</b>{" "}
                  {ocorrencia.descricaoClassificacao}
                </span>
              </>
            )}
            <span>
              <b>Probabilidade de recorrência:</b>{" "}
              {formatarProbabilidadeRecorrencia(
                ocorrencia ? ocorrencia.probabilidadeRecorrencia : -1
              )}
            </span>
            <span>
              <b>Lições aprendidas:</b> {ocorrencia?.descricaoLicoesAprendidas}
            </span>
            <span>
              <b>Nome do responsável pelo levantamento da ocorrência:</b>{" "}
              {ocorrencia?.nomeResponsavelOcorrencia}
            </span>
            <span>
              <b>Instituição do responsável pelo levantamento da ocorrência:</b>{" "}
              {ocorrencia?.instituicaoResponsavelOcorrencia}
            </span>
            <span>
              <b>Contato do responsável pelo levantamento da ocorrência:</b>{" "}
              {ocorrencia?.contatoResponsavelOcorrencia}
            </span>
            <span>
              <b>Data do registro da ocorrência:</b>{" "}
              {formatarData(ocorrencia ? ocorrencia?.dataRegistro : "")}
            </span>
            <span>
              <b>Observações gerais:</b> {ocorrencia?.observacoesGerais}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default OcorrenciaInspect;
