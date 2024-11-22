import { Link } from "react-router-dom";
import "./styles.css";
import LogotipoSISFRON from "assets/images/corujinhaLoginEb.png";

const Navbar = () => {
  return (
    <nav className="navbar-container navbar-expand-md">
      <div className="navbar-top-element">
        <div className="navbar-inner-top-element">
          <Link to="/sgc">
            <img
              className="navbar-logo"
              src={LogotipoSISFRON}
              alt="Logotipo sisfron"
            />
          </Link>
          <span className="navbar-title">
            Sistema de Gestão de Capacitação - SGC
          </span>
        </div>
      </div>
      <div className="navbar-bottom-element">
        <button
          className="navbar-menu-toggle navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarMenu"
          aria-controls="navbarMenu"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <i className="bi bi-list" />
        </button>
        <div className="collapse navbar-collapse" id="navbarMenu">
          <ul className="navbar-nav navbar-menu">
            <li className="nav-item">
              <Link className="nav-link" to="/sgc/treinamento">
                Treinamento
              </Link>
            </li>
            <li className="nav-item">
              <button className="nav-link">Capacitados</button>
            </li>
            <li className="nav-item">
              <button className="nav-link">Pesquisa de satisfação</button>
            </li>
            <li className="nav-item">
              <button className="nav-link">Ocorrência</button>
            </li>
            <li className="nav-item">
              <button className="nav-link">Controle de usuário</button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
