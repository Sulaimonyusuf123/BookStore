import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./Components/Auth";
import Navbar from "./Components/NavBar";
import Home from "./Components/Home";
import BookDetail from "./Components/BookDetails";
import AddEditBook from "./Components/AddEditBook";
import Login from "./Components/Login";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/book/:id" element={<BookDetail />} />
          <Route path="/add" element={<AddEditBook />} />
          <Route path="/edit/:id" element={<AddEditBook />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;