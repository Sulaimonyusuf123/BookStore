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
        const response = await axios.get(`https://api.example.com/books/${id}`);
        setBook(response.data);
      } catch (error) {
        console.error("Error fetching book:", error);
        setError("Failed to load book details.");
        setBook({
          id: 1,
          title: "The Great Gatsby",
          author: "F. Scott Fitzgerald",
          price: 10.99,
          description: "A story of the fabulously wealthy Jay Gatsby...",
        });
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

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Link to="/" className="text-blue-600 hover:underline mb-4 inline-block">
        ← Back to Home
      </Link>
      <h1 className="text-3xl font-bold mb-4">{book.title}</h1>
      <p className="text-gray-600 mb-2">by {book.author}</p>
      <p className="text-green-600 font-bold mb-4">${book.price}</p>
      <p className="text-gray-700">{book.description}</p>
    </div>
  );
};

export default BookDetail;