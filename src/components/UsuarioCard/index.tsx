import { User } from "types/user";
import "./styles.css";
import { AxiosRequestConfig } from "axios";
import { requestBackend } from "utils/requests";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useEffect } from "react";

interface Props {
  element: User;
  onLoad: () => void;
}

const UsuarioCard = ({ element, onLoad }: Props) => {
  useEffect(() => {
    console.log(element);
  }, [element]);

  const deleteElement = (id: number) => {
    let confirm = window.confirm(
      "Você tem certeza que deseja deletar esse elemento?"
    );

    if (confirm) {
      const requestParams: AxiosRequestConfig = {
        url: `/usuarios/deletar/${id}`,
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
        <div className="card-content">{element.nome}</div>
      </td>
      <td>
        <div className="card-content">{element.sobrenome}</div>
      </td>
      <td>
        <div className="card-content">{element.identidade}</div>
      </td>
      <td>
        <div className="card-content">{element.email}</div>
      </td>
      <td>
        <div className="card-content">{element.perfis[0].autorizacao}</div>
      </td>
      <td>
        <div className="card-buttons">
          <Link to={`/sgc/usuario/visualizar/${element.id}`}>
            <button className="act-button submit-button">
              <i className="bi bi-file-earmark-text" />
            </button>
          </Link>
          <Link to={`/sgc/usuario/${element.id}`}>
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

export default UsuarioCard;
