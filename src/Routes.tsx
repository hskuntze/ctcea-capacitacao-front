import Auth from "pages/Auth";
import Home from "pages/Home";
import PrivateRoute from "PrivateRoute";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes as Switch,
} from "react-router-dom";

const Routes = () => {
  return (
    <BrowserRouter>
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
        </Switch>
      </main>
    </BrowserRouter>
  );
};

export default Routes;
