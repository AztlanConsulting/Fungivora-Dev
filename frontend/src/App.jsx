import { BrowserRouter, Routes, Route } from "react-router-dom";
import First_Page from "./views/First_Page";
import Usuario from "./views/Usuario";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/first" element={<First_Page />} />
        <Route path="/usuario" element={<Usuario />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;