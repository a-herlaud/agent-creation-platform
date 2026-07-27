// App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CreatePrompt from "./pages/CreatePrompt";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/prompts/new" element={<CreatePrompt />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;