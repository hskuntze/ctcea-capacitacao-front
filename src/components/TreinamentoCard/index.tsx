import { TreinamentoType } from "types/treinamento";
import "./styles.css";
import { Link } from "react-router-dom";
import { formatarData, formatarStatus, formatarTipo } from "utils/functions";
import { AxiosRequestConfig } from "axios";
import { requestBackend } from "utils/requests";
import { toast } from "react-toastify";

interface Props {
  element: TreinamentoType;
  onLoad: () => void;
}

const TreinamentoCard = ({ element, onLoad }: Props) => {
  const deleteElement = (id: number) => {
    let confirm = window.confirm(
      "Você tem certeza que deseja deletar esse elemento?"
    );

    if (confirm) {
      const requestParams: AxiosRequestConfig = {
        url: `/treinamentos/deletar/${id}`,
        method: "DELETE",
        withCredentials: true,
      };

      requestBackend(requestParams)
        .then(() => {
          toast.success("Deletado com sucesso.");

          onLoad();
        })
        .catch((err) => {
          console.log(err);
          toast.error("Erro ao deletar.");
        });
    }
  };

  return (
    <tr className="treinamento-card-container">
      <td>
        <div className="treinamento-card-content">{element.treinamento}</div>
      </td>
      <td>
        <div className="treinament-card-content">{element.material}</div>
      </td>
      <td>
        <div className="treinament-card-content">{element.om}</div>
      </td>
      <td>
        <div className="treinament-card-content">{element.brigada}</div>
      </td>
      <td>
        <div className="treinament-card-content">
          {formatarTipo(element.tipo)}
        </div>
      </td>
      <td>
        <div className="treinament-card-content">
          {element.executor === 1 ? "EB" : "Empresa"}
        </div>
      </td>
      <td>
        <div className="treinament-card-content">{element.instituicao}</div>
      </td>
      <td>
        <div className="treinament-card-content">
          {formatarStatus(element.status)}
        </div>
      </td>
      <td>
        <div className="treinament-card-content">{element.vagas}</div>
      </td>
      <td>
        <div className="treinament-card-content">{element.subsistema}</div>
      </td>
      <td>
        <div className="treinament-card-content">
          {element.sad.toUpperCase()}
        </div>
      </td>
      <td>
        <div className="treinament-card-content">
          {formatarData(element.dataInicio)}
        </div>
      </td>
      <td>
        <div className="treinament-card-content">
          {formatarData(element.dataInicio)}
        </div>
      </td>
      <td>
        <div className="treinamento-card-buttons">
          <button className="act-button submit-button">
            <Link className="act-button submit-button" to={`/sgc/treinamento/visualizar/${element.id}`}>
              <i className="bi bi-file-earmark-text" />
            </Link>
          </button>
          <button className="act-button edit-button" type="button">
            <Link className="act-button-link" to={`/sgc/treinamento/${element.id}`}>
              <i className="bi bi-pencil" />
            </Link>
          </button>
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

export default TreinamentoCard;
