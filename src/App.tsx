import { Route, Routes } from "react-router-dom";
import Detail from "./routes/Detail";
import Main from "./routes/Main";
import Post from "./routes/Post";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/post" element={<Post />} />
      <Route path="/:id" element={<Detail />} />
    </Routes>
  );
}

export default App;
