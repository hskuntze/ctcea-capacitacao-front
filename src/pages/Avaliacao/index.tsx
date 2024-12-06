import AvaliacaoForm from "./Form";
import AvaliacaoInspect from "./Inspect";
import AvaliacaoList from "./List";
import "./styles.css";
import { Route, Routes } from "react-router-dom";

const Avaliacao = () => {
  return (
    <>
      <Routes>
        <Route path="" element={<AvaliacaoList />} />
        <Route path=":id" element={<AvaliacaoForm />} />
        <Route path="/visualizar/:id" element={<AvaliacaoInspect />} />
      </Routes>
    </>
  );
};

export default Avaliacao;
