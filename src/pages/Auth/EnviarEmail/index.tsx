import { useState } from "react";
import { useForm } from "react-hook-form";

import LogotipoSGC from "assets/images/logotipo-sgc.png";
import Loader from "components/Loader";
import { toast } from "react-toastify";
import { requestBackend } from "utils/requests";
import { AxiosRequestConfig } from "axios";
import { Link } from "react-router-dom";

type FormData = {
  email: string;
};

const EnviarEmail = () => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (formData: FormData) => {
    setLoading(true);

    const requestParams: AxiosRequestConfig = {
      url: "/usuarios/recuperar",
      method: "POST",
      withCredentials: false,
      params: {
        email: formData.email,
      },
    };

    requestBackend(requestParams)
      .then(() => {
        toast.success("Email para recuperação enviado.");
      })
      .catch(() => {
        toast.error("Não foi possível realizar a troca de senha.");
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
              id="email"
              placeholder="Email"
              className="input-element"
              {...register("email", {
                required: "Campo obrigatório",
              })}
            />
            <div className="invalid-feedback d-block div-erro">
              {errors.email?.message}
            </div>
          </div>
          {loading ? (
            <Loader />
          ) : (
            <>
              <button type="submit" className="button submit-button">
                Recuperar senha
              </button>
            </>
          )}
        </div>
      </form>
      <Link to="/sgc/login">
        <button type="button" className="button">
          Voltar
        </button>
      </Link>
    </div>
  );
};

export default EnviarEmail;
