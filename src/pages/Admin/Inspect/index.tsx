import { useParams } from "react-router-dom";
import "./styles.css";
import { User } from "types/user";
import { useCallback, useEffect, useState } from "react";
import { AxiosRequestConfig } from "axios";
import { requestBackend } from "utils/requests";
import { toast } from "react-toastify";
import Loader from "components/Loader";

const UsuarioInspect = () => {
  const urlParams = useParams();

  const [usuario, setUsuario] = useState<User>();
  const [loading, setLoading] = useState(false);

  const loadInfo = useCallback(() => {
    setLoading(true);

    const requestParams: AxiosRequestConfig = {
      url: `/usuarios/id/${urlParams.id}`,
      method: "GET",
      withCredentials: true,
    };

    requestBackend(requestParams)
      .then((res) => {
        setUsuario(res.data as User);
      })
      .catch((err) => {
        toast.error("Erro ao resgatar dados do usuário.");
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
            <h5>{usuario?.nome}</h5>
            <span>
              <b>Nome: </b>{" "}{usuario?.nome}
            </span>
            <span>
              <b>Sobrenome: </b>{" "}{usuario?.sobrenome}
            </span>
            <span>
              <b>Instituição: </b>{" "}{usuario?.instituicao}
            </span>
            <span>
              <b>Nome de guerra: </b>{" "}{usuario?.nomeGuerra}
            </span>
            <span>
              <b>Posto/graduação: </b>{" "}{usuario?.posto ? usuario.posto.titulo : ""}
            </span>
            <span>
              <b>E-mail: </b>{" "}{usuario?.email}
            </span>
            <span>
              <b>Telefone: </b>{" "}{usuario?.telefone}
            </span>
            <span>
              <b>Perfis: </b>{" "}{usuario?.perfis.map((p) => `${p.autorizacao}`).join("; ")}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsuarioInspect;
