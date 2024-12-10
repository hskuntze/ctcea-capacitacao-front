import Navbar from "components/Navbar";
import "./styles.css";

/**
 * Página de controle para receber o redirecionamento da confirmação de cadastro do usuário
 * Rota correspondente: /confirmado
 */
const Confirmar = () => {
  return (
    <>
      <Navbar />
      <div className="confirmado-container">
        <div className="confirmado-content">
          <h5>Bem-vindo ao SGC. Realize o login.</h5>
        </div>
      </div>
    </>
  );
};

export default Confirmar;
