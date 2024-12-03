import "./styles.css";
import { Autocomplete, TextField } from "@mui/material";
import { AxiosRequestConfig } from "axios";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { AvaliacaoType } from "types/avaliacao";
import { TreinamentoType } from "types/treinamento";
import { formatarData, formatarModalidade } from "utils/functions";
import { requestBackend } from "utils/requests";

type FormData = {
  qualidadeMaterial: string;
  apostilaObjetiva: string;
  apostilaAtualizada: string;
  questoesRelacionadas: string;
  questoesClaras: string;
  avaliacaoGeralTreinamento: string;
  abrangeuTodosObjetivos: string;
  nomeResponsavel: string;
  funcaoResponsavel: string;
  comentariosSugestoes: string;
  treinamento: TreinamentoType | null;
};

type UrlParams = {
  id: string;
};

const AvaliacaoForm = () => {
  const {
    control,
    formState: { errors, isSubmitted },
    handleSubmit,
    register,
    setValue,
  } = useForm<FormData>();

  const [isEditing, setIsEditing] = useState(false);
  const [treinamento, setTreinamento] = useState<TreinamentoType>();
  const [notaSelecionada, setNotaSelecionada] = useState<number | null>(null);
  const [todosTreinamentos, setTodosTreinamentos] = useState<TreinamentoType[]>(
    []
  );

  const urlParams = useParams<UrlParams>();

  const onSubmit = (formData: FormData) => {
    const requestParams: AxiosRequestConfig = {
      url: `${
        isEditing
          ? `/avaliacoes/atualizar/${urlParams.id}`
          : "/avaliacoes/registrar"
      }`,
      method: isEditing ? "PUT" : "POST",
      withCredentials: true,
      data: {
        ...formData,
        treinamento: {
          ...formData.treinamento,
          modalidade: treinamento?.modalidade,
          dataInicio: treinamento?.dataInicio,
          dataFim: treinamento?.dataFim,
        },
      },
    };

    requestBackend(requestParams)
      .then((res) => {
        console.log(res.data);
        toast.success(
          `Sucesso ao ${isEditing ? "atualizar" : "registrar"} a avaliação`
        );
      })
      .catch((err) => {
        console.log(err);
        toast.error(
          `Erro ao ${isEditing ? "atualizar" : "registrar"} a avaliação`
        );
      });
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

  const handleSelectTreinamento = (value: TreinamentoType) => {
    setTreinamento(value);

    setValue("treinamento", value);
    setValue("treinamento.treinamento", value.treinamento);
    setValue("treinamento.id", value.id);
    setValue("treinamento.brigada", value.brigada);
    setValue("treinamento.dataInicio", formatarData(value.dataInicio));
    setValue("treinamento.dataFim", formatarData(value.dataFim));
    setValue(
      "treinamento.modalidade",
      formatarModalidade(value.modalidade as number)
    );
    setValue("treinamento.om.sigla", value.om.sigla);
    setValue("treinamento.om.cidadeestado", value.om.cidadeestado);
    setValue("treinamento.instrutores", value.instrutores);
  };

  const handleNotaClick = (nota: number) => {
    setNotaSelecionada(nota);
    setValue("avaliacaoGeralTreinamento", String(nota));
  };

  const loadInfo = useCallback(() => {
    if (isEditing) {
      const requestParams: AxiosRequestConfig = {
        url: `/avaliacoes/${urlParams.id}`,
        withCredentials: true,
        method: "GET",
      };

      requestBackend(requestParams)
        .then((res) => {
          let data = res.data as AvaliacaoType;

          setValue(
            "abrangeuTodosObjetivos",
            String(data.abrangeuTodosObjetivos)
          );
          setValue("apostilaAtualizada", String(data.apostilaAtualizada));
          setValue("apostilaObjetiva", String(data.apostilaObjetiva));
          setValue(
            "avaliacaoGeralTreinamento",
            String(data.avaliacaoGeralTreinamento)
          );
          setNotaSelecionada(data.avaliacaoGeralTreinamento);
          setValue("qualidadeMaterial", String(data.qualidadeMaterial));
          setValue("questoesClaras", String(data.questoesClaras));
          setValue("questoesRelacionadas", String(data.questoesRelacionadas));

          let treinamento = data.treinamento as TreinamentoType;
          setTreinamento(treinamento);
          setValue("treinamento", treinamento);
          setValue("treinamento.treinamento", treinamento.treinamento);
          setValue("treinamento.id", treinamento.id);
          setValue("treinamento.brigada", treinamento.brigada);
          setValue("treinamento.om.sigla", treinamento.om.sigla);
          setValue("treinamento.om.cidadeestado", treinamento.om.cidadeestado);
          setValue(
            "treinamento.modalidade",
            formatarModalidade(Number(treinamento.modalidade))
          );
          setValue(
            "treinamento.dataInicio",
            formatarData(treinamento.dataInicio)
          );
          setValue("treinamento.dataFim", formatarData(treinamento.dataFim));

          treinamento.instrutores.forEach((ins, index) => {
            setValue(
              `treinamento.instrutores.${index}.engajamento`,
              String(ins.engajamento)
            );
            setValue(
              `treinamento.instrutores.${index}.clareza`,
              String(ins.clareza)
            );
            setValue(
              `treinamento.instrutores.${index}.nivelConhecimento`,
              String(ins.nivelConhecimento)
            );
            setValue(
              `treinamento.instrutores.${index}.capacidadeResposta`,
              String(ins.capacidadeResposta)
            );
            setValue(
              `treinamento.instrutores.${index}.capacidadeGerirAula`,
              String(ins.capacidadeGerirAula)
            );
          });
        })
        .catch((err) => {
          toast.error("Erro ao carregar informações da avaliação.");
        });
    }
  }, [isEditing, urlParams.id, setValue]);

  useEffect(() => {
    if (urlParams.id && urlParams.id !== "inserir") {
      setIsEditing(true);
    }
  }, [urlParams]);

  useEffect(() => {
    loadInfo();

    if (!isEditing) {
      loadTreinamentos();
    }
  }, [isEditing, loadTreinamentos, loadInfo]);

  return (
    <div className="treinamento-container">
      <h3 className="form-title">Avaliação do Treinamento</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="treinamento-form">
        <div className="treinamento-content">
          <div className="treinamento-left">
            <h6 className="mt-3">
              <b>DADOS DO TREINAMENTO</b>
            </h6>
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
                    getOptionLabel={(opt) => opt.treinamento ? opt.treinamento : ""}
                    classes={{
                      inputRoot: `form-control input-element-root ${
                        isSubmitted && treinamento === undefined ? "invalido" : ""
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
                id="om-treinamento"
                placeholder="OM (Organização Militar)"
                {...register("treinamento.om.sigla")}
                disabled
              />
              <label htmlFor="om-treinamento">OM (Organização Militar)</label>
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
            <h6 className="mt-3">
              <b>DADOS DO RESPONSÁVEL PELA CONSOLIDAÇÃO DA AVALIAÇÃO</b>
            </h6>
            <div className="treinamento-input-group form-floating">
              <input
                type="text"
                className={`form-control ${
                  errors.nomeResponsavel ? "is-invalid" : ""
                }`}
                id="nome-responsavel"
                placeholder="Nome do responsável"
                {...register("nomeResponsavel", {
                  required: "Campo obrigatório",
                })}
              />
              <label htmlFor="nome-responsavel">Nome do responsável</label>
              <div className="invalid-feedback d-block">
                {errors.nomeResponsavel?.message}
              </div>
            </div>
            <div className="treinamento-input-group form-floating">
              <input
                type="text"
                className={`form-control ${
                  errors.funcaoResponsavel ? "is-invalid" : ""
                }`}
                id="funcao-responsavel"
                placeholder="Função do responsável"
                {...register("funcaoResponsavel", {
                  required: "Campo obrigatório",
                })}
              />
              <label htmlFor="funcao-responsavel">Função do responsável</label>
              <div className="invalid-feedback d-block">
                {errors.funcaoResponsavel?.message}
              </div>
            </div>
            <h6 className="mt-3">
              <b>MATERIAL DIDÁTICO</b>
            </h6>
            <div className="treinamento-input-group treinamento-radio-input-group">
              <span>
                Qualidade geral da apostila do treinamento?
                <span className="campo-obrigatorio">*</span>
              </span>
              {[1, 2, 3, 4, 5].map((valor) => (
                <div className="form-check" key={valor}>
                  <input
                    type="radio"
                    className={`form-check-input ${
                      errors.qualidadeMaterial ? "is-invalid" : ""
                    }`}
                    value={valor}
                    id={`qualidade-material-${valor}`}
                    {...register(`qualidadeMaterial`, {
                      required: "Campo obrigatório",
                    })}
                  />
                  <label htmlFor={`qualidade-material-${valor}`}>
                    {
                      [
                        "Insatisfatório",
                        "Regular",
                        "Bom",
                        "Muito bom",
                        "Excelente",
                      ][valor - 1]
                    }
                  </label>
                </div>
              ))}
              <div className="invalid-feedback d-block">
                {errors.qualidadeMaterial?.message}
              </div>
            </div>
            <div className="treinamento-input-group treinamento-radio-input-group">
              <span>
                Apostila estava objetiva e clara para entendimento?
                <span className="campo-obrigatorio">*</span>
              </span>
              {[1, 2, 3, 4, 5].map((valor) => (
                <div className="form-check" key={valor}>
                  <input
                    type="radio"
                    className={`form-check-input ${
                      errors.apostilaObjetiva ? "is-invalid" : ""
                    }`}
                    value={valor}
                    id={`apostila-objetiva-${valor}`}
                    {...register(`apostilaObjetiva`, {
                      required: "Campo obrigatório",
                    })}
                  />
                  <label htmlFor={`apostila-objetiva-${valor}`}>
                    {
                      [
                        "Insatisfatório",
                        "Regular",
                        "Bom",
                        "Muito bom",
                        "Excelente",
                      ][valor - 1]
                    }
                  </label>
                </div>
              ))}
              <div className="invalid-feedback d-block">
                {errors.apostilaObjetiva?.message}
              </div>
            </div>
            <div className="treinamento-input-group treinamento-radio-input-group">
              <span>
                Apostila estava atualizada e em sequência adequada?
                <span className="campo-obrigatorio">*</span>
              </span>
              {[1, 2, 3, 4, 5].map((valor) => (
                <div className="form-check" key={valor}>
                  <input
                    type="radio"
                    className={`form-check-input ${
                      errors.apostilaAtualizada ? "is-invalid" : ""
                    }`}
                    value={valor}
                    id={`apostila-atualizada-${valor}`}
                    {...register(`apostilaAtualizada`, {
                      required: "Campo obrigatório",
                    })}
                  />
                  <label htmlFor={`apostila-atualizada-${valor}`}>
                    {
                      [
                        "Insatisfatório",
                        "Regular",
                        "Bom",
                        "Muito bom",
                        "Excelente",
                      ][valor - 1]
                    }
                  </label>
                </div>
              ))}
              <div className="invalid-feedback d-block">
                {errors.apostilaAtualizada?.message}
              </div>
            </div>
            <h6 className="mt-3">
              <b>PROVA/AVALIAÇÃO</b>
            </h6>
            <div className="treinamento-input-group treinamento-radio-input-group">
              <span>
                Questões estavam relacionadas ao conteúdo ministrado em aula?
                <span className="campo-obrigatorio">*</span>
              </span>
              {[1, 2, 3, 4, 5].map((valor) => (
                <div className="form-check" key={valor}>
                  <input
                    type="radio"
                    className={`form-check-input ${
                      errors.questoesRelacionadas ? "is-invalid" : ""
                    }`}
                    value={valor}
                    id={`questoes-relacionadas-${valor}`}
                    {...register(`questoesRelacionadas`, {
                      required: "Campo obrigatório",
                    })}
                  />
                  <label htmlFor={`questoes-relacionadas-${valor}`}>
                    {
                      [
                        "Insatisfatório",
                        "Regular",
                        "Bom",
                        "Muito bom",
                        "Excelente",
                      ][valor - 1]
                    }
                  </label>
                </div>
              ))}
              <div className="invalid-feedback d-block">
                {errors.questoesRelacionadas?.message}
              </div>
            </div>
            <div className="treinamento-input-group treinamento-radio-input-group">
              <span>
                Questões estavam claras e abrangentes?
                <span className="campo-obrigatorio">*</span>
              </span>
              {[1, 2, 3, 4, 5].map((valor) => (
                <div className="form-check" key={valor}>
                  <input
                    type="radio"
                    className={`form-check-input ${
                      errors.questoesClaras ? "is-invalid" : ""
                    }`}
                    value={valor}
                    id={`questoes-claras-${valor}`}
                    {...register(`questoesClaras`, {
                      required: "Campo obrigatório",
                    })}
                  />
                  <label htmlFor={`questoes-claras-${valor}`}>
                    {
                      [
                        "Insatisfatório",
                        "Regular",
                        "Bom",
                        "Muito bom",
                        "Excelente",
                      ][valor - 1]
                    }
                  </label>
                </div>
              ))}
              <div className="invalid-feedback d-block">
                {errors.questoesClaras?.message}
              </div>
            </div>
          </div>
          <div className="treinamento-right">
            {treinamento && (
              <h6 className="mt-3">
                <b>INSTRUTORES</b>
              </h6>
            )}
            {treinamento &&
              treinamento.instrutores.map((ins, index) => (
                <>
                  <p>
                    <b>Instrutor:</b> {ins.nome}
                  </p>
                  <div className="treinamento-input-group treinamento-radio-input-group" key={"engajamento" + ins.nome}>
                    <span>
                      Engajamento:
                      <span className="campo-obrigatorio">*</span>
                    </span>
                    {[1, 2, 3, 4, 5].map((valor) => (
                      <div className="form-check" key={valor}>
                        <input
                          type="radio"
                          className={`form-check-input ${
                            errors?.treinamento?.instrutores?.[index]
                              ?.engajamento
                              ? "is-invalid"
                              : ""
                          }`}
                          value={valor}
                          id={`engajamento-${index}-${valor}`}
                          {...register(
                            `treinamento.instrutores.${index}.engajamento`,
                            {
                              required: "Campo obrigatório",
                            }
                          )}
                        />
                        <label htmlFor={`engajamento-${index}-${valor}`}>
                          {
                            [
                              "Insatisfatório",
                              "Regular",
                              "Bom",
                              "Muito bom",
                              "Excelente",
                            ][valor - 1]
                          }
                        </label>
                      </div>
                    ))}
                    <div className="invalid-feedback d-block">
                      {errors?.treinamento?.instrutores?.[index]?.engajamento?.message}
                    </div>
                  </div>
                  <div className="treinamento-input-group treinamento-radio-input-group" key={"clareza" + ins.nome}>
                    <span>
                      Claro e objetivo na apresentação do assunto:
                      <span className="campo-obrigatorio">*</span>
                    </span>
                    {[1, 2, 3, 4, 5].map((valor) => (
                      <div className="form-check" key={valor}>
                        <input
                          type="radio"
                          className={`form-check-input ${
                            errors?.treinamento?.instrutores?.[index]?.clareza
                              ? "is-invalid"
                              : ""
                          }`}
                          value={valor}
                          id={`clareza-${index}-${valor}`}
                          {...register(
                            `treinamento.instrutores.${index}.clareza`,
                            {
                              required: "Campo obrigatório",
                            }
                          )}
                        />
                        <label htmlFor={`clareza-${index}-${valor}`}>
                          {
                            [
                              "Insatisfatório",
                              "Regular",
                              "Bom",
                              "Muito bom",
                              "Excelente",
                            ][valor - 1]
                          }
                        </label>
                      </div>
                    ))}
                    <div className="invalid-feedback d-block">
                      {errors?.treinamento?.instrutores?.[index]?.clareza?.message}
                    </div>
                  </div>
                  <div className="treinamento-input-group treinamento-radio-input-group" key={"conhecimento" + ins.nome}>
                    <span>
                      Nível de conhecimento técnico:
                      <span className="campo-obrigatorio">*</span>
                    </span>
                    {[1, 2, 3, 4, 5].map((valor) => (
                      <div className="form-check" key={valor}>
                        <input
                          type="radio"
                          className={`form-check-input ${
                            errors?.treinamento?.instrutores?.[index]
                              ?.nivelConhecimento
                              ? "is-invalid"
                              : ""
                          }`}
                          value={valor}
                          id={`nivel-conhecimento-${index}-${valor}`}
                          {...register(
                            `treinamento.instrutores.${index}.nivelConhecimento`,
                            {
                              required: "Campo obrigatório",
                            }
                          )}
                        />
                        <label htmlFor={`nivel-conhecimento-${index}-${valor}`}>
                          {
                            [
                              "Insatisfatório",
                              "Regular",
                              "Bom",
                              "Muito bom",
                              "Excelente",
                            ][valor - 1]
                          }
                        </label>
                      </div>
                    ))}
                    <div className="invalid-feedback d-block">
                      {errors?.treinamento?.instrutores?.[index]?.nivelConhecimento?.message}
                    </div>
                  </div>
                  <div className="treinamento-input-group treinamento-radio-input-group" key={"capacidade-resposta" + ins.nome}>
                    <span>
                      Capacidade de responder a perguntas:
                      <span className="campo-obrigatorio">*</span>
                    </span>
                    {[1, 2, 3, 4, 5].map((valor) => (
                      <div className="form-check" key={valor}>
                        <input
                          type="radio"
                          className={`form-check-input ${
                            errors?.treinamento?.instrutores?.[index]
                              ?.capacidadeResposta
                              ? "is-invalid"
                              : ""
                          }`}
                          value={valor}
                          id={`capacidade-resposta-${index}-${valor}`}
                          {...register(
                            `treinamento.instrutores.${index}.capacidadeResposta`,
                            {
                              required: "Campo obrigatório",
                            }
                          )}
                        />
                        <label
                          htmlFor={`capacidade-resposta-${index}-${valor}`}
                        >
                          {
                            [
                              "Insatisfatório",
                              "Regular",
                              "Bom",
                              "Muito bom",
                              "Excelente",
                            ][valor - 1]
                          }
                        </label>
                      </div>
                    ))}
                    <div className="invalid-feedback d-block">
                      {errors?.treinamento?.instrutores?.[index]?.capacidadeResposta?.message}
                    </div>
                  </div>
                  <div className="treinamento-input-group treinamento-radio-input-group" key={"gerir-aula" + ins.nome}>
                    <span>
                      Capacidade de gerir a aula e o tempo:
                      <span className="campo-obrigatorio">*</span>
                    </span>
                    {[1, 2, 3, 4, 5].map((valor) => (
                      <div className="form-check" key={valor}>
                        <input
                          type="radio"
                          className={`form-check-input ${
                            errors?.treinamento?.instrutores?.[index]
                              ?.capacidadeGerirAula
                              ? "is-invalid"
                              : ""
                          }`}
                          value={valor}
                          id={`capacidade-gerir-aula-${index}-${valor}`}
                          {...register(
                            `treinamento.instrutores.${index}.capacidadeGerirAula`,
                            {
                              required: "Campo obrigatório",
                            }
                          )}
                        />
                        <label
                          htmlFor={`capacidade-gerir-aula-${index}-${valor}`}
                        >
                          {
                            [
                              "Insatisfatório",
                              "Regular",
                              "Bom",
                              "Muito bom",
                              "Excelente",
                            ][valor - 1]
                          }
                        </label>
                      </div>
                    ))}
                    <div className="invalid-feedback d-block">
                      {errors?.treinamento?.instrutores?.[index]?.capacidadeGerirAula?.message}
                    </div>
                  </div>
                </>
              ))}
            <h6 className="mt-3">
              <b>TREINAMENTO</b>
            </h6>
            <div className="treinamento-input-group treinamento-radio-input-group">
              <span>
                O curso abrangeu todos os objetivos propostos?
                <span className="campo-obrigatorio">*</span>
              </span>
              {[1, 2, 3, 4, 5].map((valor) => (
                <div className="form-check" key={valor}>
                  <input
                    type="radio"
                    className={`form-check-input ${
                      errors.abrangeuTodosObjetivos ? "is-invalid" : ""
                    }`}
                    value={valor}
                    id={`todos-objetivos-${valor}`}
                    {...register(`abrangeuTodosObjetivos`, {
                      required: "Campo obrigatório",
                    })}
                  />
                  <label htmlFor={`todos-objetivos-${valor}`}>
                    {
                      [
                        "Insatisfatório",
                        "Regular",
                        "Bom",
                        "Muito bom",
                        "Excelente",
                      ][valor - 1]
                    }
                  </label>
                </div>
              ))}
              <div className="invalid-feedback d-block">
                {errors.abrangeuTodosObjetivos?.message}
              </div>
            </div>
            <div className="treinamento-input-group">
              <label htmlFor="notas-grid">
                Em termos gerais, como avalia este treinamento?
              </label>
              <div id="notas-grid" className="notas-grid">
                {Array.from({ length: 11 }, (_, nota) => (
                  <button
                    type="button"
                    key={nota}
                    className={`nota-quadrado ${
                      notaSelecionada === nota ? "selecionada" : ""
                    } ${nota >= 0 && nota <= 4 ? "nota-ruim" : ""} ${
                      nota >= 5 && nota <= 7 ? "nota-mediana" : ""
                    } ${nota >= 8 && nota <= 10 ? "nota-boa" : ""}`}
                    onClick={() => handleNotaClick(nota)}
                  >
                    {nota}
                  </button>
                ))}
              </div>
              {notaSelecionada !== null && (
                <p className="nota-selecionada">
                  Nota selecionada: <strong>{notaSelecionada}</strong>
                </p>
              )}
              <input
                type="hidden"
                {...register("avaliacaoGeralTreinamento", {
                  required: "Selecione uma nota",
                })}
              />
              <div className="invalid-feedback d-block">
                {errors.avaliacaoGeralTreinamento?.message}
              </div>
            </div>
            <h6 className=" mt-3">
              <b>COMENTÁRIOS E SUGESTÕES</b>
            </h6>
            <div className="treinamento-input-group form-floating">
              <textarea
                className={`form-control ${
                  errors.comentariosSugestoes ? "is-invalid" : ""
                }`}
                id="obs-avaliacao-teorica"
                placeholder="Observações da Avaliação Teórica"
                {...register("comentariosSugestoes")}
                rows={10}
              />
              <label htmlFor="obs-avaliacao-teorica">
                Comentários e sugestões
              </label>
              <div className="invalid-feedback d-block">
                {errors.comentariosSugestoes?.message}
              </div>
            </div>
          </div>
        </div>
        <button className="button submit-button">Salvar</button>
      </form>
    </div>
  );
};

export default AvaliacaoForm;
