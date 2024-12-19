import axios, { AxiosRequestConfig } from "axios";
import Loader from "components/Loader";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import ReactInputMask from "react-input-mask";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { CidadeType } from "types/ibge/cidade";
import { UFType } from "types/ibge/uf";
import { OM } from "types/om";
import { requestBackend } from "utils/requests";

type FormData = {
  id: number;
  codigo: number;
  codom: string;
  sigla: string;
  rm: string;
  cma: string;
  de: string;
  uf: string;
  cidade: string;
  cnpj: string;
  tipo: string;
  bda: string;
  forpron: string;
  omcommaterial: string;
  endereco: string;
  cep: string;
  nivel: number;
  codregra: number;
};

const OMForm = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [bdas, setBdas] = useState<string[]>();

  const [ufs, setUfs] = useState<UFType[]>([]);
  const [loadingUf, setLoadingUf] = useState<boolean>(false);

  const [cidades, setCidades] = useState<CidadeType[]>([]);
  const [loadingCidade, setLoadingCidade] = useState<boolean>(false);

  const {
    formState: { errors },
    register,
    setValue,
    handleSubmit,
    control,
  } = useForm<FormData>();

  const urlParams = useParams();
  const navigate = useNavigate();

  const handleLoadCidadeEstado = useCallback(
    async (cidadeEstadoConcatenado: string) => {
      const cidadeEstado = cidadeEstadoConcatenado.split("/");
      setValue("uf", cidadeEstado[1]);
      await loadCidades(cidadeEstado[1]);
      setValue("cidade", cidadeEstado[0]);
    },
    [setValue]
  );

  const loadInfo = useCallback(() => {
    if (isEditing) {
      const requestParams: AxiosRequestConfig = {
        url: `/oms/${urlParams.id}`,
        method: "GET",
        withCredentials: true,
      };

      requestBackend(requestParams)
        .then((res) => {
          let data = res.data as OM;

          setValue("bda", data.bda);
          setValue("cep", data.cep.replaceAll(".", "").replaceAll("-", ""));
          setValue("cma", data.cma);
          setValue(
            "cnpj",
            data.cnpj
              ? data.cnpj
                  .replaceAll(".", "")
                  .replaceAll("/", "")
                  .replaceAll("-", "")
              : ""
          );
          setValue("codigo", data.codigo);
          setValue("codom", data.codom);
          setValue("codregra", data.codregra);
          setValue("de", data.de);
          setValue("endereco", data.endereco);
          setValue("forpron", data.forpron);
          setValue("id", data.id);
          setValue("nivel", data.nivel);
          setValue("omcommaterial", data.omcommaterial);
          setValue("rm", data.rm);
          setValue("sigla", data.sigla);
          setValue("tipo", data.tipo);
          handleLoadCidadeEstado(data.cidadeestado);
        })
        .catch((err) => {
          toast.error("Erro ao tentar os dados da Organização Militar.");
        });
    } else {
      const requestParams: AxiosRequestConfig = {
        url: `/oms`,
        withCredentials: true,
        method: "GET",
      };

      requestBackend(requestParams)
        .then((res) => {
          let data = res.data as OM[];
          let ultimaOm = data.at(-1);
          let total = ultimaOm ? ultimaOm.codigo + 1 : res.data.length + 1;
          setValue("codigo", total);
        })
        .catch(() => {
          toast.error("Erro ao resgatar o total de treinamentos.");
        });
    }
  }, [isEditing, urlParams.id, setValue, handleLoadCidadeEstado]);

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

  const loadUfs = useCallback(() => {
    setLoadingUf(true);

    const requestParams: AxiosRequestConfig = {
      url: "https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome",
      method: "GET",
      withCredentials: false,
    };

    axios(requestParams)
      .then((res) => {
        setUfs(res.data as UFType[]);
      })
      .catch((err) => {
        toast.error(
          "Não foi possível carregas as unidades federativas. Tente novamente mais tarde."
        );
      })
      .finally(() => {
        setLoadingUf(false);
      });
  }, []);

  const loadCidades = (uf: string): Promise<void> => {
    setLoadingCidade(true);

    const requestParams: AxiosRequestConfig = {
      url: `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios?orderBy=nome`,
      method: "GET",
      withCredentials: false,
    };

    return axios(requestParams)
      .then((res) => {
        setCidades(res.data as CidadeType[]);
      })
      .catch((err) => {
        toast.error(
          `Não foi possível carregar os municípios de ${uf}. Tente novamente mais tarde.`
        );
      })
      .finally(() => {
        setLoadingCidade(false);
      });
  };

  const onSubmit = (formData: FormData) => {
    const requestParams: AxiosRequestConfig = {
      url: isEditing ? `/oms/atualizar/${urlParams.id}` : "/oms/registrar",
      method: isEditing ? "PUT" : "POST",
      withCredentials: true,
      data: {
        ...formData,
        cidadeestado: formData.cidade + "/" + formData.uf,
        cep: formData.cep.replaceAll("-", "").replaceAll(".", ""),
      },
    };

    requestBackend(requestParams)
      .then((res) => {
        toast.success(
          `Organização militar ${
            isEditing ? "atualizada" : "registrada"
          } com sucesso.`
        );

        navigate("/sgc/om");
      })
      .catch((err) => {
        toast.error(
          `Erro ao ${
            isEditing ? "atualizar" : "registrar"
          } a organização militar.`
        );
      });
  };

  useEffect(() => {
    if (urlParams.id && urlParams.id !== "inserir") {
      setIsEditing(true);
    }
  }, [urlParams]);

  useEffect(() => {
    loadInfo();
    loadBdas();
    loadUfs();
  }, [loadInfo, loadBdas, loadUfs]);

  return (
    <div className="treinamento-container">
      <h3 className="form-title">Organização Militar</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="treinamento-form">
        <div className="treinamento-content">
          <div className="treinamento-left">
            {/* ID */}
            <div className="treinamento-input-group form-floating">
              <input
                type="text"
                className={`form-control`}
                id="codigo-om"
                placeholder="Código do treinamento"
                {...register("codigo")}
                disabled
              />
              <label htmlFor="codigo-om">Código da OM</label>
            </div>
            {/* Brigada */}
            <div className="treinamento-input-group form-floating">
              <Controller
                name="bda"
                control={control}
                rules={{ required: "Campo obrigatório" }}
                render={({ field }) => (
                  <select
                    id="brigada"
                    {...field}
                    className={`form-select ${errors.bda ? "is-invalid" : ""}`}
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
                {errors.bda?.message}
              </div>
            </div>
            {/* Sigla / OM */}
            <div className="treinamento-input-group form-floating">
              <input
                type="text"
                className={`form-control ${errors.sigla ? "is-invalid" : ""}`}
                id="sigla"
                placeholder="Sigla"
                {...register("sigla", {
                  required: "Campo obrigatório",
                })}
              />
              <label htmlFor="sigla">
                Sigla/OM<span className="campo-obrigatorio">*</span>
              </label>
              <div className="invalid-feedback d-block">
                {errors.sigla?.message}
              </div>
            </div>
            {/* DE */}
            <div className="treinamento-input-group form-floating">
              <input
                type="text"
                className={`form-control ${errors.de ? "is-invalid" : ""}`}
                id="de"
                placeholder="Brigada"
                {...register("de")}
              />
              <label htmlFor="de">DE</label>
              <div className="invalid-feedback d-block">
                {errors.de?.message}
              </div>
            </div>
            {/* RM */}
            <div className="treinamento-input-group form-floating">
              <Controller
                name="rm"
                control={control}
                rules={{ required: "Campo obrigatório " }}
                render={({ field }) => (
                  <select
                    id="rm"
                    className={`form-control ${errors.rm ? "is-invalid" : ""}`}
                    {...field}
                    value={field.value}
                  >
                    <option value="">Selecione uma RM</option>
                    <option value="1ª RM">1ª RM</option>
                    <option value="2ª RM">2ª RM</option>
                    <option value="3ª RM">3ª RM</option>
                    <option value="4ª RM">4ª RM</option>
                    <option value="5ª RM">5ª RM</option>
                    <option value="6ª RM">6ª RM</option>
                    <option value="7ª RM">7ª RM</option>
                    <option value="8ª RM">8ª RM</option>
                    <option value="9ª RM">9ª RM</option>
                    <option value="10ª RM">10ª RM</option>
                    <option value="11ª RM">11ª RM</option>
                    <option value="12ª RM">12ª RM</option>
                  </select>
                )}
              />
              <label htmlFor="rm" className="label-obrigatorio">
                Região Militar
                <span className="campo-obrigatorio">*</span>
              </label>
              <div className="invalid-feedback d-block">
                {errors.rm?.message}
              </div>
            </div>
            {/* CODOM */}
            <div className="treinamento-input-group form-floating">
              <input
                type="text"
                className={`form-control ${errors.codom ? "is-invalid" : ""}`}
                id="codom"
                placeholder="CODOM"
                {...register("codom")}
              />
              <label htmlFor="codom">CODOM</label>
              <div className="invalid-feedback d-block">
                {errors.codom?.message}
              </div>
            </div>
            {/* CMA */}
            <div className="treinamento-input-group form-floating">
              <input
                type="text"
                className={`form-control ${errors.cma ? "is-invalid" : ""}`}
                id="cma"
                placeholder="CMA"
                {...register("cma")}
              />
              <label htmlFor="cma">CMA</label>
              <div className="invalid-feedback d-block">
                {errors.cma?.message}
              </div>
            </div>
            {/* Nível */}
            <div className="treinamento-input-group form-floating">
              <input
                type="text"
                className={`form-control ${errors.nivel ? "is-invalid" : ""}`}
                id="nivel"
                placeholder="Nível"
                {...register("nivel")}
              />
              <label htmlFor="nivel">Nível</label>
              <div className="invalid-feedback d-block">
                {errors.nivel?.message}
              </div>
            </div>
            {/* CodRegra */}
            <div className="treinamento-input-group form-floating">
              <input
                type="text"
                className={`form-control ${errors.codregra ? "is-invalid" : ""}`}
                id="codregra"
                placeholder="CODREGRA"
                {...register("codregra")}
              />
              <label htmlFor="codregra">CODREGRA</label>
              <div className="invalid-feedback d-block">
                {errors.codregra?.message}
              </div>
            </div>
            {/* FORPRON */}
            <div className="treinamento-input-group form-floating">
              <input
                type="text"
                className={`form-control ${errors.forpron ? "is-invalid" : ""}`}
                id="forpron"
                placeholder="FORPRON"
                {...register("forpron")}
              />
              <label htmlFor="forpron">FORPRON</label>
              <div className="invalid-feedback d-block">
                {errors.forpron?.message}
              </div>
            </div>
            {/* Tipo */}
            <div className="treinamento-input-group form-floating">
              <input
                type="text"
                className={`form-control ${errors.tipo ? "is-invalid" : ""}`}
                id="tipo"
                placeholder="Tipo"
                {...register("tipo")}
              />
              <label htmlFor="tipo">Tipo</label>
              <div className="invalid-feedback d-block">
                {errors.tipo?.message}
              </div>
            </div>
          </div>
          <div className="treinamento-right">
            {/* Endereço */}
            <div className="treinamento-input-group form-floating">
              <input
                type="text"
                className={`form-control ${
                  errors.endereco ? "is-invalid" : ""
                }`}
                id="endereco"
                placeholder="Endereço"
                {...register("endereco")}
              />
              <label htmlFor="endereco">Endereço</label>
              <div className="invalid-feedback d-block">
                {errors.endereco?.message}
              </div>
            </div>
            {/* UFs */}
            {loadingUf ? (
              <Loader />
            ) : (
              <div className="treinamento-input-group form-floating">
                <Controller
                  name="uf"
                  control={control}
                  render={({ field }) => (
                    <select
                      id="uf"
                      {...field}
                      className={`form-select ${errors.uf ? "is-invalid" : ""}`}
                      onChange={(e) => {
                        field.onChange(e);
                        loadCidades(e.target.value);
                      }}
                    >
                      <option>Selecione uma UF</option>
                      {ufs &&
                        ufs.map((uf) => (
                          <option key={uf.sigla} value={uf.sigla}>
                            {uf.sigla}
                          </option>
                        ))}
                    </select>
                  )}
                />
                <label htmlFor="uf">UF</label>
                <div className="invalid-feedback d-block">
                  {errors.bda?.message}
                </div>
              </div>
            )}
            {/* Cidades */}
            {loadingCidade ? (
              <Loader />
            ) : (
              <div className="treinamento-input-group form-floating">
                <Controller
                  name="cidade"
                  control={control}
                  render={({ field }) => (
                    <select
                      id="cidade"
                      {...field}
                      className={`form-select ${
                        errors.cidade ? "is-invalid" : ""
                      }`}
                      onChange={(e) => {
                        field.onChange(e);
                      }}
                    >
                      <option>Selecione uma cidade</option>
                      {cidades &&
                        cidades.map((cidade) => (
                          <option key={cidade.nome} value={cidade.nome}>
                            {cidade.nome}
                          </option>
                        ))}
                    </select>
                  )}
                />
                <label htmlFor="cidade">Cidade</label>
                <div className="invalid-feedback d-block">
                  {errors.bda?.message}
                </div>
              </div>
            )}
            {/* CEP */}
            <div className="treinamento-input-group form-floating">
              <ReactInputMask
                type="text"
                mask={"99.999-999"}
                className={`form-control ${errors.cep ? "is-invalid" : ""}`}
                id="cep"
                placeholder="CEP"
                {...register("cep")}
              />
              <label htmlFor="cep">CEP</label>
              <div className="invalid-feedback d-block">
                {errors.cep?.message}
              </div>
            </div>
            {/* CNPJ */}
            <div className="treinamento-input-group form-floating">
              <ReactInputMask
                type="text"
                mask={"99.999.999/9999-99"}
                className={`form-control ${errors.cnpj ? "is-invalid" : ""}`}
                id="cnpj"
                placeholder="CNPJ"
                {...register("cnpj")}
              />
              <label htmlFor="cnpj">CNPJ</label>
              <div className="invalid-feedback d-block">
                {errors.cnpj?.message}
              </div>
            </div>
          </div>
        </div>
        <div className="form-buttons">
          <button className="button submit-button">Salvar</button>
          <Link to={"/sgc"}>
            <button type="button" className="button delete-button">
              Voltar
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default OMForm;
