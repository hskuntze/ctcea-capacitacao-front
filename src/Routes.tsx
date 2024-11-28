import Navbar from "components/Navbar";
import Auth from "pages/Auth";
import Capacitado from "pages/Capacitado";
import Home from "pages/Home";
import Treinamento from "pages/Treinamento";
import PrivateRoute from "PrivateRoute";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes as Switch,
} from "react-router-dom";
import { isAuthenticated } from "utils/auth";

const Routes = () => {
  return (
    <BrowserRouter>
      {isAuthenticated() && <Navbar />}
      <main id="main">
        <Switch>
          <Route path="/" element={<Navigate to="/sgc" />} />
          <Route
            path="/sgc"
            element={
              <PrivateRoute
                roles={[
                  { id: 1, autorizacao: "PERFIL_ADMIN" },
                  { id: 2, autorizacao: "PERFIL_USUARIO" },
                ]}
              >
                <Home />
              </PrivateRoute>
            }
          />
          <Route path="/sgc/login" element={<Auth />} />
          <Route
            path="/sgc/treinamento/*"
            element={
              <PrivateRoute
                roles={[
                  { id: 1, autorizacao: "PERFIL_ADMIN" },
                  { id: 2, autorizacao: "PERFIL_USUARIO" },
                ]}
              >
                <Treinamento />
              </PrivateRoute>
            }
          />
          <Route
            path="/sgc/capacitado/*"
            element={
              <PrivateRoute
                roles={[
                  { id: 1, autorizacao: "PERFIL_ADMIN" },
                  { id: 2, autorizacao: "PERFIL_USUARIO" },
                ]}
              >
                <Capacitado />
              </PrivateRoute>
            }
          />
        </Switch>
      </main>
    </BrowserRouter>
  );
};

export default Routes;
