import { Controller, useForm } from "react-hook-form";
import "./styles.css";
import { TreinamentoType } from "types/treinamento";
import { Posto } from "types/posto";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AxiosRequestConfig } from "axios";
import { requestBackend } from "utils/requests";
import { CapacitadoType } from "types/capacitado";
import { formatarData, formatarModalidade } from "utils/functions";
import { toast } from "react-toastify";
import { OM } from "types/om";
import { Autocomplete, TextField } from "@mui/material";

type FormData = {
  tipo: string;
  nomeCompleto: string;
  nomeGuerra: string;
  email: string;
  celular: string;
  brigadaMilitar: string;
  instituicao: string;
  avaliacaoPratica: string;
  avaliacaoTeorica: string;
  exigeNotaPratica: boolean;
  exigeNotaTeorica: boolean;
  notaPratica: number;
  notaTeorica: number;
  turma: string;
  certificado: string;
  tipoCertificado: string[];
  numeroBi: string;
  observacoesAvaliacaoPratica: string;
  observacoesAvaliacaoTeorica: string;
  treinamento: TreinamentoType | null;
  posto: number;
  funcao: string;
};

const CapacitadoForm = () => {
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    setValue,
  } = useForm<FormData>({
    defaultValues: {
      tipoCertificado: [],
    },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isCivil, setIsCivil] = useState<boolean | null>(null);
  const [postos, setPostos] = useState<Posto[]>([]);
  const [oms, setOms] = useState<OM[]>();
  const [bdas, setBdas] = useState<string[]>();

  const [temNotaTeorica, setTemNotaTeorica] = useState(false);
  const [temNotaPratica, setTemNotaPratica] = useState(false);

  const [exigeNotaTeorica, setExigeNotaTeorica] = useState(false);
  const [exigeNotaPratica, setExigeNotaPratica] = useState(false);

  const [exibeTipoCertificado, setExibeTipoCertificado] = useState(false);

  const [treinamento, setTreinamento] = useState<TreinamentoType>();
  const [todosTreinamentos, setTodosTreinamentos] = useState<TreinamentoType[]>(
    []
  );

  const urlParams = useParams();

  const onSubmit = (formData: FormData) => {
    let avaliacaoTeorica = formData.avaliacaoTeorica === "1" ? true : false;
    let avaliacaoPratica = formData.avaliacaoPratica === "1" ? true : false;
    let certificado = formData.certificado === "1" ? true : false;

    let exigeNotaTeorica = formData.exigeNotaTeorica === null ? true : formData.exigeNotaTeorica;
    let exigeNotaPratica = formData.exigeNotaPratica === null ? true : formData.exigeNotaPratica;

    const requestParams: AxiosRequestConfig = {
      url: `${isEditing ? `/capacitados/${urlParams.id}` : "/capacitados"}`,
      method: `${isEditing ? "PUT" : "POST"}`,
      withCredentials: true,
      data: {
        ...formData,
        avaliacaoPratica,
        avaliacaoTeorica,
        certificado,
        exigeNotaPratica,
        exigeNotaTeorica,
        treinamento: {
          id: formData.treinamento ? formData.treinamento.id : null,
        },
        posto: {
          id: formData.posto,
        },
      },
    };

    requestBackend(requestParams)
      .then((res) => {
        toast.success(`Sucesso ao ${isEditing ? "atualizar" : "registrar"}.`);
      })
      .catch((err) => {
        console.log(err);
        toast.error(`Erro ao ${isEditing ? "atualizar" : "registrar"}.`);
      });
  };

  const handleSelectTipo = (e: React.MouseEvent<HTMLInputElement>) => {
    let isCivil = e.currentTarget.value === "1" ? true : false;
    setIsCivil(isCivil);
  };

  const handleSelectTreinamento = (value: TreinamentoType) => {
    setValue("treinamento", value);
    setValue("treinamento.id", value.id);
    setValue("treinamento.brigada", value.brigada);
    setValue("treinamento.dataInicio", formatarData(value.dataInicio));
    setValue("treinamento.dataFim", formatarData(value.dataFim));
    setValue(
      "treinamento.modalidade",
      formatarModalidade(Number(value.modalidade))
    );
    setValue("treinamento.om", value.om);

    setTreinamento(value);
  };

  const loadTreinamentos = useCallback(() => {
    const requestParams: AxiosRequestConfig = {
      url: "/treinamentos",
      method: "GET",
      withCredentials: true,
    };

    requestBackend(requestParams)
      .then((res) => {
        setTodosTreinamentos(res.data as TreinamentoType[]);
      })
      .catch(() => {
        toast.error("Erro ao tentar carregar todos os treinamentos");
      });
  }, []);

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
      const requestCapacitadoParams: AxiosRequestConfig = {
        url: `/capacitados/${urlParams.id}`,
        withCredentials: true,
        method: "GET",
      };

      requestBackend(requestCapacitadoParams)
        .then((res) => {
          let data = res.data as CapacitadoType;

          console.log(data);

          setValue(
            "avaliacaoPratica",
            data.avaliacaoPratica === true ? "1" : "0"
          );
          setTemNotaPratica(data.avaliacaoPratica);
          setValue(
            "avaliacaoTeorica",
            data.avaliacaoTeorica === true ? "1" : "0"
          );
          setTemNotaTeorica(data.avaliacaoTeorica);
          setValue("brigadaMilitar", data.brigadaMilitar);
          setValue("celular", data.celular);
          setValue("certificado", data.certificado === true ? "1" : "0");
          setExibeTipoCertificado(data.certificado);
          setValue("email", data.email);
          setValue("exigeNotaPratica", data.exigeNotaPratica);
          setExigeNotaPratica(
            data.exigeNotaPratica !== null ? data.exigeNotaPratica : false
          );
          setValue("exigeNotaTeorica", data.exigeNotaTeorica);
          setExigeNotaTeorica(
            data.exigeNotaTeorica !== null ? data.exigeNotaTeorica : false
          );
          setValue("instituicao", data.instituicao);
          setValue("nomeCompleto", data.nomeCompleto);
          setValue("nomeGuerra", data.nomeGuerra);
          setValue("notaPratica", data.notaPratica);
          setValue("notaTeorica", data.notaTeorica);
          setValue("numeroBi", data.numeroBi);
          setValue("turma", data.turma);
          setValue("funcao", data.funcao);
          setValue("tipo", String(data.tipo));
          setIsCivil(data.tipo === 1 ? true : false);
          if (data.posto !== null) {
            setValue("posto", data.posto.id);
          }
          setValue(
            "observacoesAvaliacaoPratica",
            data.observacoesAvaliacaoPratica
          );
          setValue(
            "observacoesAvaliacaoTeorica",
            data.observacoesAvaliacaoTeorica
          );
          setValue("tipoCertificado", data.tipoCertificado);

          let treinamento = data.treinamento as TreinamentoType;
          setValue("treinamento", treinamento);
          setValue("treinamento.treinamento", treinamento.treinamento);
          setValue("treinamento.id", treinamento.id);
          setValue("treinamento.brigada", treinamento.brigada);
          setValue("treinamento.om", treinamento.om);
          setValue(
            "treinamento.dataInicio",
            formatarData(treinamento.dataInicio)
          );
          setValue("treinamento.dataFim", formatarData(treinamento.dataFim));
          setValue(
            "treinamento.modalidade",
            formatarModalidade(Number(treinamento.modalidade))
          );
          setTreinamento(treinamento);
        })
        .catch(() => {});
    }
  }, [isEditing, setValue, urlParams.id]);

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

    if (!isEditing) {
      loadTreinamentos();
    }
  }, [loadInfo, loadPostos, loadOms, loadBdas, isEditing, loadTreinamentos]);

  return (
    <div className="treinamento-container">
      <form onSubmit={handleSubmit(onSubmit)} className="treinamento-form">
        <div className="treinamento-content">
          <div className="treinamento-left">
            <h6 className="ms-2 mt-3">DADOS DO TREINAMENTO</h6>
            <div className="treinamento-input-group form-floating">
              <Controller
                name="treinamento"
                control={control}
                rules={{
                  required: "Campo obrigatório",
                }}
                render={({ field, fieldState }) => (
                  <Autocomplete
                    disablePortal
                    options={todosTreinamentos}
                    getOptionLabel={(opt) => opt.treinamento}
                    classes={{
                      inputRoot: `form-control input-element-root ${
                        errors.treinamento ? "invalido" : ""
                      }`,
                      input: "input-element-inside",
                      root: "autocomplete-root",
                      inputFocused: "input-element-focused",
                    }}
                    {...register("treinamento")}
                    value={field.value ? field.value : null}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        slotProps={{
                          htmlInput: {
                            ...params.inputProps,
                            id: "input-treinamento",
                          },
                        }}
                        label="Selecione um treinamento"
                        classes={{
                          root: "text-field",
                        }}
                      />
                    )}
                    onChange={(event, value) => {
                      if (value) {
                        handleSelectTreinamento(value);
                      } else {
                        setValue("treinamento", null);
                        setValue("treinamento.id", null);
                        setValue("treinamento.dataInicio", "");
                        setValue("treinamento.dataFim", "");
                        setValue("treinamento.brigada", "");
                        setValue("treinamento.om", "");
                        setValue("treinamento.modalidade", "");
                      }
                    }}
                  />
                )}
              />
              <div className="invalid-feedback d-block">
                {errors.treinamento?.message}
              </div>
            </div>
            <div className="treinamento-input-group form-floating">
              <input
                type="text"
                className={`form-control`}
                id="id-treinamento"
                placeholder="ID do Treinamento"
                {...register("treinamento.id")}
                disabled
              />
              <label htmlFor="id-treinamento">ID do Treinamento</label>
            </div>
            <div className="treinamento-input-group form-floating">
              <input
                type="text"
                className={`form-control`}
                id="modalidade-treinamento"
                placeholder="Modalidade"
                {...register("treinamento.modalidade")}
                disabled
              />
              <label htmlFor="modalidade-treinamento">Modalidade</label>
            </div>
            <div className="treinamento-input-group form-floating">
              <input
                type="text"
                className={`form-control`}
                id="brigada-treinamento"
                placeholder="Brigada"
                {...register("treinamento.brigada")}
                disabled
              />
              <label htmlFor="brigada-treinamento">Brigada</label>
            </div>
            <div className="treinamento-input-group form-floating">
              <input
                type="text"
                className={`form-control`}
                id="om-treinamento"
                placeholder="OM (Organização Militar)"
                {...register("treinamento.om")}
                disabled
              />
              <label htmlFor="om-treinamento">OM (Organização Militar)</label>
            </div>
            <div className="treinamento-input-group form-floating">
              <input
                type="text"
                className={`form-control`}
                id="data-inicio-treinamento"
                placeholder="Data início"
                {...register("treinamento.dataInicio")}
                disabled
              />
              <label htmlFor="data-inicio-treinamento">Data início</label>
            </div>
            <div className="treinamento-input-group form-floating">
              <input
                type="text"
                className={`form-control`}
                id="data-fim-treinamento"
                placeholder="Data início"
                {...register("treinamento.dataFim")}
                disabled
              />
              <label htmlFor="data-fim-treinamento">Data fim</label>
            </div>
            <h6 className="ms-2 mt-3">DADOS DO INSTRUENDO</h6>
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
                {/* Nome do instruendo */}
                <div className="treinamento-input-group form-floating">
                  <input
                    type="text"
                    className={`form-control ${
                      errors.nomeCompleto ? "is-invalid" : ""
                    }`}
                    id="nome-completo"
                    placeholder="Nome completo"
                    {...register("nomeCompleto", {
                      required: "Campo obrigatório",
                    })}
                  />
                  <label htmlFor="nome-completo">Nome completo</label>
                  <div className="invalid-feedback d-block">
                    {errors.nomeCompleto?.message}
                  </div>
                </div>
                {/* Contato */}
                <div className="treinamento-input-group form-floating">
                  <input
                    type="email"
                    className={`form-control ${
                      errors.email ? "is-invalid" : ""
                    }`}
                    id="email"
                    placeholder="Email"
                    {...register("email", {
                      required: "Campo obrigatório",
                    })}
                  />
                  <label htmlFor="email">Email</label>
                  <div className="invalid-feedback d-block">
                    {errors.email?.message}
                  </div>
                </div>
                {/* Telefone */}
                <div className="treinamento-input-group form-floating">
                  <input
                    type="text"
                    className={`form-control ${
                      errors.celular ? "is-invalid" : ""
                    }`}
                    id="celular"
                    placeholder="Celular"
                    {...register("celular", {
                      required: "Campo obrigatório",
                    })}
                  />
                  <label htmlFor="celular">Telefone</label>
                  <div className="invalid-feedback d-block">
                    {errors.celular?.message}
                  </div>
                </div>
                {/* Função */}
                <div className="treinamento-input-group form-floating">
                  <input
                    type="text"
                    className={`form-control ${
                      errors.funcao ? "is-invalid" : ""
                    }`}
                    id="funcao"
                    placeholder="Função"
                    {...register("funcao", {
                      required: "Campo obrigatório",
                    })}
                  />
                  <label htmlFor="funcao">Função</label>
                  <div className="invalid-feedback d-block">
                    {errors.funcao?.message}
                  </div>
                </div>
                {/* Função */}
                <div className="treinamento-input-group form-floating">
                  <Controller
                    name="turma"
                    control={control}
                    rules={{
                      required: "Campo obrigatório",
                    }}
                    render={({ field }) => (
                      <select
                        id="turma"
                        className={`form-select ${
                          errors.turma ? "is-invalid" : ""
                        }`}
                        {...field}
                      >
                        <option value="">Selecione uma turma</option>
                        {treinamento &&
                          treinamento.turmas &&
                          treinamento.turmas.map((t) => (
                            <option value={t.nome}>{t.nome}</option>
                          ))}
                      </select>
                    )}
                  />
                  <label htmlFor="turma">Turma</label>
                  <div className="invalid-feedback d-block">
                    {errors.turma?.message}
                  </div>
                </div>
              </>
            )}
            {!isCivil && isCivil !== null && (
              <>
                {/* Brigada */}
                <div className="treinamento-input-group form-floating">
                  <Controller
                    name="brigadaMilitar"
                    control={control}
                    rules={{ required: "Campo obrigatório" }}
                    render={({ field }) => (
                      <select
                        id="brigada"
                        {...field}
                        className={`form-select ${
                          errors.brigadaMilitar ? "is-invalid" : ""
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
                    Brigada do Militar
                    <span className="campo-obrigatorio">*</span>
                  </label>
                  <div className="invalid-feedback d-block">
                    {errors.brigadaMilitar?.message}
                  </div>
                </div>
                {/* OM */}
                <div className="treinamento-input-group form-floating">
                  <Controller
                    name="instituicao"
                    control={control}
                    rules={{ required: "Campo obrigatório" }}
                    render={({ field }) => (
                      <select
                        id="om"
                        className={`form-select ${
                          errors.instituicao ? "is-invalid" : ""
                        }`}
                        {...field}
                      >
                        <option>Selecione uma OM</option>
                        {oms &&
                          oms.map((om) => (
                            <option key={om.codigo} value={om.sigla}>
                              {om.sigla}
                            </option>
                          ))}
                      </select>
                    )}
                  />
                  <label htmlFor="om">
                    OM do Militar<span className="campo-obrigatorio">*</span>
                  </label>
                  <div className="invalid-feedback d-block">
                    {errors.instituicao?.message}
                  </div>
                </div>
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
          <div className="treinamento-right">
            <h6 className="ms-2 mt-3">AVALIAÇÕES</h6>
            {/* Avaliação teórica */}
            <div className="treinamento-input-group treinamento-radio-input-group">
              <span>
                Avaliação teórica?<span className="campo-obrigatorio">*</span>
              </span>
              <div className="form-check">
                <input
                  type="radio"
                  className={`form-check-input ${
                    errors.avaliacaoTeorica ? "is-invalid" : ""
                  }`}
                  value="1"
                  id="at-sim"
                  {...register("avaliacaoTeorica", {
                    required: "Campo obrigatório",
                  })}
                  onClick={() => setTemNotaTeorica(true)}
                />
                <label htmlFor="at-sim">Sim</label>
                <div className="invalid-feedback d-block">
                  {errors.avaliacaoTeorica?.message}
                </div>
              </div>
              <div className="form-check">
                <input
                  type="radio"
                  className={`form-check-input ${
                    errors.avaliacaoTeorica ? "is-invalid" : ""
                  }`}
                  value="0"
                  id="at-nao"
                  {...register("avaliacaoTeorica", {
                    required: "Campo obrigatório",
                  })}
                  onClick={() => setTemNotaTeorica(false)}
                />
                <label htmlFor="at-nao">Não</label>
                <div className="invalid-feedback d-block">
                  {errors.avaliacaoTeorica?.message}
                </div>
              </div>
            </div>
            {temNotaTeorica && (
              <div className="treinamento-input-group form-floating">
                <div className="nota-group form-floating">
                  <input
                    type="text"
                    className={`form-control ${
                      errors.notaTeorica ? "is-invalid" : ""
                    }`}
                    id="nota-teorica"
                    placeholder="Nota teórica"
                    {...register("notaTeorica", {
                      required: exigeNotaTeorica ? false : "Campo obrigatório",
                      pattern: {
                        value: /^\d+([.,]\d{1,2})?$/,
                        message:
                          "Valor inválido. Use vírgula ou ponto com até 2 casas decimais.",
                      },
                    })}
                    disabled={exigeNotaTeorica}
                  />
                  <label htmlFor="nota-teorica">Nota teórica</label>
                  <div className="form-check nota-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="exige-nota-teorica"
                      {...register("exigeNotaTeorica")}
                      onClick={() => setExigeNotaTeorica(!exigeNotaTeorica)}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="exige-nota-teorica"
                    >
                      Não se aplica
                    </label>
                  </div>
                </div>
                <div className="invalid-feedback d-block">
                  {errors.notaTeorica?.message}
                </div>
              </div>
            )}
            {/* Observações da Avaliação Teórica */}
            <div className="treinamento-input-group form-floating">
              <textarea
                className={`form-control ${
                  errors.observacoesAvaliacaoTeorica ? "is-invalid" : ""
                }`}
                id="obs-avaliacao-teorica"
                placeholder="Observações da Avaliação Teórica"
                {...register("observacoesAvaliacaoTeorica")}
                rows={10}
              />
              <label htmlFor="obs-avaliacao-teorica">
                Observações da Avaliação Teórica
              </label>
              <div className="invalid-feedback d-block">
                {errors.observacoesAvaliacaoTeorica?.message}
              </div>
            </div>
            {/* Avaliação prática */}
            <div className="treinamento-input-group treinamento-radio-input-group">
              <span>
                Avaliação prática?<span className="campo-obrigatorio">*</span>
              </span>
              <div className="form-check">
                <input
                  type="radio"
                  className={`form-check-input ${
                    errors.avaliacaoPratica ? "is-invalid" : ""
                  }`}
                  value="1"
                  id="at-sim"
                  {...register("avaliacaoPratica", {
                    required: "Campo obrigatório",
                  })}
                  onClick={() => setTemNotaPratica(true)}
                />
                <label htmlFor="at-sim">Sim</label>
                <div className="invalid-feedback d-block">
                  {errors.avaliacaoPratica?.message}
                </div>
              </div>
              <div className="form-check">
                <input
                  type="radio"
                  className={`form-check-input ${
                    errors.avaliacaoPratica ? "is-invalid" : ""
                  }`}
                  value="0"
                  id="at-nao"
                  {...register("avaliacaoPratica", {
                    required: "Campo obrigatório",
                  })}
                  onClick={() => setTemNotaPratica(false)}
                />
                <label htmlFor="at-nao">Não</label>
                <div className="invalid-feedback d-block">
                  {errors.avaliacaoPratica?.message}
                </div>
              </div>
            </div>
            {temNotaPratica && (
              <div className="treinamento-input-group form-floating">
                <div className="nota-group form-floating">
                  <input
                    type="text"
                    className={`form-control ${
                      errors.notaPratica ? "is-invalid" : ""
                    }`}
                    id="nota-pratica"
                    placeholder="Nota teórica"
                    {...register("notaPratica", {
                      required: exigeNotaPratica ? false : "Campo obrigatório",
                      pattern: {
                        value: /^\d+([.,]\d{1,2})?$/,
                        message:
                          "Valor inválido. Use vírgula ou ponto com até 2 casas decimais.",
                      },
                    })}
                    disabled={exigeNotaPratica}
                  />
                  <label htmlFor="nota-pratica">Nota teórica</label>
                  <div className="form-check nota-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="exige-nota-pratica"
                      {...register("exigeNotaPratica")}
                      onClick={() => setExigeNotaPratica(!exigeNotaPratica)}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="exige-nota-pratica"
                    >
                      Não se aplica
                    </label>
                  </div>
                </div>
                <div className="invalid-feedback d-block">
                  {errors.notaPratica?.message}
                </div>
              </div>
            )}
            {/* Observações da Avaliação Prática */}
            <div className="treinamento-input-group form-floating">
              <textarea
                className={`form-control ${
                  errors.observacoesAvaliacaoPratica ? "is-invalid" : ""
                }`}
                id="obs-avaliacao-pratica"
                placeholder="Observações da Avaliação Prática"
                {...register("observacoesAvaliacaoPratica")}
                rows={10}
              />
              <label htmlFor="obs-avaliacao-pratica">
                Observações da Avaliação Prática
              </label>
              <div className="invalid-feedback d-block">
                {errors.observacoesAvaliacaoPratica?.message}
              </div>
            </div>
            <h6 className="ms-2 mt-3">CERTIFICAÇÃO</h6>
            {/* Certificado */}
            <div className="treinamento-input-group treinamento-radio-input-group">
              <span>
                Certificado<span className="campo-obrigatorio">*</span>
              </span>
              <div className="form-check">
                <input
                  type="radio"
                  className={`form-check-input ${
                    errors.certificado ? "is-invalid" : ""
                  }`}
                  value="1"
                  id="certificado-sim"
                  {...register("certificado", {
                    required: "Campo obrigatório",
                  })}
                  onClick={() => setExibeTipoCertificado(true)}
                />
                <label htmlFor="certificado-sim">Sim</label>
                <div className="invalid-feedback d-block">
                  {errors.certificado?.message}
                </div>
              </div>
              <div className="form-check">
                <input
                  type="radio"
                  className={`form-check-input ${
                    errors.certificado ? "is-invalid" : ""
                  }`}
                  value="0"
                  id="certificado-nao"
                  {...register("certificado", {
                    required: "Campo obrigatório",
                  })}
                  onClick={() => setExibeTipoCertificado(false)}
                />
                <label htmlFor="certificado-nao">Não</label>
                <div className="invalid-feedback d-block">
                  {errors.certificado?.message}
                </div>
              </div>
            </div>
            {exibeTipoCertificado && (
              <div className="treinamento-input-group">
                <label htmlFor="tipo-certificado-impresso">
                  Tipo do certificado
                </label>
                <div className="form-check nota-check">
                  <Controller
                    name="tipoCertificado"
                    control={control}
                    render={({ field }) => (
                      <>
                        <input
                          className="form-check-input"
                          checked={field.value.includes("impresso")}
                          type="checkbox"
                          id="tipo-certificado-impresso"
                          {...register("tipoCertificado", {
                            required: "Campo obrigatório",
                          })}
                          value={"impresso"}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="tipo-certificado-impresso"
                        >
                          Impresso
                        </label>
                      </>
                    )}
                  />
                </div>
                <div className="form-check nota-check">
                  <Controller
                    name="tipoCertificado"
                    control={control}
                    render={({ field }) => (
                      <>
                        <input
                          className="form-check-input"
                          checked={field.value.includes("digital")}
                          type="checkbox"
                          id="tipo-certificado-digital"
                          {...register("tipoCertificado", {
                            required: "Campo obrigatório",
                          })}
                          value={"digital"}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="tipo-certificado-digital"
                        >
                          Digital
                        </label>
                      </>
                    )}
                  />
                </div>
                <div className="invalid-feedback d-block">
                  {errors.tipoCertificado?.message}
                </div>
              </div>
            )}
            <h6 className="ms-2 mt-3">BOLETIM INTERNO (BI)</h6>
            <div className="treinamento-input-group form-floating">
              <input
                type="text"
                className={`form-control ${
                  errors.numeroBi ? "is-invalid" : ""
                }`}
                id="numero-bi"
                placeholder="Número de BI"
                {...register("numeroBi", {
                  required: "Campo obrigatório",
                })}
              />
              <label className="form-check-label" htmlFor="numero-bi">
                Número de BI
              </label>
              <div className="invalid-feedback d-block">
                {errors.numeroBi?.message}
              </div>
            </div>
          </div>
        </div>
        <button className="button submit-button">Salvar</button>
      </form>
    </div>
  );
};

export default CapacitadoForm;