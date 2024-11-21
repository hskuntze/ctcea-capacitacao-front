import { Route, Routes } from "react-router-dom";
import Login from "./Login";

const Auth = () => {
  return (
    <section>
      <Routes>
        <Route path="" element={<Login />} />
      </Routes>
    </section>
  );
};

export default Auth;
