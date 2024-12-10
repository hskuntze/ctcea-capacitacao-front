import { useLocation } from "react-router-dom";
import "./styles.css";

const NaoEncontrado = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const msg = queryParams.get("message");

  return (
    <div className="nao-encontrado-container">
      <span>Recurso não encontrado</span>
      <span>{msg}</span>
    </div>
  );
};

export default NaoEncontrado;
