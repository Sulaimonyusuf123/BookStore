import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const BookDetail = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(`http://localhost:3009/api/books/${id}`);
        setBook(response.data.data); // Backend returns { success: true, data: book }
      } catch (error) {
        console.error("Error fetching book:", error);
        setError(error.response?.data?.message || "Failed to load book details.");
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <p className="text-red-500">{error}</p>
        <Link to="/" className="text-blue-600 hover:underline">Back to Home</Link>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="container mx-auto p-4">
        <p className="text-gray-700">Book not found.</p>
        <Link to="/" className="text-blue-600 hover:underline">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Link to="/" className="text-blue-600 hover:underline mb-4 inline-block">
        ← Back to Home
      </Link>
      <div className="bg-white shadow-md rounded-lg overflow-hidden p-6 mt-4">
        <h1 className="text-3xl font-bold mb-4">{book.title}</h1>
        <div className="flex flex-col space-y-4">
          <p className="text-gray-600">
            <span className="font-semibold">Author:</span> {book.author}
          </p>
          <p className="text-green-600 font-bold text-xl">
            ${parseFloat(book.price).toFixed(2)}
          </p>
          <div className="border-t pt-4 mt-2">
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-700 whitespace-pre-line">{book.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;