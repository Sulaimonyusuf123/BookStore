import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../Components/Auth"; // Adjust path if needed
import axios from "axios";

// Configure axios with base URL and default headers
const API_BASE_URL = "http://localhost:3009/api/books"; // Replace with your actual backend port
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method.toUpperCase()} request to: ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log("Response received:", response.status);
    return response;
  },
  (error) => {
    console.error("Response error:", error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

const BookCard = ({ book, onDelete }) => {
  const { user } = useAuth();
  
  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${book.title}"?`)) {
      try {
        // Using the direct route without "/books" prefix
        await api.delete(`/${book._id}`);
        onDelete(book._id);
        alert("Book deleted successfully!");
      } catch (error) {
        console.error("Error deleting book:", error);
        alert(`Failed to delete book: ${error.response?.data?.message || error.message}`);
      }
    }
  };
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <Link to={`/book/${book._id}`}>
        <h3 className="text-lg font-semibold">{book.title}</h3>
        <p className="text-gray-600">by {book.author}</p>
        <p className="text-green-600 font-bold">${book.price}</p>
        <p className="text-gray-500 mt-2 line-clamp-2">{book.description}</p>
      </Link>
      {user?.role === "admin" && (
        <div className="mt-4 flex space-x-2">
          <Link
            to={`/edit/${book._id}`}
            className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

const Home = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        console.log("Fetching books...");
        // Using the direct route without "/books" prefix
        const response = await api.get("/");
        console.log("Books response:", response.data);
        
        if (response.data && response.data.success) {
          setBooks(response.data.data);
        } else {
          setError("Unexpected response format from server");
        }
      } catch (error) {
        console.error("Error fetching books:", error);
        setError(`Failed to load books: ${error.response?.data?.message || error.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBooks();
  }, []);
  
  const handleDelete = (id) => {
    setBooks(books.filter((book) => book._id !== id));
  };
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Book Collection</h1>
        {user?.role === "admin" && (
          <Link
            to="/add"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Add Book
          </Link>
        )}
      </div>
      
      {loading ? (
        <div className="text-center">Loading books...</div>
      ) : error ? (
        <div className="text-center text-red-600">{error}</div>
      ) : books.length === 0 ? (
        <div className="text-center">No books found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <BookCard key={book._id} book={book} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;