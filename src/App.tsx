import { Route, Routes } from "react-router-dom";
import Detail from "./routes/Detail";
import Main from "./routes/Main";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/:id" element={<Detail />} />
    </Routes>
  );
}

export default App;
