import { Controller, useForm } from "react-hook-form";
import "./styles.css";

import { LocalizationProvider, MobileDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { AxiosRequestConfig } from "axios";
import { requestBackend } from "utils/requests";
import { toast } from "react-toastify";
import { TreinamentoType } from "types/treinamento";

type FormData = {
  sad: string;
  material: string;
  treinamento: string;
  tipo: string;
  subsistema: string;
  modalidade: string;
  brigada: string;
  om: string;
  grupo: string;
  executor: string;
  instituicao: string;
  dataInicio: Dayjs;
  dataFim: Dayjs;
  vagas: number;
  status: string;
  avaliacaoPratica: string;
  avaliacaoTeorica: string;
  nomeInstrutores: string;
  contatoInstrutores: string;
  certificado: string;
  logisticaTreinamento: string;
  nivelamento: string;
  cargaHoraria: number;
  publicoAlvo: string;
  descricaoAtividade: string;
  materialDidatico: string;
  observacoes: string;
  preRequisitos: string;
};

const TreinamentoForm = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
    setValue,
  } = useForm<FormData>({
    defaultValues: {
      dataInicio: dayjs(),
      dataFim: dayjs(),
    },
  });

  const urlParams = useParams();

  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);

  const loadInfo = useCallback(() => {
    if (isEditing) {
      const requestParams: AxiosRequestConfig = {
        url: `/treinamentos/${urlParams.id}`,
        withCredentials: true,
        method: "GET",
      };

      requestBackend(requestParams)
        .then((res) => {
          let data = res.data as TreinamentoType;

          console.log(data.avaliacaoPratica);

          setValue("sad", data.sad);
          setValue("tipo", String(data.tipo));
          setValue("material", data.material);
          setValue("treinamento", data.treinamento);
          setValue("subsistema", data.subsistema);
          setValue("modalidade", String(data.modalidade));
          setValue("brigada", data.brigada);
          setValue("om", data.om);
          setValue("grupo", String(data.grupo));
          setValue("executor", String(data.executor));
          setValue("instituicao", data.instituicao);
          setValue("dataInicio", dayjs(data.dataInicio));
          setValue("dataFim", dayjs(data.dataFim));
          setValue("vagas", data.vagas);
          setValue("status", String(data.status));
          setValue("avaliacaoPratica", data.avaliacaoPratica === true ? "1" : "0");
          setValue("avaliacaoTeorica", data.avaliacaoTeorica === true ? "1" : "0");
          setValue("nomeInstrutores", data.nomeInstrutores);
          setValue("contatoInstrutores", data.contatoInstrutores);
          setValue("certificado", data.certificado === true ? "1" : "0");
          setValue("logisticaTreinamento", data.logisticaTreinamento);
          setValue("nivelamento", data.nivelamento === true ? "1" : "0");
          setValue("preRequisitos", data.preRequisitos);
          setValue("cargaHoraria", data.cargaHoraria);
          setValue("publicoAlvo", data.publicoAlvo === true ? "1" : "0");
          setValue("descricaoAtividade", data.descricaoAtividade);
          setValue("materialDidatico", data.materialDidatico);
          setValue("observacoes", data.observacoes);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [isEditing, urlParams.id, setValue]);

  const onSubmit = (formData: FormData) => {
    /**
     * Tratamento de dados
     */
    let tipo = Number(formData.tipo);
    let modalidade = Number(formData.modalidade);
    let grupo = Number(formData.grupo);
    let executor = Number(formData.executor);
    let status = Number(formData.status);
    let dataInicio = formData.dataInicio.format("YYYY-MM-DD");
    let dataFim = formData.dataFim.format("YYYY-MM-DD");

    console.log(dataInicio);
    console.log(dataFim);

    const requestParams: AxiosRequestConfig = {
      url: `${
        isEditing
          ? `/treinamentos/atualizar/${urlParams.id}`
          : "/treinamentos/registrar"
      }`,
      method: `${isEditing ? "PUT" : "POST"}`,
      withCredentials: true,
      data: {
        sad: formData.sad,
        material: formData.material,
        treinamento: formData.treinamento,
        subsistema: formData.subsistema,
        tipo: tipo,
        modalidade: modalidade,
        grupo: grupo,
        executor: executor,
        dataInicio: dataInicio,
        dataFim: dataFim,
        om: formData.om,
        brigada: formData.brigada,
        instituicao: formData.instituicao,
        vagas: formData.vagas,
        status: status,
        avaliacaoPratica: formData.avaliacaoPratica === "1" ? true : false,
        avaliacaoTeorica: formData.avaliacaoTeorica === "1" ? true : false,
        nomeInstrutores: formData.nomeInstrutores,
        contatoInstrutores: formData.contatoInstrutores,
        certificado: formData.certificado === "1" ? true : false,
        logisticaTreinamento: formData.logisticaTreinamento,
        nivelamento: formData.nivelamento === "1" ? true : false,
        cargaHoraria: formData.cargaHoraria,
        publicoAlvo: formData.publicoAlvo === "1" ? true : false,
        descricaoAtividade: formData.descricaoAtividade,
        materialDidatico: formData.materialDidatico,
        observacoes: formData.observacoes,
        preRequisitos: formData.preRequisitos,
      },
    };

    requestBackend(requestParams)
      .then((res) => {
        toast.success("Treinamento registrado com sucesso.");

        navigate("/sgc/treinamento");
      })
      .catch((err) => {
        toast.error("Erro ao registrar o treinamento.");
      });
  };

  useEffect(() => {
    if (urlParams.id && urlParams.id !== "inserir") {
      setIsEditing(true);
    }
  }, [urlParams]);

  useEffect(() => {
    loadInfo();
  }, [loadInfo]);

  return (
    <div className="treinamento-container">
      <form onSubmit={handleSubmit(onSubmit)} className="treinamento-form">
        <div className="treinamento-content">
          <div className="treinamento-left">
            <div className="treinamento-input-group form-floating">
              <select
                id="sad"
                className={`form-select ${errors.sad ? "is-invalid" : ""}`}
                {...register("sad", {
                  required: "Campo obrigatório",
                })}
              >
                <option value="">Selecione uma opção</option>
                <option value="sad1">SAD1</option>
                <option value="sad2">SAD2</option>
                <option value="sad4">SAD4</option>
                <option value="sad7">SAD7</option>
              </select>
              <label htmlFor="sad">SAD</label>
              <div className="invalid-feedback d-block">
                {errors.sad?.message}
              </div>
            </div>
            <div className="treinamento-input-group form-floating">
              <input
                type="text"
                className={`form-control ${
                  errors.material ? "is-invalid" : ""
                }`}
                id="material"
                placeholder="Material"
                {...register("material", {
                  required: "Campo obrigatório",
                })}
              />
              <label htmlFor="material">Material</label>
              <div className="invalid-feedback d-block">
                {errors.material?.message}
              </div>
            </div>
            <div className="treinamento-input-group form-floating">
              <input
                type="text"
                className={`form-control ${
                  errors.treinamento ? "is-invalid" : ""
                }`}
                id="treinamento"
                placeholder="Treinamento"
                {...register("treinamento", {
                  required: "Campo obrigatório",
                })}
              />
              <label htmlFor="treinamento">Treinamento</label>
              <div className="invalid-feedback d-block">
                {errors.treinamento?.message}
              </div>
            </div>
            <div className="treinamento-input-group treinamento-radio-input-group">
              <span>Tipo</span>
              <div className="form-check">
                <input
                  type="radio"
                  className={`form-check-input ${
                    errors.tipo ? "is-invalid" : ""
                  }`}
                  value="1"
                  id="reciclagem"
                  {...register("tipo", { required: "Campo obrigatório" })}
                />
                <label htmlFor="reciclagem">Reciclagem</label>
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
                  id="nova-aquisicao"
                  {...register("tipo", { required: "Campo obrigatório" })}
                />
                <label htmlFor="nova-aquisicao">Nova Aquisição</label>
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
                  value="3"
                  id="atualizacao"
                  {...register("tipo", { required: "Campo obrigatório" })}
                />
                <label htmlFor="atualizacao">Atualização</label>
                <div className="invalid-feedback d-block">
                  {errors.tipo?.message}
                </div>
              </div>
            </div>
            <div className="treinamento-input-group form-floating">
              <select
                id="subsistema"
                className={`form-select ${
                  errors.subsistema ? "is-invalid" : ""
                }`}
                {...register("subsistema", {
                  required: "Campo obrigatório",
                })}
              >
                <option value="">Selecione uma opção</option>
                <option value="CC2">CC2</option>
                <option value="Com Área">Com Área</option>
                <option value="Com TAT">Com TAT</option>
                <option value="CSC">CSC</option>
                <option value="G&I">G&I</option>
                <option value="Infraestrutura">Infraestrutura</option>
                <option value="SLI">SLI</option>
              </select>
              <label htmlFor="subsistema">Subsistema</label>
              <div className="invalid-feedback d-block">
                {errors.subsistema?.message}
              </div>
            </div>
            <div className="treinamento-input-group treinamento-radio-input-group">
              <span>Modalidade</span>
              <div className="form-check">
                <input
                  type="radio"
                  className={`form-check-input ${
                    errors.modalidade ? "is-invalid" : ""
                  }`}
                  value="1"
                  id="presencial"
                  {...register("modalidade", { required: "Campo obrigatório" })}
                />
                <label htmlFor="presencial">Presencial</label>
                <div className="invalid-feedback d-block">
                  {errors.modalidade?.message}
                </div>
              </div>
              <div className="form-check">
                <input
                  type="radio"
                  className={`form-check-input ${
                    errors.modalidade ? "is-invalid" : ""
                  }`}
                  value="2"
                  id="ead"
                  {...register("modalidade", { required: "Campo obrigatório" })}
                />
                <label htmlFor="ead">EAD</label>
                <div className="invalid-feedback d-block">
                  {errors.modalidade?.message}
                </div>
              </div>
              <div className="form-check">
                <input
                  type="radio"
                  className={`form-check-input ${
                    errors.modalidade ? "is-invalid" : ""
                  }`}
                  value="3"
                  id="hibrido"
                  {...register("modalidade", { required: "Campo obrigatório" })}
                />
                <label htmlFor="hibrido">Híbrido</label>
                <div className="invalid-feedback d-block">
                  {errors.modalidade?.message}
                </div>
              </div>
            </div>
            <div className="treinamento-input-group form-floating">
              <input
                type="text"
                className={`form-control ${errors.brigada ? "is-invalid" : ""}`}
                id="brigada"
                placeholder="Brigada"
                {...register("brigada", {
                  required: "Campo obrigatório",
                })}
              />
              <label htmlFor="brigada">Brigada</label>
              <div className="invalid-feedback d-block">
                {errors.brigada?.message}
              </div>
            </div>
            <div className="treinamento-input-group form-floating">
              <input
                type="text"
                className={`form-control ${errors.om ? "is-invalid" : ""}`}
                id="om"
                placeholder="OM"
                {...register("om", {
                  required: "Campo obrigatório",
                })}
              />
              <label htmlFor="om">OM</label>
              <div className="invalid-feedback d-block">
                {errors.om?.message}
              </div>
            </div>
            <div className="treinamento-input-group treinamento-radio-input-group">
              <span>Grupo</span>
              <div className="form-check">
                <input
                  type="radio"
                  className={`form-check-input ${
                    errors.grupo ? "is-invalid" : ""
                  }`}
                  value="1"
                  id="grupo01"
                  {...register("grupo", { required: "Campo obrigatório" })}
                />
                <label htmlFor="grupo01">Grupo 01</label>
                <div className="invalid-feedback d-block">
                  {errors.grupo?.message}
                </div>
              </div>
              <div className="form-check">
                <input
                  type="radio"
                  className={`form-check-input ${
                    errors.grupo ? "is-invalid" : ""
                  }`}
                  value="2"
                  id="ead"
                  {...register("grupo", { required: "Campo obrigatório" })}
                />
                <label htmlFor="grupo02">Grupo 02</label>
                <div className="invalid-feedback d-block">
                  {errors.grupo?.message}
                </div>
              </div>
            </div>
            <div className="treinamento-input-group treinamento-radio-input-group">
              <span>Executor</span>
              <div className="form-check">
                <input
                  type="radio"
                  className={`form-check-input ${
                    errors.executor ? "is-invalid" : ""
                  }`}
                  value="1"
                  id="eb"
                  {...register("executor", { required: "Campo obrigatório" })}
                />
                <label htmlFor="eb">EB</label>
                <div className="invalid-feedback d-block">
                  {errors.executor?.message}
                </div>
              </div>
              <div className="form-check">
                <input
                  type="radio"
                  className={`form-check-input ${
                    errors.executor ? "is-invalid" : ""
                  }`}
                  value="2"
                  id="empresa"
                  {...register("executor", { required: "Campo obrigatório" })}
                />
                <label htmlFor="empresa">Empresa</label>
                <div className="invalid-feedback d-block">
                  {errors.executor?.message}
                </div>
              </div>
            </div>
            <div className="treinamento-input-group form-floating">
              <input
                type="text"
                className={`form-control ${
                  errors.instituicao ? "is-invalid" : ""
                }`}
                id="instituicao"
                placeholder="Instituição"
                {...register("instituicao", {
                  required: "Campo obrigatório",
                })}
              />
              <label htmlFor="instituicao">Instituição</label>
              <div className="invalid-feedback d-block">
                {errors.instituicao?.message}
              </div>
            </div>
            <div className="treinamento-input-group">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Controller
                  name="dataInicio"
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
                      label="Data início"
                      className="form-control"
                    />
                  )}
                />
              </LocalizationProvider>
              <div className="invalid-feedback d-block">
                {errors.dataInicio?.message}
              </div>
            </div>
            <div className="treinamento-input-group">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Controller
                  name="dataFim"
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
                      label="Data fim"
                      className="form-control"
                    />
                  )}
                />
              </LocalizationProvider>
              <div className="invalid-feedback d-block">
                {errors.dataFim?.message}
              </div>
            </div>
            <div className="treinamento-input-group form-floating">
              <input
                type="text"
                className={`form-control ${errors.vagas ? "is-invalid" : ""}`}
                id="vagas"
                placeholder="Vagas"
                {...register("vagas", {
                  required: "Campo obrigatório",
                })}
              />
              <label htmlFor="vagas">Vagas</label>
              <div className="invalid-feedback d-block">
                {errors.vagas?.message}
              </div>
            </div>
            <div className="treinamento-input-group form-floating">
              <select
                id="status"
                className={`form-select ${errors.status ? "is-invalid" : ""}`}
                {...register("status", {
                  required: "Campo obrigatório",
                })}
              >
                <option value="">Selecione uma opção</option>
                <option value="1">Prevista</option>
                <option value="2">Emergencial</option>
                <option value="3">Cancelada</option>
                <option value="4">Realizada</option>
                <option value="5">Adiada</option>
              </select>
              <label htmlFor="status">Status</label>
              <div className="invalid-feedback d-block">
                {errors.status?.message}
              </div>
            </div>
          </div>
          <div className="treinamento-right">
            <div className="treinamento-input-group treinamento-radio-input-group">
              <span>Avaliação prática?</span>
              <div className="form-check">
                <input
                  type="radio"
                  className={`form-check-input ${
                    errors.avaliacaoPratica ? "is-invalid" : ""
                  }`}
                  value="1"
                  id="ap-sim"
                  {...register("avaliacaoPratica", {
                    required: "Campo obrigatório",
                  })}
                />
                <label htmlFor="ap-sim">Sim</label>
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
                  id="ap-nao"
                  {...register("avaliacaoPratica", {
                    required: "Campo obrigatório",
                  })}
                />
                <label htmlFor="ap-nao">Não</label>
                <div className="invalid-feedback d-block">
                  {errors.avaliacaoPratica?.message}
                </div>
              </div>
            </div>
            <div className="treinamento-input-group treinamento-radio-input-group">
              <span>Avaliação teórica?</span>
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
                />
                <label htmlFor="at-nao">Não</label>
                <div className="invalid-feedback d-block">
                  {errors.avaliacaoTeorica?.message}
                </div>
              </div>
            </div>
            <div className="treinamento-input-group form-floating">
              <input
                type="text"
                className={`form-control ${
                  errors.nomeInstrutores ? "is-invalid" : ""
                }`}
                id="nome-instrutores"
                placeholder="Nome dos instrutores"
                {...register("nomeInstrutores", {
                  required: "Campo obrigatório",
                })}
              />
              <label htmlFor="nome-instrutores">Nome dos instrutores</label>
              <div className="invalid-feedback d-block">
                {errors.nomeInstrutores?.message}
              </div>
            </div>
            <div className="treinamento-input-group form-floating">
              <input
                type="text"
                className={`form-control ${
                  errors.contatoInstrutores ? "is-invalid" : ""
                }`}
                id="contato-instrutores"
                placeholder="Contato dos instrutores"
                {...register("contatoInstrutores")}
              />
              <label htmlFor="contato-instrutores">
                Contato dos instrutores
              </label>
            </div>
            <div className="treinamento-input-group treinamento-radio-input-group">
              <span>Certificado</span>
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
                />
                <label htmlFor="certificado-nao">Não</label>
                <div className="invalid-feedback d-block">
                  {errors.certificado?.message}
                </div>
              </div>
            </div>
            <div className="treinamento-input-group form-floating">
              <textarea
                className={`form-control ${
                  errors.logisticaTreinamento ? "is-invalid" : ""
                }`}
                id="logistica-treinamento"
                placeholder="Logística do treinamento"
                {...register("logisticaTreinamento", {
                  required: "Campo obrigatório",
                })}
                rows={10}
              />
              <label htmlFor="logistica-treinamento">
                Logística do treinamento
              </label>
              <div className="invalid-feedback d-block">
                {errors.logisticaTreinamento?.message}
              </div>
            </div>
            <div className="treinamento-input-group treinamento-radio-input-group">
              <span>Nivelamento</span>
              <div className="form-check">
                <input
                  type="radio"
                  className={`form-check-input ${
                    errors.nivelamento ? "is-invalid" : ""
                  }`}
                  value="1"
                  id="nivelamento-sim"
                  {...register("nivelamento", {
                    required: "Campo obrigatório",
                  })}
                />
                <label htmlFor="nivelamento-sim">Sim</label>
                <div className="invalid-feedback d-block">
                  {errors.nivelamento?.message}
                </div>
              </div>
              <div className="form-check">
                <input
                  type="radio"
                  className={`form-check-input ${
                    errors.nivelamento ? "is-invalid" : ""
                  }`}
                  value="0"
                  id="nivelamento-nao"
                  {...register("nivelamento", {
                    required: "Campo obrigatório",
                  })}
                />
                <label htmlFor="nivelamento-nao">Não</label>
                <div className="invalid-feedback d-block">
                  {errors.nivelamento?.message}
                </div>
              </div>
            </div>
            <div className="treinamento-input-group form-floating">
              <textarea
                className={`form-control ${
                  errors.preRequisitos ? "is-invalid" : ""
                }`}
                id="pre-requisitos"
                placeholder="Pré-requisitos"
                {...register("preRequisitos", {
                  required: "Campo obrigatório",
                })}
                rows={10}
              />
              <label htmlFor="pre-requisitos">Pré-requisitos</label>
              <div className="invalid-feedback d-block">
                {errors.preRequisitos?.message}
              </div>
            </div>
            <div className="treinamento-input-group form-floating">
              <input
                type="text"
                className={`form-control ${
                  errors.cargaHoraria ? "is-invalid" : ""
                }`}
                id="carga-horaria"
                placeholder="Carga horária"
                {...register("cargaHoraria")}
              />
              <label htmlFor="carga-horaria">Carga horária</label>
              <div className="invalid-feedback d-block">
                {errors.cargaHoraria?.message}
              </div>
            </div>
            <div className="treinamento-input-group treinamento-radio-input-group">
              <span>Público-alvo</span>
              <div className="form-check">
                <input
                  type="radio"
                  className={`form-check-input ${
                    errors.publicoAlvo ? "is-invalid" : ""
                  }`}
                  value="1"
                  id="publico-alvo-sim"
                  {...register("publicoAlvo", {
                    required: "Campo obrigatório",
                  })}
                />
                <label htmlFor="publico-alvo-sim">Sim</label>
                <div className="invalid-feedback d-block">
                  {errors.publicoAlvo?.message}
                </div>
              </div>
              <div className="form-check">
                <input
                  type="radio"
                  className={`form-check-input ${
                    errors.publicoAlvo ? "is-invalid" : ""
                  }`}
                  value="0"
                  id="publico-alvo-nao"
                  {...register("publicoAlvo", {
                    required: "Campo obrigatório",
                  })}
                />
                <label htmlFor="publico-alvo-nao">Não</label>
                <div className="invalid-feedback d-block">
                  {errors.publicoAlvo?.message}
                </div>
              </div>
            </div>
            <div className="treinamento-input-group form-floating">
              <textarea
                className={`form-control ${
                  errors.descricaoAtividade ? "is-invalid" : ""
                }`}
                id="descricao-atividade"
                placeholder="Descrição da atividade"
                {...register("descricaoAtividade", {
                  required: "Campo obrigatório",
                })}
                rows={10}
              />
              <label htmlFor="descricao-atividade">
                Descrição da atividade
              </label>
              <div className="invalid-feedback d-block">
                {errors.descricaoAtividade?.message}
              </div>
            </div>
            <div className="treinamento-input-group form-floating">
              <textarea
                className={`form-control ${
                  errors.materialDidatico ? "is-invalid" : ""
                }`}
                id="material-didatico"
                placeholder="Material didático"
                {...register("materialDidatico", {
                  required: "Campo obrigatório",
                })}
                rows={10}
              />
              <label htmlFor="material-didatico">Material didático</label>
              <div className="invalid-feedback d-block">
                {errors.materialDidatico?.message}
              </div>
            </div>
            <div className="treinamento-input-group form-floating">
              <textarea
                className={`form-control ${
                  errors.observacoes ? "is-invalid" : ""
                }`}
                id="observacoes"
                placeholder="Observações"
                {...register("observacoes")}
                rows={10}
              />
              <label htmlFor="observacoes">Observações</label>
            </div>
          </div>
        </div>
        <button className="button submit-button">Salvar</button>
      </form>
    </div>
  );
};

export default TreinamentoForm;
