import AvaliacaoForm from "./Form";
import AvaliacaoList from "./List";
import "./styles.css";
import { Route, Routes } from "react-router-dom";

const Avaliacao = () => {
  return (
    <>
      <Routes>
        <Route path="" element={<AvaliacaoList />} />
        <Route path=":id" element={<AvaliacaoForm />} />
      </Routes>
    </>
  );
};

export default Avaliacao;
