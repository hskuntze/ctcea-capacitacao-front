import { Controller, useFieldArray, useForm } from "react-hook-form";
import "./styles.css";

import { LocalizationProvider, MobileDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/pt-br"; 
import dayjs, { Dayjs } from "dayjs";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { AxiosRequestConfig } from "axios";
import { requestBackend } from "utils/requests";
import { toast } from "react-toastify";
import { TreinamentoType } from "types/treinamento";
import { OM } from "types/om";
import { Instrutor } from "types/instrutor";
import { MaterialDidatico } from "types/materialDidatico";
import { Turma } from "types/turma";
import { LogisticasTreinamento } from "types/logisticasTreinamento";

type FormData = {
  id: string;
  sad: string;
  material: string;
  treinamento: string;
  tipo: string;
  subsistema: string;
  modalidade: string;
  brigada: string;
  om: OM;
  turmas: Turma[];
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
  descNivelamento: string;
  cargaHoraria: number;
  publicoAlvo: string;
  descricaoAtividade: string;
  materialDidatico: File[];
  logisticaTreinamentos: File[];
  observacoes: string;
  preRequisitos: string;
  instrutores: Instrutor[];
};

const TreinamentoForm = () => {
  const [descNivelamento, setDescNivelamento] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [oms, setOms] = useState<OM[]>();
  const [bdas, setBdas] = useState<string[]>();
  const [materialFiles, setMaterialFiles] = useState<MaterialDidatico[]>([]);
  const [logisticaFiles, setLogisticaFiles] = useState<LogisticasTreinamento[]>(
    []
  );

  dayjs.locale("pt-br");

  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
    setValue,
    setError,
    clearErrors,
    watch,
  } = useForm<FormData>({
    defaultValues: {
      dataInicio: dayjs(),
      dataFim: dayjs().add(1, "day"),
      instrutores: isEditing ? [] : [{ nome: "", email: "", contato: "" }],
      turmas: isEditing ? [] : [{ nome: "" }],
    },
  });

  const {
    append: appendInstrutor,
    fields: instrutorFields,
    remove: removeInstrutor,
  } = useFieldArray({
    control,
    name: "instrutores",
  });

  const {
    append: appendTurma,
    fields: turmaFields,
    remove: removeTurma,
  } = useFieldArray({
    control,
    name: "turmas",
  });

  const diw = watch("dataInicio");
  const dfw = watch("dataFim");

  const urlParams = useParams();
  const navigate = useNavigate();

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

  const handleOpenDescNivelamento = () => {
    setDescNivelamento(true);
  };

  const handleCloseDescNivelamento = () => {
    setDescNivelamento(false);
  };

  const handleViewFile = (
    endpoint: string,
    fileId: number,
    fileName: string
  ) => {
    const requestParams: AxiosRequestConfig = {
      url: `/treinamentos/download/${endpoint}/${fileId}`,
      method: "GET",
      withCredentials: true,
      responseType: "blob",
      headers: {
        Accept: "*/*",
      },
    };

    requestBackend(requestParams)
      .then((res) => {
        const pdfBlob = new Blob([res.data], { type: "application/pdf" });
        const pdfUrl = URL.createObjectURL(pdfBlob);

        const link = document.createElement("a");
        link.href = pdfUrl;
        link.download = fileName;
        link.target = "_blank";
        link.click();

        URL.revokeObjectURL(pdfUrl);
      })
      .catch(() => {
        toast.error("Erro ao tentar resgatar o arquivo.");
      });
  };

  const handleFileDelete = (endpoint: string, fileId: number) => {
    const requestParams: AxiosRequestConfig = {
      url: `/treinamentos/deletar/${endpoint}/${fileId}`,
      method: "DELETE",
      withCredentials: true,
    };

    requestBackend(requestParams)
      .then(() => {
        toast.success("Arquivo deletado com sucesso.");
      })
      .catch(() => {
        toast.error("Erro ao deletar o arquivo.");
      });
  };

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

          setValue("instrutores", []);
          setValue("turmas", []);

          let treinamento = data.treinamento;

          if (data.treinamento.includes("Treinamento")) {
            treinamento = data.treinamento.replace("Treinamento ", "");
          }

          if (data.nivelamento === true) {
            setDescNivelamento(true);
          }

          setValue("id", String(data.id));
          setValue("sad", data.sad);
          setValue("tipo", String(data.tipo));
          setValue("material", data.material);
          setValue("treinamento", treinamento);
          setValue("subsistema", String(data.subsistema));
          setValue("modalidade", String(data.modalidade));
          setValue("brigada", String(data.brigada));
          setValue("om", data.om as OM);
          setValue("executor", String(data.executor));
          setValue("instituicao", data.instituicao);
          setValue("dataInicio", dayjs(data.dataInicio));
          setValue("dataFim", dayjs(data.dataFim));
          setValue("vagas", data.vagas);
          setValue("status", String(data.status));
          setValue(
            "avaliacaoPratica",
            data.avaliacaoPratica === true ? "1" : "0"
          );
          setValue(
            "avaliacaoTeorica",
            data.avaliacaoTeorica === true ? "1" : "0"
          );
          setValue("certificado", data.certificado === true ? "1" : "0");
          setValue("logisticaTreinamento", data.logisticaTreinamento);
          setValue("nivelamento", data.nivelamento === true ? "1" : "0");
          setValue("preRequisitos", data.preRequisitos);
          setValue("descNivelamento", data.descNivelamento);
          setValue("cargaHoraria", data.cargaHoraria);
          setValue("publicoAlvo", String(data.publicoAlvo));
          setValue("descricaoAtividade", data.descricaoAtividade);
          setValue("observacoes", data.observacoes);

          data.instrutores.forEach(() =>
            appendInstrutor({ contato: "", email: "", nome: "" })
          );
          data.instrutores.forEach((instrutor, index) => {
            setValue(`instrutores.${index}`, instrutor);
          });

          data.turmas.forEach(() => appendTurma({ nome: "" }));
          data.turmas.forEach((turma, index) => {
            setValue(`turmas.${index}`, turma);
          });

          let materialFiles: File[] = [];
          data.materiaisDidaticos.forEach((m) => {
            materialFiles.push(
              new File([m.fileContent], m.fileName, { type: "application/pdf" })
            );
          });

          setValue("materialDidatico", materialFiles);
          setMaterialFiles(data.materiaisDidaticos);

          let logisticaFiles: File[] = [];
          data.logisticaTreinamentos.forEach((l) => {
            logisticaFiles.push(
              new File([l.fileContent], l.fileName, { type: "application/pdf" })
            );
          });

          setValue("logisticaTreinamentos", logisticaFiles);
          setLogisticaFiles(data.logisticaTreinamentos);
        })
        .catch((err) => {
          if(err.response && err.response.data.message) {
            toast.error(err.response.data.message);
          } else {
            toast.error("Erro ao carregar informações do treinamento.");
          }
        });
    } else {
      const requestParams: AxiosRequestConfig = {
        url: `/treinamentos`,
        withCredentials: true,
        method: "GET",
      };

      requestBackend(requestParams)
        .then((res) => {
          let total = res.data.length + 1;
          setValue("id", total);
        })
        .catch(() => {
          toast.error("Erro ao resgatar o total de treinamentos.");
        });
    }
  }, [isEditing, urlParams.id, setValue, appendInstrutor, appendTurma]);

  const onSubmit = (formData: FormData) => {
    /**
     * Tratamento de dados
     */
    let tipo = Number(formData.tipo);
    let modalidade = Number(formData.modalidade);
    let executor = Number(formData.executor);
    let status = Number(formData.status);
    let dataInicio = formData.dataInicio.format("YYYY-MM-DD");
    let dataFim = formData.dataFim.format("YYYY-MM-DD");

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
        treinamento: "Treinamento " + formData.treinamento,
        subsistema: formData.subsistema,
        tipo: tipo,
        modalidade: modalidade,
        executor: executor,
        dataInicio: dataInicio,
        dataFim: dataFim,
        om: {
          codigo: formData.om.codigo,
        },
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
        publicoAlvo: formData.publicoAlvo,
        descricaoAtividade: formData.descricaoAtividade,
        materialDidatico: formData.materialDidatico,
        observacoes: formData.observacoes,
        preRequisitos: formData.preRequisitos,
        descNivelamento: formData.descNivelamento,
        instrutores: formData.instrutores,
        turmas: formData.turmas,
      },
    };

    requestBackend(requestParams)
      .then((res) => {
        let data = res.data as TreinamentoType;

        if (
          formData.materialDidatico instanceof FileList &&
          formData.materialDidatico.length > 0
        ) {
          const materialFilesArray = Array.from(formData.materialDidatico);

          materialFilesArray.forEach((m) => {
            const fd = new FormData();
            fd.append("file", m);
            fd.append("id", String(data.id));

            const requestUploadFile: AxiosRequestConfig = {
              url: `/treinamentos/upload/materialDidatico`,
              method: "POST",
              withCredentials: true,
              data: fd,
            };

            requestBackend(requestUploadFile)
              .then(() => {
                toast.success("Upload feito com sucesso.");
              })
              .catch(() => {
                toast.error("Erro ao realizar o upload do(s) arquivo(s).");
              });
          });
        }

        if (
          formData.logisticaTreinamentos instanceof FileList &&
          formData.logisticaTreinamentos.length > 0
        ) {
          const logisticaFilesArray = Array.from(
            formData.logisticaTreinamentos
          );

          logisticaFilesArray.forEach((l) => {
            const fd = new FormData();
            fd.append("file", l);
            fd.append("id", String(data.id));

            const requestUploadFile: AxiosRequestConfig = {
              url: `/treinamentos/upload/logisticaTreinamento`,
              method: "POST",
              withCredentials: true,
              data: fd,
            };

            requestBackend(requestUploadFile)
              .then(() => {
                toast.success("Upload feito com sucesso.");
              })
              .catch(() => {
                toast.error("Erro ao realizar o upload do(s) arquivo(s).");
              });
          });
        }

        toast.success(
          `Treinamento ${isEditing ? "atualizado" : "registrado"} com sucesso.`
        );
        navigate("/sgc/treinamento");
      })
      .catch((err) => {
        toast.error("Erro ao registrar o treinamento.");
      });
  };

  const validarDatas = (
    field: "dataInicio" | "dataFim",
    date: dayjs.Dayjs | null
  ) => {
    if (field === "dataInicio" && dfw && dayjs(date).isAfter(dayjs(dfw))) {
      setError("dataInicio", {
        message: "Data de início deve ser menor que a 'Data fim'",
      });
    } else if (field === "dataFim" && diw && dayjs(date).isBefore(dayjs(diw))) {
      setError("dataFim", {
        message: "Data fim deve ser maior que 'Data início'",
      });
    } else {
      clearErrors(field);
    }
  };

  useEffect(() => {
    if (urlParams.id && urlParams.id !== "inserir") {
      setIsEditing(true);
    }
  }, [urlParams]);

  useEffect(() => {
    loadInfo();
    loadOms();
    loadBdas();
  }, [loadInfo, loadOms, loadBdas]);

  return (
    <div className="treinamento-container">
      <h3 className="form-title">Treinamentos</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="treinamento-form">
        <div className="treinamento-content">
          <div className="treinamento-left">
            {/* SAD */}
            <div className="treinamento-input-group form-floating">
              <Controller
                name="sad"
                control={control}
                rules={{ required: "Campo obrigatório" }}
                render={({ field }) => (
                  <select
                    id="sad"
                    className={`form-select ${errors.sad ? "is-invalid" : ""}`}
                    {...field}
                  >
                    <option>Selecione uma opção</option>
                    <option value="sad1">SAD1</option>
                    <option value="sad2">SAD2</option>
                    <option value="sad3">SAD3</option>
                    <option value="sad3a">SAD3A</option>
                    <option value="sad7">SAD7</option>
                  </select>
                )}
              />
              <label htmlFor="sad">
                SAD <span className="campo-obrigatorio">*</span>
              </label>
              <div className="invalid-feedback d-block">
                {errors.sad?.message}
              </div>
            </div>
            {/* ID */}
            <div className="treinamento-input-group form-floating">
              <input
                type="text"
                className={`form-control`}
                id="id-treinamento"
                placeholder="ID do treinamento"
                {...register("id")}
                disabled
              />
              <label htmlFor="id-treinamento">ID do curso</label>
            </div>
            {/* Treinamento */}
            <div className="treinamento-input-group form-floating">
              <input
                type="text"
                className={`form-control input-element-treinamento ${
                  errors.treinamento ? "is-invalid" : ""
                }`}
                id="treinamento"
                placeholder="Treinamento"
                {...register("treinamento", {
                  required: "Campo obrigatório",
                })}
              />
              <div className="input-inside-label">Treinamento</div>
              <div className="invalid-feedback d-block">
                {errors.treinamento?.message}
              </div>
            </div>
            {/* Emergencial/previsto (tipo) */}
            <div className="treinamento-input-group treinamento-radio-input-group">
              <span>
                Emergencial/previsto<span className="campo-obrigatorio">*</span>
              </span>
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
            {/* Material/equipamento (material) */}
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
              <label htmlFor="material">
                Material/equipamento<span className="campo-obrigatorio">*</span>
              </label>
              <div className="invalid-feedback d-block">
                {errors.material?.message}
              </div>
            </div>
            {/* Status */}
            <div className="treinamento-input-group form-floating">
              <Controller
                name="status"
                control={control}
                rules={{ required: "Campo obrigatório" }}
                render={({ field }) => (
                  <select
                    id="status"
                    className={`form-select ${
                      errors.status ? "is-invalid" : ""
                    }`}
                    {...field}
                  >
                    <option>Selecione uma opção</option>
                    <option value="1">Cancelada</option>
                    <option value="2">Realizada</option>
                    <option value="3">Adiada</option>
                  </select>
                )}
              />
              <label htmlFor="status">
                Status<span className="campo-obrigatorio">*</span>
              </label>
              <div className="invalid-feedback d-block">
                {errors.status?.message}
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
                    className={`form-select ${errors.om ? "is-invalid" : ""}`}
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
            {/* Turmas */}
            <div className="treinamento-input-group">
              {turmaFields.map((field, index) => (
                <div key={field.nome}>
                  <h6>
                    <b>Turma</b>
                  </h6>
                  <div className="turma-row">
                    <div className="input-turma-group form-floating">
                      <input
                        className={`form-control ${
                          errors.turmas?.[index]?.nome ? "is-invalid" : ""
                        }`}
                        {...register(`turmas.${index}.nome`, {
                          required: "Nome da turma obrigatório",
                        })}
                        placeholder="Nome da turma"
                      />
                      <label>Nome da turma</label>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (turmaFields.length > 1) {
                          removeTurma(index);
                        }
                      }}
                      disabled={turmaFields.length <= 1}
                      className="round-button delete-button"
                    >
                      <i className="bi bi-x-lg" />
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => appendTurma({ nome: "" })}
                className="round-button create-button add-turma-button"
              >
                <i className="bi bi-plus-lg" />
              </button>
            </div>
            {/* Conjunto (subsistema) */}
            <div className="treinamento-input-group form-floating">
              <Controller
                name="subsistema"
                control={control}
                rules={{ required: "Campo obrigatório" }}
                render={({ field }) => (
                  <select
                    id="subsistema"
                    className={`form-select ${
                      errors.subsistema ? "is-invalid" : ""
                    }`}
                    {...field}
                  >
                    <option>Selecione uma opção</option>
                    <option value="CC2">CC2</option>
                    <option value="Com Área">Com Área</option>
                    <option value="Com TAT">Com TAT</option>
                    <option value="CSC">CSC</option>
                    <option value="G&I">G&I</option>
                    <option value="Infraestrutura">Infraestrutura</option>
                    <option value="SLI">SLI</option>
                  </select>
                )}
              />
              <label htmlFor="subsistema">
                Conjunto<span className="campo-obrigatorio">*</span>
              </label>
              <div className="invalid-feedback d-block">
                {errors.subsistema?.message}
              </div>
            </div>
            {/* Modalidade */}
            <div className="treinamento-input-group treinamento-radio-input-group">
              <span>
                Modalidade<span className="campo-obrigatorio">*</span>
              </span>
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
            {/* Executor */}
            <div className="treinamento-input-group treinamento-radio-input-group">
              <span>
                Executor<span className="campo-obrigatorio">*</span>
              </span>
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
            {/* Instituição */}
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
              <label htmlFor="instituicao">
                Instituição<span className="campo-obrigatorio">*</span>
              </label>
              <div className="invalid-feedback d-block">
                {errors.instituicao?.message}
              </div>
            </div>
            {/* Data início */}
            <div className="treinamento-input-group">
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
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
                      onChange={(date) => {
                        field.onChange(date);
                        validarDatas("dataInicio", date);
                      }}
                      value={dayjs(field.value)}
                      label={`Data início`}
                      className="form-control"
                    />
                  )}
                />
              </LocalizationProvider>
              <div className="invalid-feedback d-block">
                {errors.dataInicio?.message}
              </div>
            </div>
            {/* Data fim */}
            <div className="treinamento-input-group">
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
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
                      onChange={(date) => {
                        field.onChange(date);
                        validarDatas("dataFim", date);
                      }}
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
            {/* Vagas */}
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
              <label htmlFor="vagas">
                Vagas<span className="campo-obrigatorio">*</span>
              </label>
              <div className="invalid-feedback d-block">
                {errors.vagas?.message}
              </div>
            </div>
            {/* Descrição atividade */}
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
                <span className="campo-obrigatorio">*</span>
              </label>
              <div className="invalid-feedback d-block">
                {errors.descricaoAtividade?.message}
              </div>
            </div>
          </div>
          {/* Público-alvo */}
          <div className="treinamento-right">
            <div className="treinamento-input-group treinamento-radio-input-group">
              <span>
                Público-alvo<span className="campo-obrigatorio">*</span>
              </span>
              <div className="form-check">
                <input
                  type="radio"
                  className={`form-check-input ${
                    errors.publicoAlvo ? "is-invalid" : ""
                  }`}
                  value="1"
                  id="publico-alvo-militar"
                  {...register("publicoAlvo", {
                    required: "Campo obrigatório",
                  })}
                />
                <label htmlFor="publico-alvo-militar">Militar</label>
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
                  value="2"
                  id="publico-alvo-civil"
                  {...register("publicoAlvo", {
                    required: "Campo obrigatório",
                  })}
                />
                <label htmlFor="publico-alvo-civil">Civil</label>
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
                  value="3"
                  id="publico-alvo-misto"
                  {...register("publicoAlvo", {
                    required: "Campo obrigatório",
                  })}
                />
                <label htmlFor="publico-alvo-misto">Misto</label>
                <div className="invalid-feedback d-block">
                  {errors.publicoAlvo?.message}
                </div>
              </div>
            </div>
            {/* Carga horária */}
            <div className="treinamento-input-group form-floating">
              <input
                type="text"
                className={`form-control ${
                  errors.cargaHoraria ? "is-invalid" : ""
                }`}
                id="carga-horaria"
                placeholder="Carga horária"
                {...register("cargaHoraria", {
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "Apenas números são permitidos",
                  },
                })}
              />
              <label htmlFor="carga-horaria">
                Carga horária<span className="campo-obrigatorio">*</span>
              </label>
              <div className="invalid-feedback d-block">
                {errors.cargaHoraria?.message}
              </div>
            </div>
            {/* Pré-requisitos */}
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
              <label htmlFor="pre-requisitos">
                Pré-requisitos<span className="campo-obrigatorio">*</span>
              </label>
              <div className="invalid-feedback d-block">
                {errors.preRequisitos?.message}
              </div>
            </div>
            {/* Nivelamento */}
            <div className="treinamento-input-group treinamento-radio-input-group">
              <span>
                Será necessário nivelamento do instruendo?
                <span className="campo-obrigatorio">*</span>
              </span>
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
                  onClick={handleOpenDescNivelamento}
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
                  onClick={handleCloseDescNivelamento}
                />
                <label htmlFor="nivelamento-nao">Não</label>
                <div className="invalid-feedback d-block">
                  {errors.nivelamento?.message}
                </div>
              </div>
            </div>
            {/* Descrição do nivelamento/curso de nivelamento */}
            {descNivelamento && (
              <div className="treinamento-input-group form-floating">
                <input
                  type="text"
                  className={`form-control ${
                    errors.descNivelamento ? "is-invalid" : ""
                  }`}
                  id="desc-nivelamento"
                  placeholder="Nome do treinamento"
                  {...register("descNivelamento", {
                    required: "Campo obrigatório",
                  })}
                />
                <label htmlFor="desc-nivelamento">
                  Nome do treinamento
                  <span className="campo-obrigatorio">*</span>
                </label>
                <div className="invalid-feedback d-block">
                  {errors.descNivelamento?.message}
                </div>
              </div>
            )}
            {/* Logística de treinamento */}
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
                <span className="campo-obrigatorio">*</span>
              </label>
              <div className="invalid-feedback d-block">
                {errors.logisticaTreinamento?.message}
              </div>
            </div>
            {/* Logistica de treinamento (arquivos) */}
            <div className="treinamento-input-group input-group">
              <label className="input-group-text" htmlFor="material-didatico">
                Logística de treinamento
                <span className="campo-obrigatorio arquivo-obrigatorio">*</span>
              </label>
              <input
                type="file"
                className={`form-control ${
                  errors.logisticaTreinamentos ? "is-invalid" : ""
                }`}
                id="material-didatico"
                {...register("logisticaTreinamentos", {
                  required:
                    logisticaFiles.length === 0 ? "Campo obrigatório" : false,
                })}
                accept="application/pdf"
                multiple
              />
              <div className="invalid-feedback d-block">
                {errors.logisticaTreinamentos?.message}
              </div>
              {logisticaFiles.length > 0 && (
                <ul className="lista-arquivos">
                  {logisticaFiles.map((file, index) => (
                    <li key={file.id}>
                      <span>{file.fileName}</span>
                      <button
                        type="button"
                        className="round-button submit-button"
                        onClick={() =>
                          handleViewFile(
                            "logisticaTreinamento",
                            file.id,
                            file.fileName
                          )
                        }
                      >
                        <i className="bi bi-eye" />
                      </button>
                      <button
                        type="button"
                        className="round-button delete-button"
                        onClick={() =>
                          handleFileDelete("logisticaTreinamento", file.id)
                        }
                      >
                        <i className="bi bi-x-lg" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {/* Material didático */}
            <div className="treinamento-input-group input-group">
              <label className="input-group-text" htmlFor="material-didatico">
                Material didático<span className="campo-obrigatorio arquivo-obrigatorio">*</span>
              </label>
              <input
                type="file"
                className={`form-control ${
                  errors.materialDidatico ? "is-invalid" : ""
                }`}
                id="material-didatico"
                {...register("materialDidatico", {
                  required:
                    materialFiles.length === 0 ? "Campo obrigatório" : false,
                })}
                accept="application/pdf"
                multiple
              />
              <div className="invalid-feedback d-block">
                {errors.materialDidatico?.message}
              </div>
              {materialFiles.length > 0 && (
                <ul className="lista-arquivos">
                  {materialFiles.map((file, index) => (
                    <li>
                      <span>{file.fileName}</span>
                      <button
                        type="button"
                        className="round-button submit-button"
                        onClick={() =>
                          handleViewFile(
                            "materialDidatico",
                            file.id,
                            file.fileName
                          )
                        }
                      >
                        <i className="bi bi-eye" />
                      </button>
                      <button
                        type="button"
                        className="round-button delete-button"
                        onClick={() =>
                          handleFileDelete("materialDidatico", file.id)
                        }
                      >
                        <i className="bi bi-x-lg" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
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
            {/* Contato do instrutor */}
            <div className="treinamento-input-group">
              {instrutorFields.map((field, index) => (
                <div key={field.id}>
                  <h6>
                    <b>Instrutor {index + 1}</b>
                  </h6>
                  <div className="input-instrutor-group form-floating">
                    <input
                      className={`form-control ${
                        errors.instrutores?.[index]?.nome ? "is-invalid" : ""
                      }`}
                      {...register(`instrutores.${index}.nome`, {
                        required: "Nome obrigatório",
                      })}
                      placeholder="Nome"
                    />
                    <label>Nome</label>
                  </div>
                  <div className="input-instrutor-group form-floating">
                    <input
                      type="email"
                      className={`form-control ${
                        errors.instrutores?.[index]?.email ? "is-invalid" : ""
                      }`}
                      {...register(`instrutores.${index}.email`, {
                        required: "Email obrigatório",
                      })}
                      placeholder="Email"
                    />
                    <label>Email</label>
                  </div>
                  <div className="input-instrutor-group form-floating">
                    <input
                      className={`form-control ${
                        errors.instrutores?.[index]?.contato ? "is-invalid" : ""
                      }`}
                      {...register(`instrutores.${index}.contato`, {
                        required: "Contato obrigatório",
                      })}
                      placeholder="Contato"
                    />
                    <label>Contato</label>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (instrutorFields.length > 1) {
                        removeInstrutor(index); // Remove o conjunto
                      }
                    }}
                    disabled={instrutorFields.length <= 1} // Evita remover o último conjunto
                    className="round-button delete-button"
                  >
                    <i className="bi bi-x-lg" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={
                  () => appendInstrutor({ nome: "", email: "", contato: "" }) // Adiciona novo conjunto
                }
                className="round-button create-button add-instrutor-button"
              >
                <i className="bi bi-plus-lg" />
              </button>
            </div>
            {/* Observações */}
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
        <div className="form-buttons">
          <button type="submit" className="button submit-button">Salvar</button>
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

export default TreinamentoForm;
