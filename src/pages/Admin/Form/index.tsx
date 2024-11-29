import { useCallback, useEffect, useState } from "react";
import "./styles.css";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { Posto } from "types/posto";
import { AxiosRequestConfig } from "axios";
import { requestBackend } from "utils/requests";
import { toast } from "react-toastify";

type FormData = {
  nome: string;
  sobrenome: string;
  nomeGuerra: string;
  identidade: string;
  instituicao: string;
  telefone: string;
  email: string;
  senha: string;
  tipo: string;
  posto: number;
};

const UsuarioForm = () => {
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    setValue,
  } = useForm<FormData>();

  const [isEditing, setIsEditing] = useState(false);
  const [isCivil, setIsCivil] = useState<boolean | null>(null);
  const [postos, setPostos] = useState<Posto[]>([]);

  const urlParams = useParams();
  const navigate = useNavigate();

  const onSubmit = (formData: FormData) => {
    const requestParams: AxiosRequestConfig = {
      url: `/usuarios/${isEditing ? `atualizar/${urlParams.id}` : "registrar"}`,
      method: "POST",
      withCredentials: true,
      data: {
        ...formData,
        password: formData.senha,
        perfis: [
          {
            id: 2,
          },
        ],
      },
    };

    requestBackend(requestParams)
      .then((res) => {
        console.log(res.data);
        toast.success(
          `Sucesso ao ${isEditing ? "atualizar" : "registrar"} o usuário`
        );
        navigate("/sgc/usuario");
      })
      .catch((err) => {
        toast.error(
          `Erro ao ${isEditing ? "atualizar" : "registrar"} o usuário`
        );
      });
  };

  const loadPostos = useCallback(() => {
    const requestParams: AxiosRequestConfig = {
      url: "/postos",
      method: "GET",
      withCredentials: true,
    };

    requestBackend(requestParams)
      .then((res) => {
        let data = res.data as Posto[];
        setPostos(data);
      })
      .catch(() => {
        toast.error("Não foi possível carregar os postos.");
      });
  }, []);

  const handleSelectTipo = (e: React.MouseEvent<HTMLInputElement>) => {
    let isCivil = e.currentTarget.value === "1" ? true : false;
    setIsCivil(isCivil);
  };

  useEffect(() => {
    if (urlParams.id && urlParams.id !== "inserir") {
      setIsEditing(true);
    }
  }, [urlParams]);

  useEffect(() => {
    loadPostos();
  }, [loadPostos]);

  return (
    <div className="treinamento-container">
      <form onSubmit={handleSubmit(onSubmit)} className="treinamento-form">
        <div className="treinamento-content">
          <div className="treinamento-left">
            <h6 className="mt-3 ml-2">DADOS DO USUÁRIO</h6>
            {/* Tipo (civil ou militar) */}
            <div className="treinamento-input-group treinamento-radio-input-group">
              <span>
                Tipo<span className="campo-obrigatorio">*</span>
              </span>
              <div className="form-check">
                <input
                  type="radio"
                  className={`form-check-input ${
                    errors.tipo ? "is-invalid" : ""
                  }`}
                  value="1"
                  id="civil"
                  {...register("tipo", { required: "Campo obrigatório" })}
                  onClick={handleSelectTipo}
                />
                <label htmlFor="civil">Civil</label>
                <div className="invalid-feedback d-block">
                  {errors.tipo?.message}
                </div>
              </div>
              <div className="form-check">
                <input
                  type="radio"
                  className={`form-check-input ${
                    errors.tipo ? "is-invalid" : ""
                  }`}
                  value="2"
                  id="militar"
                  {...register("tipo", { required: "Campo obrigatório" })}
                  onClick={handleSelectTipo}
                />
                <label htmlFor="militar">Militar</label>
                <div className="invalid-feedback d-block">
                  {errors.tipo?.message}
                </div>
              </div>
            </div>
            {isCivil !== null && (
              <>
                <div className="treinamento-input-group form-floating">
                  <input
                    type="text"
                    className={`form-control`}
                    id="nome"
                    placeholder="Nome"
                    {...register("nome")}
                  />
                  <label htmlFor="nome">Nome</label>
                  <div className="invalid-feedback d-block">
                    {errors.nome?.message}
                  </div>
                </div>
                <div className="treinamento-input-group form-floating">
                  <input
                    type="text"
                    className={`form-control`}
                    id="sobrenome"
                    placeholder="Sobrenome"
                    {...register("sobrenome")}
                  />
                  <label htmlFor="sobrenome">Sobrenome</label>
                  <div className="invalid-feedback d-block">
                    {errors.sobrenome?.message}
                  </div>
                </div>
                <div className="treinamento-input-group form-floating">
                  <input
                    type="email"
                    className={`form-control`}
                    id="email"
                    placeholder="Email"
                    {...register("email")}
                  />
                  <label htmlFor="email">Email</label>
                  <div className="invalid-feedback d-block">
                    {errors.email?.message}
                  </div>
                </div>
                <div className="treinamento-input-group form-floating">
                  <input
                    type="text"
                    className={`form-control`}
                    id="identidade"
                    placeholder="Identidade"
                    {...register("identidade")}
                  />
                  <label htmlFor="identidade">Identidade</label>
                  <div className="invalid-feedback d-block">
                    {errors.identidade?.message}
                  </div>
                </div>
                <div className="treinamento-input-group form-floating">
                  <input
                    type="password"
                    className={`form-control`}
                    id="senha"
                    placeholder="Senha"
                    {...register("senha")}
                  />
                  <label htmlFor="senha">Senha (provisória)</label>
                  <div className="invalid-feedback d-block">
                    {errors.senha?.message}
                  </div>
                </div>
                <div className="treinamento-input-group form-floating">
                  <input
                    type="text"
                    className={`form-control`}
                    id="telefone"
                    placeholder="Telefone"
                    {...register("telefone")}
                  />
                  <label htmlFor="telefone">Telefone</label>
                  <div className="invalid-feedback d-block">
                    {errors.telefone?.message}
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="treinamento-right">
            {!isCivil && isCivil !== null && (
              <>
                <h6 className="mt-3 ml-2">DADOS DO USUÁRIO MILITAR</h6>
                {/* Nome de guerra */}
                <div className="treinamento-input-group form-floating">
                  <input
                    type="text"
                    className={`form-control ${
                      errors.nomeGuerra ? "is-invalid" : ""
                    }`}
                    id="nome-guerra"
                    placeholder="Nome de guerra"
                    {...register("nomeGuerra", {
                      required: "Campo obrigatório",
                    })}
                  />
                  <label htmlFor="nome-guerra">Nome de guerra</label>
                  <div className="invalid-feedback d-block">
                    {errors.nomeGuerra?.message}
                  </div>
                </div>
                {/* Posto */}
                <div className="treinamento-input-group form-floating">
                  <Controller
                    name="posto"
                    control={control}
                    rules={{
                      required: "Campo obrigatório",
                    }}
                    render={({ field }) => (
                      <select
                        id="posto"
                        className={`form-select ${
                          errors.posto ? "is-invalid" : ""
                        }`}
                        {...field}
                      >
                        <option value="">Selecione um posto</option>
                        {postos &&
                          postos.length > 0 &&
                          postos.map((p) => (
                            <option value={p.id}>{p.titulo}</option>
                          ))}
                      </select>
                    )}
                  />
                  <label htmlFor="nome-guerra">Posto</label>
                  <div className="invalid-feedback d-block">
                    {errors.posto?.message}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        <button className="button submit-button">Salvar</button>
      </form>
    </div>
  );
};

export default UsuarioForm;
