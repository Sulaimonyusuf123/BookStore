import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet"; 

// Configure axios for this component
axios.defaults.withCredentials = false;

const BookDetail = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(`https://bookstore-api-hvgt.onrender.com/api/books/${id}`, {
          withCredentials: false
        });
        setBook(response.data.data);
        document.title = response.data.data.title || "Book Details"; 
      } catch (error) {
        console.error("Error fetching book:", error);
        setError(error.response?.data?.message || "Failed to load book details.");
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

 
  const getMetaDescription = () => {
    if (!book) return "Book details page";
    return `${book.title} by ${book.author}. ${
      book.description ? book.description.substring(0, 150) + "..." : ""
    }`;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
        <p className="text-gray-600">Loading book details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Helmet>
          <title>Error | Book Not Found</title>
          <meta name="description" content="Sorry, we couldn't find the requested book." />
        </Helmet>
        <p className="text-red-500 mb-4">{error}</p>
        <Link to="/" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Home
        </Link>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Helmet>
          <title>Book Not Found</title>
          <meta name="description" content="Sorry, we couldn't find the requested book." />
        </Helmet>
        <p className="text-gray-700 mb-4">Book not found.</p>
        <Link to="/" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <Helmet>
        <title>{book.title} by {book.author} | Book Details</title>
        <meta name="description" content={getMetaDescription()} />
        <meta property="og:title" content={`${book.title} by ${book.author}`} />
        <meta property="og:description" content={getMetaDescription()} />
        <meta property="og:type" content="book" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={`${book.title} by ${book.author}`} />
        <meta name="twitter:description" content={getMetaDescription()} />
      </Helmet>

      <Link 
        to="/" 
        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition duration-200 mb-6 sm:mb-8"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back to Home
      </Link>
      <div className="bg-white shadow-md rounded-lg overflow-hidden p-4 sm:p-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4">{book.title}</h1>
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