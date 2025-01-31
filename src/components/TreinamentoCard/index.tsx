import { TreinamentoType } from "types/treinamento";
import "./styles.css";
import { Link } from "react-router-dom";
import { formatarData, formatarStatus, formatarTipo } from "utils/functions";
import { AxiosRequestConfig } from "axios";
import { requestBackend } from "utils/requests";
import { toast } from "react-toastify";

interface Props {
  element: TreinamentoType;
  onLoad: () => void; //Trigger para que ao deletar o registro recarregue as informações da página
}

/**
 * Elemento para exibição na listagem de treinamentos
 */
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
          toast.error("Erro ao deletar.");
        });
    }
  };

  return (
    <tr className="card-container">
      <td>
        <div className="card-content">{element.treinamento}</div>
      </td>
      <td>
        <div className="card-content">{element.material}</div>
      </td>
      <td>
        <div className="card-content">{element.om.sigla}</div>
      </td>
      <td>
        <div className="card-content">{element.brigada}</div>
      </td>
      <td>
        <div className="card-content">
          {formatarTipo(element.tipo)}
        </div>
      </td>
      <td>
        <div className="card-content">
          {element.executor === 1 ? "EB" : "Empresa"}
        </div>
      </td>
      <td>
        <div className="card-content">{element.instituicao}</div>
      </td>
      <td>
        <div className="card-content">
          {formatarStatus(element.status)}
        </div>
      </td>
      <td>
        <div className="card-content">
          {element.sad.toUpperCase()}
        </div>
      </td>
      <td>
        <div className="card-content">
          {formatarData(element.dataInicio)} a {formatarData(element.dataFim)}
        </div>
      </td>
      <td>
        <div className="card-buttons">
          <Link to={`/sgc/treinamento/visualizar/${element.id}`}>
            <button className="act-button submit-button">
              <i className="bi bi-file-earmark-text" />
            </button>
          </Link>
          <Link to={`/sgc/treinamento/${element.id}`}>
            <button className="act-button edit-button" type="button">
              <i className="bi bi-pencil" />
            </button>
          </Link>
          <button
            className="act-button delete-button"
            type="button"
            onClick={() => {
              if (element.id) {
                deleteElement(element.id);
              }
            }}
          >
            <i className="bi bi-trash" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default TreinamentoCard;
