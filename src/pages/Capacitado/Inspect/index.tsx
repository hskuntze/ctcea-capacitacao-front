import { AxiosRequestConfig } from "axios";
import "./styles.css";
import { useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { requestBackend } from "utils/requests";
import { CapacitadoType } from "types/capacitado";
import Loader from "components/Loader";
import { formatarData, formatarModalidade } from "utils/functions";
import { toast } from "react-toastify";

const CapacitacaoInspect = () => {
  const urlParams = useParams();

  const [capacitado, setCapacitado] = useState<CapacitadoType>();
  const [loading, setLoading] = useState(false);

  const loadInfo = useCallback(() => {
    setLoading(true);

    const requestParams: AxiosRequestConfig = {
      url: `/capacitados/${urlParams.id}`,
      method: "GET",
      withCredentials: true,
    };

    requestBackend(requestParams)
      .then((res) => {
        setCapacitado(res.data as CapacitadoType);
      })
      .catch((err) => {
        toast.error("Erro ao resgatar os dados do capacitado.");
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
      {loading ? (
        <div className="loading-div">
          <Loader />
        </div>
      ) : (
        <div className="inspect-content">
          <h5>{capacitado?.nomeCompleto}</h5>
          <span>
            <b>E-mail:</b> {capacitado?.email}
          </span>
          <span>
            <b>Celular:</b> {capacitado?.celular}
          </span>
          <span>
            <b>Instituição/Organização:</b> {capacitado?.instituicao}
          </span>
          {capacitado?.tipo === 1 && (
            <>
              <span>
                <b>Nome de guerra:</b> {capacitado?.nomeGuerra}
              </span>
              <span>
                <b>Brigada:</b> {capacitado?.brigadaMilitar}
              </span>
              <span>
                <b>Posto/graduação:</b> {capacitado?.posto.titulo}
              </span>
            </>
          )}
          <span>
            <b>Turma:</b> {capacitado?.turma}
          </span>
          <span>
            <b>Função:</b> {capacitado?.funcao}
          </span>
          <span>
            <b>Avaliação teórica:</b>{" "}
            {capacitado?.avaliacaoTeorica === true ? "Sim" : "Não"}
          </span>
          <span>
            <b>Avaliação teórica exige nota?</b>{" "}
            {capacitado?.exigeNotaTeorica === false ? "Sim" : "Não"}
          </span>
          {capacitado?.avaliacaoTeorica === true &&
            capacitado.exigeNotaTeorica === false && (
              <span>
                <b>Nota teórica:</b> {capacitado.notaTeorica}
              </span>
            )}
          <span>
            <b>Avaliação prática:</b>{" "}
            {capacitado?.avaliacaoPratica === true ? "Sim" : "Não"}
          </span>
          <span>
            <b>Avaliação prática exige nota?</b>{" "}
            {capacitado?.exigeNotaPratica === false ? "Sim" : "Não"}
          </span>
          {capacitado?.avaliacaoPratica === true &&
            capacitado.exigeNotaPratica === false && (
              <span>
                <b>Nota prática:</b> {capacitado.notaPratica}
              </span>
            )}
          <hr />
          <span>
            <b>Treinamento: </b> {capacitado?.treinamento.treinamento}
          </span>
          <span>
            <b>ID:</b> {capacitado?.treinamento.id}
          </span>
          <span>
            <b>Modalidade: </b>{" "}
            {formatarModalidade(Number(capacitado?.treinamento.modalidade))}
          </span>
          <span>
            <b>Data início</b>{" "}{formatarData(capacitado ? capacitado.treinamento.dataInicio : "")}
          </span>
          <span>
            <b>Data fim</b>{" "}{formatarData(capacitado ? capacitado.treinamento.dataFim : "")}
          </span>
        </div>
      )}
    </div>
  );
};

export default CapacitacaoInspect;
