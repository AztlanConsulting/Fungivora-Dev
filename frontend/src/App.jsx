import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./views/Login";
import Usuario from "./views/Usuario";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/usuario" element={<Usuario />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;