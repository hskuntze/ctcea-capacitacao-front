import "./styles.css";

import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { getTokenData } from "utils/auth";
import { AuthContext } from "utils/contexts/AuthContext";
import { UserContext } from "utils/contexts/UserContext";
import { requestBackendLogin } from "utils/requests";
import { saveAuthData } from "utils/storage";

import LogotipoSGC from "assets/images/logotipo-sgc.png";

type FormData = {
  username: string;
  password: string;
};

const Login = () => {
  const { setAuthContextData } = useContext(AuthContext);
  const { setUserContextData } = useContext(UserContext);

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
        setLoading(false);
        saveAuthData(res.data);
        setAuthContextData({
          authenticated: true,
          tokenData: getTokenData(),
        });

        navigate("/sgc");
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="login-form-logo">
          <img src={LogotipoSGC} alt="Logotipo do Sistema Gerenciador de Capacitação" />
        </div>
        <div className="login-form-content">
          <span>Sistema de Gestão de Capacitação</span>
          <div className="login-input-group">
            <input
              type="text"
              id="login-username"
              placeholder="Nome de usuário"
              className="input-element"
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
              className="input-element"
              {...register("password", {
                required: "Campo obrigatório",
              })}
            />
            <div className="invalid-feedback d-block div-erro">
              {errors.password?.message}
            </div>
          </div>
          <button type="submit" className="button submit-button">
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
