import "./styles.css";
import { Link } from "react-router-dom";
import { AxiosRequestConfig } from "axios";
import { requestBackend } from "utils/requests";
import { toast } from "react-toastify";
import { OcorrenciaType } from "types/ocorrencia";
import { formatarData, formatarStatusOcorrencia } from "utils/functions";

interface Props {
  element: OcorrenciaType;
  onLoad: () => void; //Trigger para que ao deletar o registro recarregue as informações da página
}

/**
 * Elemento para exibição na listagem de ocorrências
 */
const OcorrenciaCard = ({ element, onLoad }: Props) => {
  const deleteElement = (id: number) => {
    let confirm = window.confirm(
      "Você tem certeza que deseja deletar esse elemento?"
    );

    if (confirm) {
      const requestParams: AxiosRequestConfig = {
        url: `/ocorrencias/deletar/${id}`,
        method: "DELETE",
        withCredentials: true,
      };

      requestBackend(requestParams)
        .then(() => {
          toast.success("Deletado com sucesso.");

          onLoad();
        })
        .catch((err) => {
          toast.error("Erro ao deletar.");
        });
    }
  };

  return (
    <tr className="card-container">
      <td>
        <div className="card-content">{element.titulo}</div>
      </td>
      <td>
        <div className="card-content">{element.treinamento.treinamento}</div>
      </td>
      <td>
        <div className="card-content">{formatarData(element.dataOcorrencia)}</div>
      </td>
      <td>
        <div className="card-content">{formatarStatusOcorrencia(element.statusClassificacao)}</div>
      </td>
      <td>
        <div className="card-content">{element.nomeResponsavelOcorrencia}</div>
      </td>
      <td>
        <div className="card-buttons">
          <Link to={`/sgc/ocorrencia/visualizar/${element.id}`}>
            <button className="act-button submit-button">
              <i className="bi bi-file-earmark-text" />
            </button>
          </Link>
          <Link to={`/sgc/ocorrencia/${element.id}`}>
            <button className="act-button edit-button" type="button">
              <i className="bi bi-pencil" />
            </button>
          </Link>
          <button
            className="act-button delete-button"
            type="button"
            onClick={() => deleteElement(element.id)}
          >
            <i className="bi bi-trash" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default OcorrenciaCard;
