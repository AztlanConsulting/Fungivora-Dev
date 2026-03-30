import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./views/Login";
import User from "./views/User";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/user" element={<User />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;