import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../Components/Auth";
import axios from "axios";


const API_BASE_URL = "https://bookstore-api-hvgt.onrender.com/api/books";
const api = axios.create({
  baseURL: API_BASE_URL,
  // Explicitly disable credentials
});

// Modal component for delete confirmation
const DeleteConfirmModal = ({ isOpen, book, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-fade-in">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Confirm Delete</h3>
        <p className="text-gray-600">
          Are you sure you want to delete <span className="font-semibold">"{book?.title}"</span>?
          This action cannot be undone.
        </p>
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// Toast notification component with improved mobile responsiveness
const Toast = ({ message, type, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const bgColor = type === 'success' ? 'bg-blue-500' :
    type === 'error' ? 'bg-blue-500' : 'bg-blue-500';

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-auto md:max-w-md z-50 animate-fade-in-up">
      <div className={`${bgColor} text-white px-4 py-3 md:px-6 rounded-lg shadow-lg flex items-center justify-between`}>
        <div className="flex items-center space-x-2 flex-1 mr-2">
          {type === 'success' && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          )}
          {type === 'error' && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          )}
          <span className="text-sm md:text-base break-words">{message}</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white hover:bg-opacity-20 rounded-full flex-shrink-0"
          aria-label="Close notification"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

const BookCard = ({ book, onDelete }) => {
  const { user } = useAuth();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = async () => {
    try {
      await api.delete(`/${book._id}`, { withCredentials: false });
      onDelete(book._id);
    } catch (error) {
      alert(`Failed to delete book: ${error.response?.data?.message || error.message}`);
    } finally {
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="bg-white p-4 md:p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 h-full flex flex-col">
      <Link to={`/book/${book._id}`} className="flex-1">
        <div className="h-24 w-16 bg-blue-100 rounded float-right ml-3 mb-2 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-1 line-clamp-2">{book.title}</h3>
        <p className="text-gray-600 text-sm md:text-base mb-2">by <span className="font-medium">{book.author}</span></p>
        <p className="text-green-600 font-bold text-lg md:text-xl mb-3">${book.price}</p>
        <p className="text-gray-500 text-sm md:text-base mt-2 line-clamp-3">{book.description}</p>
      </Link>
      {user?.role === "admin" && (
        <div className="mt-4 pt-4 border-t border-gray-100 flex space-x-2">
          <Link
            to={`/edit/${book._id}`}
            className="px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors flex-1 text-center font-medium text-sm"
          >
            Edit
          </Link>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex-1 font-medium text-sm"
          >
            Delete
          </button>
        </div>
      )}

      <DeleteConfirmModal
        isOpen={showDeleteConfirm}
        book={book}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

const Home = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" });

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {

    if (location.state?.editSuccess) {
      setToast({
        visible: true,
        message: location.state.message || "Book updated successfully!",
        type: "success"
      });


      navigate(location.pathname, { replace: true });
    } else if (location.state?.addSuccess) {
      setToast({
        visible: true,
        message: location.state.message || "Book added successfully!",
        type: "success"
      });


      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await api.get("/", { withCredentials: false });

        if (response.data && response.data.success) {
          setBooks(response.data.data);
          setFilteredBooks(response.data.data);
        } else {
          setError("Unexpected response format from server");
        }
      } catch (error) {
        setError(`Failed to load books: ${error.response?.data?.message || error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  useEffect(() => {

    if (searchTerm.trim() === "") {
      setFilteredBooks(books);
      return;
    }

    const search = searchTerm.toLowerCase();
    const filtered = books.filter(book =>
      book.title.toLowerCase().includes(search) ||
      book.author.toLowerCase().includes(search) ||

      book.price.toString().includes(search) ||

      (book.description && book.description.toLowerCase().includes(search))
    );

    setFilteredBooks(filtered);
  }, [searchTerm, books]);

  const handleDelete = (id) => {
    setBooks(books.filter((book) => book._id !== id));
    setFilteredBooks(filteredBooks.filter((book) => book._id !== id));
    setToast({
      visible: true,
      message: "Book deleted successfully!",
      type: "success"
    });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  const closeToast = () => {
    setToast({ ...toast, visible: false });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Book Collection</h1>

        {user?.role === "admin" && (
          <Link
            to="/add"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center space-x-2 text-sm sm:text-base"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            <span>Add Book</span>
          </Link>
        )}
      </div>


      <div className={`mb-8 relative transition-all duration-200 ${isSearchFocused ? 'scale-105' : ''}`}>
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            placeholder="Search books by title, author, or price..."
            className="w-full p-3 sm:p-4 pl-12 pr-10 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          />
          <div className="absolute left-3 sm:left-4 top-3 sm:top-4">
            <svg
              className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {searchTerm && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 sm:right-4 top-3 sm:top-4 text-gray-400 hover:text-gray-600 bg-white rounded-full p-0.5 hover:bg-gray-100 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>


        {filteredBooks.length > 0 && books.length > filteredBooks.length && (
          <div className="mt-2 text-sm text-gray-500 pl-12">
            Found {filteredBooks.length} book{filteredBooks.length !== 1 ? 's' : ''} matching your search
          </div>
        )}
      </div>


      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-center p-8 bg-red-50 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-600 font-medium text-lg">{error}</p>
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded-lg shadow-sm border border-gray-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-600 font-medium text-lg mb-3">No books found matching "{searchTerm}"</p>
          <button
            onClick={handleClearSearch}
            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-medium"
          >
            View all books
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {filteredBooks.map((book) => (
            <BookCard key={book._id} book={book} onDelete={handleDelete} />
          ))}
        </div>
      )}


      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.visible}
        onClose={closeToast}
      />
    </div>
  );
};

export default Home;