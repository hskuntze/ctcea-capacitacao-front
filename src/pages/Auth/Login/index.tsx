import "./styles.css";

import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { getTokenData } from "utils/auth";
import { AuthContext } from "utils/contexts/AuthContext";
import { requestBackendLogin } from "utils/requests";
import { saveAuthData } from "utils/storage";

import LogotipoSGC from "assets/images/logotipo-sgc.png";
import LogotipoCTCEA from "assets/images/logo_ctcea.png";
import LogotipoSISFRON from "assets/images/corujinhaLoginEb.png";
import Loader from "components/Loader";
import { toast } from "react-toastify";

type FormData = {
  username: string;
  password: string;
};

const Login = () => {
  const { setAuthContextData } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (formData: FormData) => {
    setLoading(true);

    requestBackendLogin(formData)
      .then((res) => {
        saveAuthData(res.data);
        setAuthContextData({
          authenticated: true,
          tokenData: getTokenData(),
        });

        navigate("/sgc");
      })
      .catch((err) => {
        toast.error("Não foi possível realizar o login.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="login-form-logo">
          <img
            src={LogotipoSGC}
            alt="Logotipo do Sistema Gerenciador de Capacitação"
          />
        </div>
        <div className="login-form-content">
          <div className="login-input-group">
            <input
              type="text"
              id="login-username"
              placeholder="Nome de usuário"
              className="input-element login-input"
              {...register("username", {
                required: "Campo obrigatório",
              })}
            />
            <div className="invalid-feedback d-block div-erro">
              {errors.username?.message}
            </div>
          </div>
          <div className="login-input-group">
            <input
              type="password"
              id="login-password"
              placeholder="Senha"
              className="input-element login-input"
              {...register("password", {
                required: "Campo obrigatório",
              })}
            />
            <div className="invalid-feedback d-block div-erro">
              {errors.password?.message}
            </div>
          </div>
          {loading ? (
            <Loader />
          ) : (
            <>
              <button type="submit" className="button submit-button">
                Login
              </button>
            </>
          )}
        </div>
        <div className="login-logos">
          <img src={LogotipoSISFRON} className="logotipo-sisfron" alt="Logotipo SISFRON" />
          <img src={LogotipoCTCEA} className="logotipo-ctcea" alt="Logotipo SISFRON" />
        </div>
      </form>
      {/* <Link to="/sgc/enviaremail">
        <button type="button" className="button">
          Trocar/recuperar senha
        </button>
      </Link> */}
    </div>
  );
};

export default Login;
