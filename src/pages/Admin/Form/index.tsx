import { useCallback, useEffect, useState } from "react";
import "./styles.css";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Posto } from "types/posto";
import { AxiosRequestConfig } from "axios";
import { requestBackend } from "utils/requests";
import { toast } from "react-toastify";
import Loader from "components/Loader";
import { User } from "types/user";
import { OM } from "types/om";
import { Perfil } from "types/perfil";

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
  brigada: string;
  om: OM;
  funcao: string;
  perfil: Perfil;
  habilitado: string;
};

const UsuarioForm = () => {
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    setValue,
  } = useForm<FormData>();

  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isCivil, setIsCivil] = useState<boolean | null>(null);
  const [postos, setPostos] = useState<Posto[]>([]);
  const [oms, setOms] = useState<OM[]>([]);
  const [bdas, setBdas] = useState<string[]>([]);

  const urlParams = useParams();
  const navigate = useNavigate();

  const onSubmit = (formData: FormData) => {
    setLoading(true);

    const requestParams: AxiosRequestConfig = {
      url: `/usuarios/${isEditing ? `atualizar/${urlParams.id}` : "registrar"}`,
      method: isEditing ? "PUT" : "POST",
      withCredentials: true,
      data: {
        ...formData,
        password: formData.senha,
        perfis: [
          {
            id: formData.perfil.id,
          },
        ],
        posto: {
          id: formData.posto,
        },
        om: {
          codigo: formData.om ? formData.om.codigo : null,
        },
      },
    };

    requestBackend(requestParams)
      .then((res) => {
        toast.success(
          `Sucesso ao ${isEditing ? "atualizar" : "registrar"} o usuário`
        );
        navigate("/sgc/usuario");
      })
      .catch((err) => {
        if (err.response && err.response.data.message) {
          toast.error(
            `Erro ao ${isEditing ? "atualizar" : "registrar"} o usuário. ${
              err.response.data.message
            }`
          );
        } else {
          toast.error(
            `Erro ao ${isEditing ? "atualizar" : "registrar"} o usuário.`
          );
        }
      })
      .finally(() => {
        setLoading(false);
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
        toast.error("Não foi possível carregar os postos/graduações.");
      });
  }, []);

  const loadOms = useCallback(() => {
    const requestOmParams: AxiosRequestConfig = {
      url: "/oms",
      method: "GET",
      withCredentials: true,
    };

    requestBackend(requestOmParams)
      .then((res) => {
        setOms(res.data as OM[]);
      })
      .catch((err) => {
        toast.error(err);
      });
  }, []);

  const loadBdas = useCallback(() => {
    const requestOmParams: AxiosRequestConfig = {
      url: "/oms/bdas",
      method: "GET",
      withCredentials: true,
    };

    requestBackend(requestOmParams)
      .then((res) => {
        setBdas(res.data as string[]);
      })
      .catch((err) => {
        toast.error(err);
      });
  }, []);

  const loadInfo = useCallback(() => {
    if (isEditing) {
      setLoading(true);

      const requestParams: AxiosRequestConfig = {
        url: `/usuarios/id/${urlParams.id}`,
        withCredentials: true,
        method: "GET",
      };

      requestBackend(requestParams)
        .then((res) => {
          let data = res.data as User;

          setValue("email", data.email);
          setValue("identidade", data.identidade);
          setValue("instituicao", data.instituicao);
          setValue("nome", data.nome);
          if (data.nomeGuerra) {
            setValue("nomeGuerra", data.nomeGuerra);
          }
          if (data.posto) {
            setValue("posto", data.posto.id);
          }
          if (data.om) {
            setValue("om", data.om);
            setValue("om.codigo", data.om.codigo);
          }
          if (data.brigada) {
            setValue("brigada", data.brigada);
          }
          setValue("funcao", data.funcao);
          setValue("sobrenome", data.sobrenome);
          setValue("tipo", String(data.tipo));
          setIsCivil(data.tipo === 2 ? true : false);
          setValue("telefone", data.telefone);

          setValue("perfil", data.perfis[0]);
          setValue("perfil.id", data.perfis[0].id);

          setValue("habilitado", String(data.habilitado));
        })
        .catch((err) => {
          toast.error("Erro ao tentar carregar informações do usuário.");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isEditing, setValue, urlParams.id]);

  const handleSelectTipo = (e: React.MouseEvent<HTMLInputElement>) => {
    let isCivil = e.currentTarget.value === "2" ? true : false;
    setIsCivil(isCivil);
  };

  useEffect(() => {
    if (urlParams.id && urlParams.id !== "inserir") {
      setIsEditing(true);
    }
  }, [urlParams]);

  useEffect(() => {
    loadInfo();
    loadPostos();
    loadOms();
    loadBdas();
  }, [loadPostos, loadInfo, loadBdas, loadOms]);

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
                  id="militar"
                  {...register("tipo", { required: "Campo obrigatório" })}
                  onClick={handleSelectTipo}
                />
                <label htmlFor="militar">Militar</label>
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
                  id="civil"
                  {...register("tipo", { required: "Campo obrigatório" })}
                  onClick={handleSelectTipo}
                />
                <label htmlFor="civil">Civil</label>
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
                    type="text"
                    className={`form-control`}
                    id="funcao"
                    placeholder="Função"
                    {...register("funcao")}
                  />
                  <label htmlFor="funcao">Função</label>
                  <div className="invalid-feedback d-block">
                    {errors.funcao?.message}
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
                {isCivil && (
                  <div className="treinamento-input-group form-floating">
                    <input
                      type="text"
                      className={`form-control`}
                      id="instituicao"
                      placeholder="Instituição"
                      {...register("instituicao")}
                    />
                    <label htmlFor="instituicao">Instituição</label>
                    <div className="invalid-feedback d-block">
                      {errors.instituicao?.message}
                    </div>
                  </div>
                )}
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
                  <Controller
                    name="perfil.id"
                    control={control}
                    rules={{ required: "Campo obrigatório" }}
                    render={({ field }) => (
                      <select
                        id="perfil"
                        className={`form-select ${
                          errors.perfil ? "is-invalid" : ""
                        }`}
                        {...field}
                        value={field.value}
                      >
                        <option>Selecione uma perfil</option>
                        <option value={1}>Admin</option>
                        <option value={2}>Usuário</option>
                      </select>
                    )}
                  />
                  <label htmlFor="perfil">
                    Perfil<span className="campo-obrigatorio">*</span>
                  </label>
                  <div className="invalid-feedback d-block">
                    {errors.perfil?.message}
                  </div>
                </div>
                {/* Habilitado */}
                <div className="treinamento-input-group treinamento-radio-input-group">
                  <span>
                    Habilitado<span className="campo-obrigatorio">*</span>
                  </span>
                  <div className="form-check">
                    <input
                      type="radio"
                      className={`form-check-input ${
                        errors.habilitado ? "is-invalid" : ""
                      }`}
                      value="true"
                      id="habilitado-sim"
                      {...register("habilitado", { required: "Campo obrigatório" })}
                    />
                    <label htmlFor="habilitado-sim">Sim</label>
                    <div className="invalid-feedback d-block">
                      {errors.habilitado?.message}
                    </div>
                  </div>
                  <div className="form-check">
                    <input
                      type="radio"
                      className={`form-check-input ${
                        errors.habilitado ? "is-invalid" : ""
                      }`}
                      value="false"
                      id="habilitado-nao"
                      {...register("habilitado", { required: "Campo obrigatório" })}
                    />
                    <label htmlFor="habilitado-nao">Não</label>
                    <div className="invalid-feedback d-block">
                      {errors.habilitado?.message}
                    </div>
                  </div>
                </div>
                {!isEditing && (
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
                )}
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
                        <option value="">Selecione um posto/graduação</option>
                        {postos &&
                          postos.length > 0 &&
                          postos.map((p) => (
                            <option value={p.id}>{p.titulo}</option>
                          ))}
                      </select>
                    )}
                  />
                  <label htmlFor="posto">Posto/graduação</label>
                  <div className="invalid-feedback d-block">
                    {errors.posto?.message}
                  </div>
                </div>
                {/* Brigada */}
                <div className="treinamento-input-group form-floating">
                  <Controller
                    name="brigada"
                    control={control}
                    rules={{ required: "Campo obrigatório" }}
                    render={({ field }) => (
                      <select
                        id="brigada"
                        {...field}
                        className={`form-select ${
                          errors.brigada ? "is-invalid" : ""
                        }`}
                      >
                        <option>Selecione uma brigada</option>
                        {bdas &&
                          bdas.map((bda) => (
                            <option key={bda} value={bda}>
                              {bda}
                            </option>
                          ))}
                      </select>
                    )}
                  />
                  <label htmlFor="brigada">
                    Brigada<span className="campo-obrigatorio">*</span>
                  </label>
                  <div className="invalid-feedback d-block">
                    {errors.brigada?.message}
                  </div>
                </div>
                {/* OM */}
                <div className="treinamento-input-group form-floating">
                  <Controller
                    name="om.codigo"
                    control={control}
                    rules={{ required: "Campo obrigatório" }}
                    render={({ field }) => (
                      <select
                        id="om"
                        className={`form-select ${
                          errors.om ? "is-invalid" : ""
                        }`}
                        {...field}
                        value={field.value}
                      >
                        <option>Selecione uma OM</option>
                        {oms &&
                          oms.map((om) => (
                            <option key={om.codigo} value={om.codigo}>
                              {om.sigla}
                            </option>
                          ))}
                      </select>
                    )}
                  />
                  <label htmlFor="om">
                    OM<span className="campo-obrigatorio">*</span>
                  </label>
                  <div className="invalid-feedback d-block">
                    {errors.om?.message}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        {loading ? (
          <div className="loader-div">
            <Loader />
          </div>
        ) : (
          <div className="form-buttons">
            <button className="button submit-button">Salvar</button>
            <Link to={"/sgc"}>
              <button type="button" className="button delete-button">
                Voltar
              </button>
            </Link>
          </div>
        )}
      </form>
    </div>
  );
};

export default UsuarioForm;
