import { TreinamentoType } from "types/treinamento";
import "./styles.css";
import { Link } from "react-router-dom";
import { formatarData } from "utils/functions";
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
    <div className="treinamento-card-container">
      <div className="treinamento-card-content">
        <h4>{element.treinamento}</h4>
        <span>
          <b>Material:</b> {element.material}
        </span>
        <span>
          <b>SAD:</b> {element.sad.toUpperCase()}
        </span>
        <span>
          <b>Data ínicio:</b> {formatarData(element.dataInicio)}
        </span>
        <span>
          <b>Data fim:</b> {formatarData(element.dataInicio)}
        </span>
      </div>
      <div className="treinamento-card-buttons">
        <Link to={`/sgc/treinamento/${element.id}`}>
          <button className="button edit-button" type="button">
            <i className="bi bi-pencil" />
          </button>
        </Link>
        <button
          className="button delete-button"
          type="button"
          onClick={() => deleteElement(element.id)}
        >
          <i className="bi bi-trash" />
        </button>
      </div>
    </div>
  );
};

export default TreinamentoCard;
