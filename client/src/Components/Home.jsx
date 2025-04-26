import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../Components/Auth"; // Adjust path if needed
import axios from "axios";

const BookCard = ({ book, onDelete }) => {
  const { user } = useAuth();

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${book.title}"?`)) {
      try {
        await axios.delete(`https://api.example.com/books/${book.id}`);
        onDelete(book.id); // Remove book from UI
      } catch (error) {
        console.error("Error deleting book:", error);
        alert("Failed to delete book. Please try again.");
      }
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <Link to={`/book/${book.id}`}>
        <h3 className="text-lg font-semibold">{book.title}</h3>
        <p className="text-gray-600">by {book.author}</p>
        <p className="text-green-600 font-bold">${book.price}</p>
        <p className="text-gray-500 mt-2 line-clamp-2">{book.description}</p>
      </Link>
      {user?.role === "admin" && (
        <div className="mt-4 flex space-x-2">
          <Link
            to={`/edit/${book.id}`}
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

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get("https://api.example.com/books"); // Replace with your backend URL
        setBooks(response.data);
      } catch (error) {
        console.error("Error fetching books:", error);
        setBooks([
          {
            id: 1,
            title: "The Great Gatsby",
            author: "F. Scott Fitzgerald",
            price: 10.99,
            description: "A story of the fabulously wealthy Jay Gatsby...",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const handleDelete = (id) => {
    setBooks(books.filter((book) => book.id !== id));
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
        <div className="text-center">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <BookCard key={book.id} book={book} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;