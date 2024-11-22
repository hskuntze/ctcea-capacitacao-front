import { useCallback, useEffect, useState } from "react";
import "./styles.css";
import { TreinamentoType } from "types/treinamento";
import { AxiosRequestConfig } from "axios";
import { requestBackend } from "utils/requests";
import TreinamentoCard from "components/TreinamentoCard";
import { Link } from "react-router-dom";

const TreinamentoList = () => {
  const [treinamentos, setTreinamentos] = useState<TreinamentoType[]>();

  const loadInfo = useCallback(() => {
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
      });
  }, []);

  useEffect(() => {
    loadInfo();
  }, [loadInfo]);

  return (
    <div className="treinamento-list-container">
      <div className="treinamento-list-buttons">
        <Link to="/sgc/treinamento/inserir">
          <button type="button" className="button create-button">
            Novo treinamento
          </button>
        </Link>
      </div>
      <div>
        {treinamentos ? (
          treinamentos.map((t) => (
            <TreinamentoCard onLoad={loadInfo} key={t.id} element={t} />
          ))
        ) : (
          <span>Não existem treinamentos a serem exibidos.</span>
        )}
      </div>
    </div>
  );
};

export default TreinamentoList;
