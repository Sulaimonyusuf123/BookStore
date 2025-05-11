import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, BookOpen, ShoppingCart, X, Edit, Trash, Plus, Quote } from 'lucide-react';

import AOS from 'aos';
import 'aos/dist/aos.css';
import { useAuth } from "../Components/Auth";
import axios from "axios";

const API_BASE_URL = "https://bookstore-api-hvgt.onrender.com/api/books";
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false
});


const DeleteConfirmModal = ({ isOpen, book, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
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
    type === 'error' ? 'bg-red-500' : 'bg-blue-500';

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
          <X size={16} />
        </button>
      </div>
    </div>
  );
};


const BookCard = ({ book, onDelete, setSelectedBook, isAdmin }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = async () => {
    try {
      await api.delete(`/${book._id}`);
      onDelete(book._id);
    } catch (error) {
      alert(`Failed to delete book: ${error.response?.data?.message || error.message}`);
    } finally {
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl border border-gray-200 transition-all duration-300 transform hover:-translate-y-1">
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-indigo-600 transition-colors">
          <div onClick={() => setSelectedBook(book)} className="cursor-pointer">{book.title}</div>
        </h3>
        <p className="text-gray-600 text-sm mb-3 font-medium">{book.author}</p>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2">{book.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-indigo-600 font-extrabold text-lg">${book.price.toFixed(2)}</span>
          <div className="flex space-x-3">
            {isAdmin && (
              <>
                <Link
                  to={`/edit/${book._id}`}
                  className="p-2 text-gray-500 hover:text-indigo-600 transition-colors duration-300"
                >
                  <Edit size={20} />
                </Link>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="p-2 text-gray-500 hover:text-red-600 transition-colors duration-300"
                >
                  <Trash size={20} />
                </button>
              </>
            )}
            {!isAdmin && (
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-300">
                Add to Cart
              </button>
            )}
          </div>
        </div>
      </div>
      <DeleteConfirmModal
        isOpen={showDeleteConfirm}
        book={book}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};


const testimonials = [
  {
    id: 1,
    quote: "Pageturner Books has an incredible selection! I found rare classics and new releases at great prices.",
    name: "Emily Johnson"
  },
  {
    id: 2,
    quote: "The user-friendly site and fast delivery make this my go-to bookstore. Highly recommend!",
    name: "Michael Chen"
  },
  {
    id: 3,
    quote: "I love the curated recommendations and vibrant community. Every book feels like a new adventure!",
    name: "Sarah Patel"
  }
];

export default function Home() {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" });
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const isAdmin = user?.role === "admin";
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

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
        const response = await api.get("/");
        if (response.data && response.data.success) {
          setBooks(response.data.data);
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

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.price.toString().includes(searchTerm.toLowerCase()) ||
    (book.description && book.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDeleteBook = (id) => {
    setBooks(books.filter(book => book._id !== id));
    setToast({
      visible: true,
      message: "Book deleted successfully!",
      type: "success"
    });
    if (selectedBook && selectedBook._id === id) {
      setSelectedBook(null);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  const closeToast = () => {
    setToast({ ...toast, visible: false });
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden w-full">
    
      {isAdmin ? (
        
        <>
          
          <section className="bg-gray-100 py-8 border-b border-gray-200">
            <div className="container mx-auto px-4">
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Admin</h1>
                <div className="relative w-64">
                  <input
                    type="text"
                    placeholder="Search books..."
                    className="w-full rounded-full py-2 px-4 pr-10 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search className="absolute right-3 top-2 text-gray-600 h-5 w-5" />
                </div>
              </div>
            </div>
          </section>
        </>
      ) : (
       
        <>
          
          <section className="bg-gradient-to-r from-indigo-800 to-purple-700 text-white py-24 relative overflow-hidden max-w-full">
            <div className="absolute inset-0 bg-pattern opacity-10"></div>
            <div className="container mx-auto px-4 relative z-10">
              <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="md:w-1/2 mb-12 md:mb-0" data-aos="fade-right">
                  <h2 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
                    Discover Your Next Adventure
                  </h2>
                  <p className="text-2xl mb-8 font-light">
                    Dive into our curated collection of bestsellers, classics, and hidden gems.
                  </p>
                  <div className={`relative max-w-md transition-all duration-200 ${isSearchFocused ? 'scale-105' : ''}`}>
                    <input
                      type="text"
                      placeholder="Search by title, author, or price..."
                      className="w-full rounded-full py-4 px-6 pr-14 text-gray-900 focus:outline-none focus:ring-4 focus:ring-yellow-300 shadow-lg transition-all duration-300"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onFocus={() => setIsSearchFocused(true)}
                      onBlur={() => setIsSearchFocused(false)}
                    />
                    <Search className="absolute right-5 top-4 text-gray-600 h-6 w-6" />
                    {searchTerm && (
                      <button
                        onClick={handleClearSearch}
                        className="absolute right-12 top-4 text-gray-600 hover:text-gray-800"
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>
                </div>
                <div className="md:w-1/2 flex justify-center" data-aos="fade-left">
                  <div className="relative">
                    <div className="bg-white/20 rounded-2xl shadow-2xl transform -rotate-12 absolute -left-8 w-40 h-56"></div>
                    <div className="bg-white/20 rounded-2xl shadow-2xl transform rotate-12 absolute -right-8 w-40 h-56"></div>
                    <div className="bg-white/40 rounded-2xl shadow-2xl relative z-10 w-48 h-64 flex items-center justify-center">
                      <BookOpen size={80} className="text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

         
          <section className="py-20 bg-gradient-to-r from-indigo-800 to-purple-700 text-white">
            <div className="container mx-auto px-4">
              <h2 className="text-4xl md:text-5xl font-extrabold mb-16 text-center tracking-tight" data-aos="fade-up">
                What Our Readers Say
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.map(testimonial => (
                  <div
                    key={testimonial.id}
                    className="bg-white text-gray-900 rounded-3xl shadow-2xl p-6 flex flex-col items-center text-center transition-all duration-300 transform hover:-translate-y-2"
                    data-aos="fade-up"
                    data-aos-delay={testimonial.id * 100}
                  >
                    <Quote className="h-8 w-8 text-yellow-500 mb-4" />
                    <p className="text-lg text-gray-700 mb-6 leading-relaxed">{testimonial.quote}</p>
                    <h3 className="text-xl font-semibold text-gray-900">{testimonial.name}</h3>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight" data-aos="fade-up">
              {isAdmin ? "Manage Books" : "All Books"}
            </h2>
            {isAdmin && (
              <Link
                to="/add"
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full flex items-center font-semibold transition-colors duration-300"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                <Plus size={24} className="mr-2" />
                Add New Book
              </Link>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {filteredBooks.map(book => (
                <BookCard
                  key={book._id}
                  book={book}
                  onDelete={handleDeleteBook}
                  setSelectedBook={setSelectedBook}
                  isAdmin={isAdmin}
                />
              ))}
            </div>
          )}
        </div>
      </section>

     
      {selectedBook && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-auto">
            <div className="relative p-8">
              <button
                onClick={() => setSelectedBook(null)}
                className="absolute top-6 right-6 text-gray-500 hover:text-gray-800 transition-colors duration-300"
              >
                <X size={28} />
              </button>
              
              <h2 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
                {selectedBook.title}
              </h2>
              <p className="text-2xl text-gray-600 mb-6 font-medium">by {selectedBook.author}</p>
              <div className="mb-8">
                <span className="text-3xl font-extrabold text-indigo-600">
                  ${selectedBook.price.toFixed(2)}
                </span>
                <span className="ml-3 text-sm text-gray-500">Tax included</span>
              </div>
              <p className="text-gray-700 mb-8 text-lg leading-relaxed">{selectedBook.description}</p>
              
              <div className="flex flex-wrap gap-4">
                {!isAdmin && (
                  <button className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-8 py-4 rounded-full font-semibold flex items-center transition-colors duration-300">
                    <ShoppingCart size={24} className="mr-3" />
                    Add to Cart
                  </button>
                )}
                
                {isAdmin && (
                  <>
                    <Link
                      to={`/edit/${selectedBook._id}`}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-full font-semibold flex items-center transition-colors duration-300"
                    >
                      <Edit size={24} className="mr-3" />
                      Edit Book
                    </Link>
                    <button 
                      onClick={() => {
                        setSelectedBook(null);
                        const bookToDelete = books.find(b => b._id === selectedBook._id);
                        if (bookToDelete) {
                          const confirmDelete = window.confirm(`Are you sure you want to delete "${bookToDelete.title}"?`);
                          if (confirmDelete) {
                            api.delete(`/${bookToDelete._id}`)
                              .then(() => {
                                handleDeleteBook(bookToDelete._id);
                              })
                              .catch(error => {
                                setToast({
                                  visible: true,
                                  message: `Failed to delete book: ${error.message}`,
                                  type: "error"
                                });
                              });
                          }
                        }
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-full font-semibold flex items-center transition-colors duration-300"
                    >
                      <Trash size={24} className="mr-3" />
                      Delete Book
                    </button>
                  </>
                )}
              </div>
                
              <div className="mt-10 border-t border-gray-200 pt-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Book Details</h3>
                <ul className="text-gray-600 text-sm space-y-2">
                  <li>Format: Paperback</li>
                  <li>Language: English</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

     
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.visible}
        onClose={closeToast}
      />

     
      <footer className="bg-gradient-to-b from-gray-900 to-gray-800 text-white py-16 w-full overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div data-aos="fade-up">
              <h3 className="text-2xl font-extrabold mb-6 tracking-tight">Pageturner Books</h3>
              <p className="text-gray-300 leading-relaxed">
                Your destination for quality books at affordable prices. Explore our vast collection today!
              </p>
            </div>
            <div data-aos="fade-up" data-aos-delay="100">
              <h4 className="text-xl font-bold mb-6">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/" className="text-gray-300 hover:text-yellow-300 transition-colors duration-300">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-gray-300 hover:text-yellow-300 transition-colors duration-300">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-300 hover:text-yellow-300 transition-colors duration-300">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="text-gray-300 hover:text-yellow-300 transition-colors duration-300">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div data-aos="fade-up" data-aos-delay="200">
              <h4 className="text-xl font-bold mb-6">Categories</h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/categories/fiction" className="text-gray-300 hover:text-yellow-300 transition-colors duration-300">
                    Fiction
                  </Link>
                </li>
                <li>
                  <Link to="/categories/non-fiction" className="text-gray-300 hover:text-yellow-300 transition-colors duration-300">
                    Non-Fiction
                  </Link>
                </li>
                <li>
                  <Link to="/categories/children" className="text-gray-300 hover:text-yellow-300 transition-colors duration-300">
                    Children's Books
                  </Link>
                </li>
                <li>
                  <Link to="/categories/educational" className="text-gray-300 hover:text-yellow-300 transition-colors duration-300">
                    Educational
                  </Link>
                </li>
              </ul>
            </div>
            <div data-aos="fade-up" data-aos-delay="300">
              <h4 className="text-xl font-bold mb-6">Newsletter</h4>
              <p className="text-gray-300 mb-6">Subscribe to get updates on new arrivals and special offers.</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="bg-gray-800 text-white px-6 py-3 rounded-l-full focus:outline-none focus:ring-4 focus:ring-yellow-300 transition-all duration-300"
                />
                <button className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-6 py-3 rounded-r-full font-semibold transition-colors duration-300">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-300" data-aos="fade-up">
            <p>© 2025 Pageturner Books. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}