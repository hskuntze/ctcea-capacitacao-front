import { Link, useNavigate } from "react-router-dom";
import "./styles.css";
import LogotipoSISFRON from "assets/images/corujinhaLoginEb.png";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "utils/contexts/AuthContext";
import { removeAuthData, removeUserData } from "utils/storage";
import { hasAnyRoles } from "utils/auth";

const Navbar = () => {
  const { setAuthContextData } = useContext(AuthContext);

  const navigate = useNavigate();

  const [isAdmin, setIsAdmin] = useState(false);
  const [isPaginaConfirmacao, setIsPaginaConfirmacao] = useState(false);

  const logout = () => {
    removeAuthData();
    removeUserData();

    setAuthContextData({
      authenticated: false,
    });

    navigate("/sgc");
  };

  useEffect(() => {
    setIsAdmin(hasAnyRoles([{ id: 1, autorizacao: "PERFIL_ADMIN" }]));

    if (window.location.href.includes("/confirmado")) {
      setIsPaginaConfirmacao(true);
    }
  }, []);

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
            {isPaginaConfirmacao ? (
              <li className="nav-item">
                <button onClick={logout} className="nav-link">
                  Login
                </button>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/sgc/treinamento">
                    Treinamentos
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/sgc/ocorrencia">
                    Ocorrências
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/sgc/capacitado">
                    Capacitados
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/sgc/avaliacao">
                    Avaliações dos treinamentos
                  </Link>
                </li>
                <li>
                  <Link className="nav-link" to="/sgc/relatorio">
                    Relatórios
                  </Link>
                </li>
                {isAdmin && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/sgc/usuario">
                      Controle de usuário
                    </Link>
                  </li>
                )}
                <li className="nav-item">
                  <button onClick={logout} className="nav-link">
                    Sair <i className="bi bi-door-open" />
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
