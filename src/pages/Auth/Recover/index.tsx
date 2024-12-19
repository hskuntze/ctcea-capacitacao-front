import LogotipoSGC from "assets/images/logotipo-sgc.png";
import { AxiosRequestConfig } from "axios";
import Loader from "components/Loader";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { requestBackend } from "utils/requests";

type FormData = {
  senhaAntiga: string;
  senha: string;
  confirmarSenha: string;
};

// type UrlParams = {
//   token: string;
// };

const Recover = () => {
  const [loading, setLoading] = useState(false);

  //const urlParams = useParams<UrlParams>();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>();

  const onSubmit = (formData: FormData) => {
    setLoading(true);

    // const requestParams: AxiosRequestConfig = {
    //   url: "/usuarios/salvarTrocaDeSenha",
    //   method: "POST",
    //   withCredentials: false,
    //   data: {
    //     password: formData.senha,
    //     token: urlParams.token,
    //   },
    // };
    const requestParams: AxiosRequestConfig = {
      url: "/usuarios/salvarTrocaDeSenha",
      method: "POST",
      withCredentials: true,
      params: {
        novaSenha: formData.senha,
        senhaAntiga: formData.senhaAntiga,
      }
    };

    requestBackend(requestParams)
      .then(() => {
        toast.success("Sucesso ao trocar a senha.");
        navigate("/sgc");
      })
      .catch((err) => {
        toast.error("Erro ao trocar a senha.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const senha = watch("senha");

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
              type="password"
              id="senhaAntiga"
              placeholder="Senha antiga"
              className="input-element"
              {...register("senhaAntiga", {
                required: "Campo obrigatório",
              })}
            />
            <div className="invalid-feedback d-block div-erro">
              {errors.senhaAntiga?.message}
            </div>
          </div>
          <div className="login-input-group">
            <input
              type="password"
              id="senha"
              placeholder="Nova senha"
              className="input-element"
              {...register("senha", {
                required: "Campo obrigatório",
              })}
            />
            <div className="invalid-feedback d-block div-erro">
              {errors.senha?.message}
            </div>
          </div>
          <div className="login-input-group">
            <input
              type="password"
              id="confirmar-senha"
              placeholder="Confirme a nova senha"
              className="input-element"
              {...register("confirmarSenha", {
                required: "Campo obrigatório",
                validate: (value) =>
                  value === senha || "Senhas não correspondem",
              })}
            />
            <div className="invalid-feedback d-block div-erro">
              {errors.confirmarSenha?.message}
            </div>
          </div>
          {loading ? (
            <Loader />
          ) : (
            <button type="submit" className="button submit-button">
              Trocar senha
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default Recover;
