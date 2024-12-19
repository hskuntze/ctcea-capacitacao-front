import "./styles.css";
import { Link } from "react-router-dom";
import { AxiosRequestConfig } from "axios";
import { requestBackend } from "utils/requests";
import { toast } from "react-toastify";
import { OM } from "types/om";

interface Props {
  element: OM;
  onLoad: () => void; //Trigger para que ao deletar o registro recarregue as informações da página
}

/**
 * Elemento para exibição na listagem de treinamentos
 */
const OMCard = ({ element, onLoad }: Props) => {
  const deleteElement = (id: number) => {
    let confirm = window.confirm(
      "Você tem certeza que deseja deletar esse elemento?"
    );

    if (confirm) {
      const requestParams: AxiosRequestConfig = {
        url: `/oms/deletar/${id}`,
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
        <div className="card-content">{element.sigla}</div>
      </td>
      <td>
        <div className="card-content">{element.bda}</div>
      </td>
      <td>
        <div className="card-content">{element.endereco}</div>
      </td>
      <td>
        <div className="card-content">{element.cidadeestado}</div>
      </td>
      <td>
        <div className="card-buttons">
          <Link to={`/sgc/om/visualizar/${element.codigo}`}>
            <button className="act-button submit-button">
              <i className="bi bi-file-earmark-text" />
            </button>
          </Link>
          <Link to={`/sgc/om/${element.codigo}`}>
            <button className="act-button edit-button" type="button">
              <i className="bi bi-pencil" />
            </button>
          </Link>
          <button
            className="act-button delete-button"
            type="button"
            onClick={() => {
              if (element.codigo) {
                deleteElement(element.codigo);
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

export default OMCard;
