import { useParams } from "react-router-dom";
import "./styles.css";
import { useCallback, useEffect, useState } from "react";
import { AvaliacaoType } from "types/avaliacao";
import { AxiosRequestConfig } from "axios";
import { requestBackend } from "utils/requests";
import { toast } from "react-toastify";
import Loader from "components/Loader";
import { formatarAvaliacao } from "utils/functions";

const AvaliacaoInspect = () => {
  const urlParams = useParams();

  const [avaliacao, setAvaliacao] = useState<AvaliacaoType>();
  const [loading, setLoading] = useState(false);

  const loadInfo = useCallback(() => {
    setLoading(true);

    const requestParams: AxiosRequestConfig = {
      url: `/avaliacoes/${urlParams.id}`,
      method: "GET",
      withCredentials: true,
    };

    requestBackend(requestParams)
      .then((res) => {
        setAvaliacao(res.data as AvaliacaoType);
      })
      .catch((err) => {
        toast.error("Erro ao resgatar dados da avaliação.");
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
            <h5>{avaliacao?.treinamento.treinamento}</h5>
            <span>
              <b>Nome do responsável pela avaliação: </b>{" "}
              {avaliacao?.nomeResponsavel}
            </span>
            <span>
              <b>Função do responsável pela avaliação: </b>{" "}
              {avaliacao?.funcaoResponsavel}
            </span>
            <span>
              <b>Qualidade geral da apostila do treinamento?</b>{" "}
              {formatarAvaliacao(Number(avaliacao?.qualidadeMaterial))}
            </span>
            <span>
              <b>Apostila estava objetiva e clara para entendimento?</b>{" "}
              {formatarAvaliacao(Number(avaliacao?.apostilaObjetiva))}
            </span>
            <span>
              <b>Apostila estava atualizada e em sequência adequada?</b>{" "}
              {formatarAvaliacao(Number(avaliacao?.apostilaAtualizada))}
            </span>
            <span>
              <b>
                Questões estavam relacionadas ao conteúdo ministrado em aula?
              </b>{" "}
              {formatarAvaliacao(Number(avaliacao?.questoesRelacionadas))}
            </span>
            <span>
              <b>Questões estavam claras e abrangentes?</b>{" "}
              {formatarAvaliacao(Number(avaliacao?.questoesClaras))}
            </span>
            {avaliacao?.treinamento.instrutores.map((ins) => (
              <>
                <h5 className="mt-2">Instrutor: {ins.nome}</h5>
                <span>
                  <b>Engajamento:</b>{" "}
                  {formatarAvaliacao(Number(ins.engajamento))}
                </span>
                <span>
                  <b>Claro e objetivo na apresentação do assunto:</b>{" "}
                  {formatarAvaliacao(Number(ins.clareza))}
                </span>
                <span>
                  <b>Nível de conhecimento técnico:</b>{" "}
                  {formatarAvaliacao(Number(ins.nivelConhecimento))}
                </span>
                <span>
                  <b>Capacidade de responder a perguntas:</b>{" "}
                  {formatarAvaliacao(Number(ins.capacidadeResposta))}
                </span>
                <span>
                  <b>Capacidade de gerir a aula e o tempo:</b>{" "}
                  {formatarAvaliacao(Number(ins.capacidadeGerirAula))}
                </span>
              </>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AvaliacaoInspect;
