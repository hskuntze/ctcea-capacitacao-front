import { CapacitadoType } from "types/capacitado";
import "./styles.css";
import { formatarData, formatarModalidade } from "utils/functions";
import { Link } from "react-router-dom";
import { AxiosRequestConfig } from "axios";
import { requestBackend } from "utils/requests";
import { toast } from "react-toastify";

interface Props {
  element: CapacitadoType;
  onLoad: () => void; //Trigger para que ao deletar o registro recarregue as informações da página
}

/**
 * Elemento para exibição na listagem de capacitados
 */
const CapacitadoCard = ({ element, onLoad }: Props) => {
  const deleteElement = (id: number) => {
    let confirm = window.confirm(
      "Você tem certeza que deseja deletar esse elemento?"
    );

    if (confirm) {
      const requestParams: AxiosRequestConfig = {
        url: `/capacitados/deletar/${id}`,
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
        <div className="card-content">{element.nomeCompleto}</div>
      </td>
      <td>
        <div className="card-content">
          {element.treinamento.treinamento}
        </div>
      </td>
      <td>
        <div className="card-content">
          {element.treinamento.brigada}
        </div>
      </td>
      <td>
        <div className="card-content">{element.treinamento.om.sigla}</div>
      </td>
      <td>
        <div className="card-content">{element.turma}</div>
      </td>
      <td>
        <div className="card-content">
          {formatarData(element.treinamento.dataInicio)}
        </div>
      </td>
      <td>
        <div className="card-content">
          {formatarData(element.treinamento.dataFim)}
        </div>
      </td>
      <td>
        <div className="card-content">
          {formatarModalidade(Number(element.treinamento.modalidade))}
        </div>
      </td>
      <td>
        <div className="card-buttons">
          <Link to={`/sgc/capacitado/visualizar/${element.id}`}>
            <button className="act-button submit-button">
              <i className="bi bi-file-earmark-text" />
            </button>
          </Link>
          <Link to={`/sgc/capacitado/${element.id}`}>
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

export default CapacitadoCard;
