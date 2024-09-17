// Assuming you're using React Router v6
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App"; // Your main App component
import ViewThoughts from "./components/ViewThoughts";
import Navbar from "./components/Navbar";

function AppRouter() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/create" element={<App />} />
        <Route path="/" element={<ViewThoughts />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
