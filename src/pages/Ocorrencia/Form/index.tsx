import { TreinamentoType } from "types/treinamento";
import "./styles.css";
import { Controller, useForm } from "react-hook-form";
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { formatarData, formatarModalidade } from "utils/functions";
import { AxiosRequestConfig } from "axios";
import { requestBackend } from "utils/requests";
import { toast } from "react-toastify";
import { Autocomplete, TextField } from "@mui/material";
import { LocalizationProvider, MobileDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { OcorrenciaType } from "types/ocorrencia";

type FormData = {
  titulo: string;
  descricaoOcorrencia: string;
  dataOcorrencia: Dayjs;
  tipoOcorrencia: string;
  descricaoTipoOutros: string;
  impactoOcorrencia: string;
  nivelImpacto: string;
  descricaoImpacto: string;
  statusClassificacao: string;
  solucaoAdotada: string;
  dataSolucao: Dayjs;
  nomeResponsavelSolucao: string;
  contatoResponsavelSolucao: string;
  instituicaoResponsavelSolucao: string;
  descricaoClassificacao: string;
  probabilidadeRecorrencia: string;
  descricaoLicoesAprendidas: string;
  nomeResponsavelOcorrencia: string;
  contatoResponsavelOcorrencia: string;
  instituicaoResponsavelOcorrencia: string;
  dataRegistro: Dayjs;
  observacoesGerais: string;
  treinamento: TreinamentoType | null;
};

const OcorrenciaForm = () => {
  const {
    control,
    formState: { errors, isSubmitted },
    handleSubmit,
    register,
    setValue,
  } = useForm<FormData>({
    defaultValues: {
      dataOcorrencia: dayjs(),
      dataRegistro: dayjs(),
    },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [todosTreinamentos, setTodosTreinamentos] = useState<TreinamentoType[]>(
    []
  );

  const [tipoOutros, setTipoOutros] = useState(false);
  const [treinamento, setTreinamento] = useState<TreinamentoType>();
  const [impactoOcorrencia, setImpactoOcorrencia] = useState(false);
  const [statusClassificacao, setStatusClassificacao] = useState(0);

  const navigate = useNavigate();

  const urlParams = useParams();

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
    setValue("treinamento.om.sigla", value.om.sigla);
    setValue("treinamento.om.cidadeestado", value.om.cidadeestado);
  };

  const loadInfo = useCallback(() => {
    if (isEditing) {
      const requestParams: AxiosRequestConfig = {
        url: `/ocorrencias/${urlParams.id}`,
        method: "GET",
        withCredentials: true,
      };

      requestBackend(requestParams)
        .then((res) => {
          let data = res.data as OcorrenciaType;
          let treinamento = data.treinamento as TreinamentoType;

          setTreinamento(treinamento);
          setValue("treinamento", treinamento);
          setValue("treinamento.id", treinamento.id);
          setValue(
            "treinamento.modalidade",
            formatarModalidade(Number(treinamento.modalidade))
          );
          setValue("treinamento.brigada", treinamento.brigada);
          setValue("treinamento.om.sigla", treinamento.om.sigla);
          setValue("treinamento.om.cidadeestado", treinamento.om.cidadeestado);
          setValue(
            "treinamento.dataInicio",
            formatarData(treinamento.dataInicio)
          );
          setValue("treinamento.dataFim", formatarData(treinamento.dataFim));

          setValue("titulo", data.titulo);
          setValue(
            "contatoResponsavelOcorrencia",
            data.contatoResponsavelOcorrencia
          );
          setValue("contatoResponsavelSolucao", data.contatoResponsavelSolucao);
          setValue("dataOcorrencia", dayjs(data.dataOcorrencia));
          setValue("dataRegistro", dayjs(data.dataRegistro));
          setValue("dataSolucao", dayjs(data.dataSolucao));
          setValue("descricaoClassificacao", data.descricaoClassificacao);
          setValue("descricaoImpacto", data.descricaoImpacto);
          setValue("descricaoLicoesAprendidas", data.descricaoLicoesAprendidas);
          setValue("descricaoOcorrencia", data.descricaoOcorrencia);
          setValue("descricaoTipoOutros", data.descricaoTipoOutros);
          setValue(
            "impactoOcorrencia",
            data.impactoOcorrencia === true ? "1" : "0"
          );
          setImpactoOcorrencia(data.impactoOcorrencia);
          setValue(
            "instituicaoResponsavelOcorrencia",
            data.instituicaoResponsavelOcorrencia
          );
          setValue(
            "instituicaoResponsavelSolucao",
            data.instituicaoResponsavelSolucao
          );
          setValue("nivelImpacto", String(data.nivelImpacto));
          setValue("nomeResponsavelOcorrencia", data.nomeResponsavelOcorrencia);
          setValue("nomeResponsavelSolucao", data.nomeResponsavelSolucao);
          setValue("observacoesGerais", data.observacoesGerais);
          setValue(
            "probabilidadeRecorrencia",
            String(data.probabilidadeRecorrencia)
          );
          setValue("solucaoAdotada", data.solucaoAdotada);
          setValue("statusClassificacao", String(data.statusClassificacao));
          setStatusClassificacao(data.statusClassificacao);
          setValue("tipoOcorrencia", String(data.tipoOcorrencia));
          if (data.tipoOcorrencia === 5) {
            setTipoOutros(true);
          }
        })
        .catch((err) => {
          toast.error("Erro ao tentar resgatar os dados da ocorrência.");
        });
    }
  }, [isEditing, urlParams.id, setValue]);

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

  const onSubmit = (formData: FormData) => {
    let dataSolucao = null;
    let dataOcorrencia = formData.dataOcorrencia.format("YYYY-MM-DD");
    let dataRegistro = formData.dataRegistro.format("YYYY-MM-DD");

    if (formData.dataSolucao) {
      dataSolucao = formData.dataSolucao.format("YYYY-MM-DD");
    }

    let impactoOcorrencia = formData.impactoOcorrencia === "1" ? true : false;

    const requestParams: AxiosRequestConfig = {
      url: `/ocorrencias/${
        isEditing ? `atualizar/${urlParams.id}` : "registrar"
      }`,
      method: isEditing ? "PUT" : "POST",
      withCredentials: true,
      data: {
        ...formData,
        dataSolucao,
        dataOcorrencia,
        dataRegistro,
        impactoOcorrencia,
        treinamento: {
          id: formData.treinamento?.id,
        },
      },
    };

    requestBackend(requestParams)
      .then(() => {
        toast.success(
          `Sucesso ao ${isEditing ? "atualizar" : "registrar"} ocorrência.`
        );

        navigate("/sgc/ocorrencia");
      })
      .catch(() => {
        toast.error(
          `Erro ao ${isEditing ? "atualizar" : "registrar"} ocorrência.`
        );
      });
  };

  useEffect(() => {
    if (urlParams.id && urlParams.id !== "inserir") {
      setIsEditing(true);
    }
  }, [urlParams]);

  useEffect(() => {
    if (!isEditing) {
      loadTreinamentos();
    } else {
      loadInfo();
    }
  }, [isEditing, loadTreinamentos, loadInfo]);

  return (
    <div className="treinamento-container">
      <h3 className="form-title">Ocorrências</h3>
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
                    getOptionLabel={(opt) =>
                      opt.treinamento ? opt.treinamento : ""
                    }
                    classes={{
                      inputRoot: `form-control input-element-root ${
                        isSubmitted && treinamento === undefined
                          ? "invalido"
                          : ""
                      }`,
                      input: "input-element-inside",
                      root: "autocomplete-root",
                      inputFocused: "input-element-focused",
                    }}
                    {...register("treinamento")}
                    value={field.value}
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
                        setTreinamento(value);
                      } else {
                        setValue("treinamento", null);
                        setValue("treinamento.id", null);
                        setValue("treinamento.dataInicio", "");
                        setValue("treinamento.dataFim", "");
                        setValue("treinamento.brigada", "");
                        setValue("treinamento.om.sigla", "");
                        setValue("treinamento.om.cidadeestado", "");
                        setValue("treinamento.modalidade", "");
                        setTreinamento(undefined);
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
                id="om-sigla"
                placeholder="OM (Organização Militar)"
                {...register("treinamento.om.sigla")}
                disabled
              />
              <label htmlFor="om-sigla">OM (Organização Militar)</label>
            </div>
            <div className="treinamento-input-group form-floating">
              <input
                type="text"
                className={`form-control`}
                id="om-cidade-estado"
                placeholder="Cidade/Estado"
                {...register("treinamento.om.cidadeestado")}
                disabled
              />
              <label htmlFor="om-cidade-estado">Cidade/Estado</label>
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
            <h6 className="ms-2 mt-3">DADOS DA OCORRÊNCIA</h6>
            {/* TÍTULO DA OCORRÊNCIA */}
            <div className="treinamento-input-group form-floating">
              <input
                type="text"
                className={`form-control`}
                id="titulo-ocorrencia"
                placeholder="Título da ocorrência"
                {...register("titulo", {
                  required: "Campo obrigatório",
                })}
              />
              <label htmlFor="titulo-ocorrencia">Título da ocorrência</label>
              <div className="invalid-feedback d-block">
                {errors.titulo?.message}
              </div>
            </div>
            {/* DATA DA OCORRÊNCIA */}
            <div className="treinamento-input-group">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Controller
                  name="dataOcorrencia"
                  control={control}
                  rules={{
                    required: "Campo obrigatório",
                  }}
                  render={({ field }) => (
                    <MobileDatePicker
                      {...field}
                      format="DD/MM/YYYY"
                      onChange={(date) => field.onChange(date)}
                      value={dayjs(field.value)}
                      label={`Data da ocorrência`}
                      className="form-control"
                    />
                  )}
                />
              </LocalizationProvider>
              <div className="invalid-feedback d-block">
                {errors.dataOcorrencia?.message}
              </div>
            </div>
            {/* TIPO DA OCORRÊNCIA */}
            <div className="treinamento-input-group treinamento-radio-input-group">
              <span>
                Tipo de ocorrência<span className="campo-obrigatorio">*</span>
              </span>
              <div className="form-check">
                <input
                  type="radio"
                  className={`form-check-input ${
                    errors.tipoOcorrencia ? "is-invalid" : ""
                  }`}
                  value="1"
                  id="logistica"
                  {...register("tipoOcorrencia", {
                    required: "Campo obrigatório",
                  })}
                  onClick={() => setTipoOutros(false)}
                />
                <label htmlFor="logistica">Logística</label>
                <div className="invalid-feedback d-block">
                  {errors.tipoOcorrencia?.message}
                </div>
              </div>
              <div className="form-check">
                <input
                  type="radio"
                  className={`form-check-input ${
                    errors.tipoOcorrencia ? "is-invalid" : ""
                  }`}
                  value="2"
                  id="tecnica"
                  {...register("tipoOcorrencia", {
                    required: "Campo obrigatório",
                  })}
                  onClick={() => setTipoOutros(false)}
                />
                <label htmlFor="tecnica">Técnica</label>
                <div className="invalid-feedback d-block">
                  {errors.tipoOcorrencia?.message}
                </div>
              </div>
              <div className="form-check">
                <input
                  type="radio"
                  className={`form-check-input ${
                    errors.tipoOcorrencia ? "is-invalid" : ""
                  }`}
                  value="3"
                  id="organizacional"
                  {...register("tipoOcorrencia", {
                    required: "Campo obrigatório",
                  })}
                  onClick={() => setTipoOutros(false)}
                />
                <label htmlFor="organizacional">Organizacional</label>
                <div className="invalid-feedback d-block">
                  {errors.tipoOcorrencia?.message}
                </div>
              </div>
              <div className="form-check">
                <input
                  type="radio"
                  className={`form-check-input ${
                    errors.tipoOcorrencia ? "is-invalid" : ""
                  }`}
                  value="4"
                  id="didatica"
                  {...register("tipoOcorrencia", {
                    required: "Campo obrigatório",
                  })}
                  onClick={() => setTipoOutros(false)}
                />
                <label htmlFor="didatica">Didática</label>
                <div className="invalid-feedback d-block">
                  {errors.tipoOcorrencia?.message}
                </div>
              </div>
              <div className="form-check">
                <input
                  type="radio"
                  className={`form-check-input ${
                    errors.tipoOcorrencia ? "is-invalid" : ""
                  }`}
                  value="5"
                  id="outra"
                  {...register("tipoOcorrencia", {
                    required: "Campo obrigatório",
                  })}
                  onClick={() => setTipoOutros(true)}
                />
                <label htmlFor="outra">Outros</label>
                <div className="invalid-feedback d-block">
                  {errors.tipoOcorrencia?.message}
                </div>
              </div>
              {tipoOutros && (
                <div className="treinamento-input-group form-floating">
                  <input
                    type="text"
                    className={`form-control ${
                      errors.descricaoTipoOutros ? "is-invalid" : ""
                    }`}
                    id="desc-tipo-outros"
                    placeholder="Instituição"
                    {...register("descricaoTipoOutros", {
                      required: "Campo obrigatório",
                    })}
                  />
                  <label htmlFor="desc-tipo-outros">
                    Especificar:<span className="campo-obrigatorio">*</span>
                  </label>
                  <div className="invalid-feedback d-block">
                    {errors.descricaoTipoOutros?.message}
                  </div>
                </div>
              )}
            </div>
            {/* IMPACTO DA OCORRÊNCIA */}
            <div className="treinamento-input-group treinamento-radio-input-group">
              <span>
                Houve impacto da ocorrência?
                <span className="campo-obrigatorio">*</span>
              </span>
              <div className="form-check">
                <input
                  type="radio"
                  className={`form-check-input ${
                    errors.impactoOcorrencia ? "is-invalid" : ""
                  }`}
                  value="1"
                  id="impacto-sim"
                  {...register("impactoOcorrencia", {
                    required: "Campo obrigatório",
                  })}
                  onClick={() => setImpactoOcorrencia(true)}
                />
                <label htmlFor="impacto-sim">Sim</label>
                <div className="invalid-feedback d-block">
                  {errors.impactoOcorrencia?.message}
                </div>
              </div>
              <div className="form-check">
                <input
                  type="radio"
                  className={`form-check-input ${
                    errors.impactoOcorrencia ? "is-invalid" : ""
                  }`}
                  value="0"
                  id="impacto-nao"
                  {...register("impactoOcorrencia", {
                    required: "Campo obrigatório",
                  })}
                  onClick={() => setImpactoOcorrencia(false)}
                />
                <label htmlFor="impacto-nao">Não</label>
                <div className="invalid-feedback d-block">
                  {errors.impactoOcorrencia?.message}
                </div>
              </div>
            </div>
            {impactoOcorrencia && (
              <div className="treinamento-input-group treinamento-radio-input-group">
                <span>
                  Nível do impacto<span className="campo-obrigatorio">*</span>
                </span>
                <div className="form-check">
                  <input
                    type="radio"
                    className={`form-check-input ${
                      errors.nivelImpacto ? "is-invalid" : ""
                    }`}
                    value="1"
                    id="baixo"
                    {...register("nivelImpacto", {
                      required: "Campo obrigatório",
                    })}
                  />
                  <label htmlFor="baixo">Baixo</label>
                  <div className="invalid-feedback d-block">
                    {errors.nivelImpacto?.message}
                  </div>
                </div>
                <div className="form-check">
                  <input
                    type="radio"
                    className={`form-check-input ${
                      errors.nivelImpacto ? "is-invalid" : ""
                    }`}
                    value="2"
                    id="medio"
                    {...register("nivelImpacto", {
                      required: "Campo obrigatório",
                    })}
                  />
                  <label htmlFor="medio">Médio</label>
                  <div className="invalid-feedback d-block">
                    {errors.nivelImpacto?.message}
                  </div>
                </div>
                <div className="form-check">
                  <input
                    type="radio"
                    className={`form-check-input ${
                      errors.nivelImpacto ? "is-invalid" : ""
                    }`}
                    value="3"
                    id="alto"
                    {...register("nivelImpacto", {
                      required: "Campo obrigatório",
                    })}
                  />
                  <label htmlFor="alto">Alto</label>
                  <div className="invalid-feedback d-block">
                    {errors.nivelImpacto?.message}
                  </div>
                </div>
              </div>
            )}
            {/* DESCRIÇÃO DO IMPACTO */}
            <div className="treinamento-input-group form-floating">
              <textarea
                className={`form-control ${
                  errors.descricaoImpacto ? "is-invalid" : ""
                }`}
                id="descricao-atividade"
                placeholder="Descrição da atividade"
                {...register("descricaoImpacto", {
                  required: "Campo obrigatório",
                })}
                rows={10}
              />
              <label htmlFor="descricao-atividade">
                Descrição do impacto
                <span className="campo-obrigatorio">*</span>
              </label>
              <div className="invalid-feedback d-block">
                {errors.descricaoImpacto?.message}
              </div>
            </div>
          </div>
          <div className="treinamento-right">
            <h6 className="ms-2 mt-3">SOLUÇÕES</h6>
            {/* STATUS DA OCORRÊNCIA */}
            <div className="treinamento-input-group treinamento-radio-input-group">
              <span>
                Status da ocorrência<span className="campo-obrigatorio">*</span>
              </span>
              <div className="form-check">
                <input
                  type="radio"
                  className={`form-check-input ${
                    errors.statusClassificacao ? "is-invalid" : ""
                  }`}
                  value="1"
                  id="solucionado"
                  {...register("statusClassificacao", {
                    required: "Campo obrigatório",
                  })}
                  onClick={() => setStatusClassificacao(1)}
                />
                <label htmlFor="solucionado">Solucionado</label>
                <div className="invalid-feedback d-block">
                  {errors.statusClassificacao?.message}
                </div>
              </div>
              <div className="form-check">
                <input
                  type="radio"
                  className={`form-check-input ${
                    errors.statusClassificacao ? "is-invalid" : ""
                  }`}
                  value="2"
                  id="em-analise"
                  {...register("statusClassificacao", {
                    required: "Campo obrigatório",
                  })}
                  onClick={() => setStatusClassificacao(2)}
                />
                <label htmlFor="em-analise">Em análise</label>
                <div className="invalid-feedback d-block">
                  {errors.statusClassificacao?.message}
                </div>
              </div>
              <div className="form-check">
                <input
                  type="radio"
                  className={`form-check-input ${
                    errors.statusClassificacao ? "is-invalid" : ""
                  }`}
                  value="3"
                  id="pendente"
                  {...register("statusClassificacao", {
                    required: "Campo obrigatório",
                  })}
                  onClick={() => setStatusClassificacao(3)}
                />
                <label htmlFor="pendente">Pendente</label>
                <div className="invalid-feedback d-block">
                  {errors.statusClassificacao?.message}
                </div>
              </div>
              <div className="form-check">
                <input
                  type="radio"
                  className={`form-check-input ${
                    errors.statusClassificacao ? "is-invalid" : ""
                  }`}
                  value="4"
                  id="nao-se-aplica"
                  {...register("statusClassificacao", {
                    required: "Campo obrigatório",
                  })}
                  onClick={() => setStatusClassificacao(0)}
                />
                <label htmlFor="nao-se-aplica">Não se aplica</label>
                <div className="invalid-feedback d-block">
                  {errors.statusClassificacao?.message}
                </div>
              </div>
              {statusClassificacao === 1 ? (
                <>
                  <div className="treinamento-input-group form-floating">
                    <input
                      type="text"
                      className={`form-control ${
                        errors.solucaoAdotada ? "is-invalid" : ""
                      }`}
                      id="solucao-adotada"
                      placeholder="Solução adotada"
                      {...register("solucaoAdotada", {
                        required: "Campo obrigatório",
                      })}
                    />
                    <label htmlFor="solucao-adotada">
                      Solução adotada
                      <span className="campo-obrigatorio">*</span>
                    </label>
                    <div className="invalid-feedback d-block">
                      {errors.solucaoAdotada?.message}
                    </div>
                  </div>
                  <div className="treinamento-input-group">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <Controller
                        name="dataSolucao"
                        control={control}
                        rules={{
                          required: "Campo obrigatório",
                        }}
                        render={({ field }) => (
                          <MobileDatePicker
                            {...field}
                            format="DD/MM/YYYY"
                            onChange={(date) => field.onChange(date)}
                            value={dayjs(field.value)}
                            label={`Data da solução`}
                            className="form-control"
                          />
                        )}
                      />
                    </LocalizationProvider>
                    <div className="invalid-feedback d-block">
                      {errors.dataSolucao?.message}
                    </div>
                  </div>
                  <div className="treinamento-input-group form-floating">
                    <input
                      type="text"
                      className={`form-control ${
                        errors.nomeResponsavelSolucao ? "is-invalid" : ""
                      }`}
                      id="nome-resp-solucao-adotada"
                      placeholder="Nome do responsável"
                      {...register("nomeResponsavelSolucao", {
                        required: "Campo obrigatório",
                      })}
                    />
                    <label htmlFor="nome-resp-solucao-adotada">
                      Nome do responsável pela solução
                      <span className="campo-obrigatorio">*</span>
                    </label>
                    <div className="invalid-feedback d-block">
                      {errors.nomeResponsavelSolucao?.message}
                    </div>
                  </div>
                  <div className="treinamento-input-group form-floating">
                    <input
                      type="text"
                      className={`form-control ${
                        errors.instituicaoResponsavelSolucao ? "is-invalid" : ""
                      }`}
                      id="instituicao-resp-solucao-adotada"
                      placeholder="Instituicao do responsável"
                      {...register("instituicaoResponsavelSolucao", {
                        required: "Campo obrigatório",
                      })}
                    />
                    <label htmlFor="instituicao-resp-solucao-adotada">
                      Instituição do responsável pela solução
                      <span className="campo-obrigatorio">*</span>
                    </label>
                    <div className="invalid-feedback d-block">
                      {errors.instituicaoResponsavelSolucao?.message}
                    </div>
                  </div>
                  <div className="treinamento-input-group form-floating">
                    <input
                      type="text"
                      className={`form-control ${
                        errors.contatoResponsavelSolucao ? "is-invalid" : ""
                      }`}
                      id="contato-resp-solucao-adotada"
                      placeholder="Contato do responsável"
                      {...register("contatoResponsavelSolucao", {
                        required: "Campo obrigatório",
                      })}
                    />
                    <label htmlFor="contato-resp-solucao-adotada">
                      Contato do responsável pela solução
                      <span className="campo-obrigatorio">*</span>
                    </label>
                    <div className="invalid-feedback d-block">
                      {errors.contatoResponsavelSolucao?.message}
                    </div>
                  </div>
                </>
              ) : statusClassificacao === 2 || statusClassificacao === 3 ? (
                <>
                  <div className="treinamento-input-group form-floating">
                    <textarea
                      className={`form-control ${
                        errors.descricaoClassificacao ? "is-invalid" : ""
                      }`}
                      id="descricao-solucao"
                      placeholder="Descrição da solucao"
                      {...register("descricaoClassificacao", {
                        required: "Campo obrigatório",
                      })}
                      rows={10}
                    />
                    <label htmlFor="descricao-solucao">
                      Descrição da classificação
                      <span className="campo-obrigatorio">*</span>
                    </label>
                    <div className="invalid-feedback d-block">
                      {errors.descricaoClassificacao?.message}
                    </div>
                  </div>
                </>
              ) : (
                <></>
              )}
              {/* PROBABILIDADE DE RECORRÊNCIA */}
              <div className="treinamento-input-group treinamento-radio-input-group">
                <span>
                  Probabilidade de recorrência
                  <span className="campo-obrigatorio">*</span>
                </span>
                <div className="form-check">
                  <input
                    type="radio"
                    className={`form-check-input ${
                      errors.probabilidadeRecorrencia ? "is-invalid" : ""
                    }`}
                    value="1"
                    id="probabilidade-baixa"
                    {...register("probabilidadeRecorrencia", {
                      required: "Campo obrigatório",
                    })}
                  />
                  <label htmlFor="probabilidade-baixa">Baixa</label>
                  <div className="invalid-feedback d-block">
                    {errors.probabilidadeRecorrencia?.message}
                  </div>
                </div>
                <div className="form-check">
                  <input
                    type="radio"
                    className={`form-check-input ${
                      errors.probabilidadeRecorrencia ? "is-invalid" : ""
                    }`}
                    value="2"
                    id="probabilidade-media"
                    {...register("probabilidadeRecorrencia", {
                      required: "Campo obrigatório",
                    })}
                  />
                  <label htmlFor="probabilidade-media">Média</label>
                  <div className="invalid-feedback d-block">
                    {errors.probabilidadeRecorrencia?.message}
                  </div>
                </div>
                <div className="form-check">
                  <input
                    type="radio"
                    className={`form-check-input ${
                      errors.probabilidadeRecorrencia ? "is-invalid" : ""
                    }`}
                    value="3"
                    id="probabilidade-alta"
                    {...register("probabilidadeRecorrencia", {
                      required: "Campo obrigatório",
                    })}
                  />
                  <label htmlFor="probabilidade-alta">Alta</label>
                  <div className="invalid-feedback d-block">
                    {errors.probabilidadeRecorrencia?.message}
                  </div>
                </div>
                <h6 className="ms-2 mt-3">LIÇÕES APRENDIDAS</h6>
                {/* DESCRIÇÃO DO IMPACTO */}
                <div className="treinamento-input-group form-floating">
                  <textarea
                    className={`form-control ${
                      errors.descricaoLicoesAprendidas ? "is-invalid" : ""
                    }`}
                    id="descricao-atividade"
                    placeholder="Descrição das lições aprendidas"
                    {...register("descricaoLicoesAprendidas")}
                    rows={10}
                  />
                  <label htmlFor="descricao-atividade">
                    Descrição das lições aprendidas
                  </label>
                  <div className="invalid-feedback d-block">
                    {errors.descricaoLicoesAprendidas?.message}
                  </div>
                </div>
                <h6 className="ms-2 mt-3">CAMPOS ADICIONAIS PARA ANÁLISE</h6>
                <div className="treinamento-input-group form-floating">
                  <input
                    type="text"
                    className={`form-control ${
                      errors.nomeResponsavelOcorrencia ? "is-invalid" : ""
                    }`}
                    id="nome-resp-solucao-adotada"
                    placeholder="Nome do responsável"
                    {...register("nomeResponsavelOcorrencia", {
                      required: "Campo obrigatório",
                    })}
                  />
                  <label htmlFor="nome-resp-solucao-adotada">
                    Nome do responsável pelo levantamento da ocorrência
                    <span className="campo-obrigatorio">*</span>
                  </label>
                  <div className="invalid-feedback d-block">
                    {errors.nomeResponsavelOcorrencia?.message}
                  </div>
                </div>
                <div className="treinamento-input-group form-floating">
                  <input
                    type="text"
                    className={`form-control ${
                      errors.instituicaoResponsavelOcorrencia
                        ? "is-invalid"
                        : ""
                    }`}
                    id="instituicao-resp-solucao-adotada"
                    placeholder="Instituicao do responsável"
                    {...register("instituicaoResponsavelOcorrencia", {
                      required: "Campo obrigatório",
                    })}
                  />
                  <label htmlFor="instituicao-resp-solucao-adotada">
                    Instituição do responsável pelo levantamento da ocorrência
                    <span className="campo-obrigatorio">*</span>
                  </label>
                  <div className="invalid-feedback d-block">
                    {errors.instituicaoResponsavelOcorrencia?.message}
                  </div>
                </div>
                <div className="treinamento-input-group form-floating">
                  <input
                    type="text"
                    className={`form-control ${
                      errors.contatoResponsavelOcorrencia ? "is-invalid" : ""
                    }`}
                    id="contato-resp-solucao-adotada"
                    placeholder="Contato do responsável"
                    {...register("contatoResponsavelOcorrencia", {
                      required: "Campo obrigatório",
                    })}
                  />
                  <label htmlFor="contato-resp-solucao-adotada">
                    Contato do responsável pelo levantamento da ocorrência
                    <span className="campo-obrigatorio">*</span>
                  </label>
                  <div className="invalid-feedback d-block">
                    {errors.contatoResponsavelOcorrencia?.message}
                  </div>
                </div>
                <div className="treinamento-input-group">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Controller
                      name="dataRegistro"
                      control={control}
                      rules={{
                        required: "Campo obrigatório",
                      }}
                      render={({ field }) => (
                        <MobileDatePicker
                          {...field}
                          format="DD/MM/YYYY"
                          onChange={(date) => field.onChange(date)}
                          value={dayjs(field.value)}
                          label={`Data de registro da ocorrência`}
                          className="form-control"
                        />
                      )}
                    />
                  </LocalizationProvider>
                  <div className="invalid-feedback d-block">
                    {errors.dataRegistro?.message}
                  </div>
                </div>
                <div className="treinamento-input-group form-floating">
                  <textarea
                    className={`form-control ${
                      errors.observacoesGerais ? "is-invalid" : ""
                    }`}
                    id="obs-gerais"
                    placeholder="Observações gerais"
                    {...register("observacoesGerais")}
                    rows={10}
                  />
                  <label htmlFor="obs-gerais">
                    Observações gerais
                    <span className="campo-obrigatorio">*</span>
                  </label>
                  <div className="invalid-feedback d-block">
                    {errors.observacoesGerais?.message}
                  </div>
                </div>
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

export default OcorrenciaForm;
