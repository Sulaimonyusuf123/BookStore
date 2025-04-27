import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "./../Components/Auth";
import axios from "axios";

const AddEditBook = () => {
  const { id } = useParams();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    price: "",
    description: "",
  });
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (id) {
      const fetchBook = async () => {
        try {
          const response = await axios.get(`http://localhost:3009/api/books/${id}`);
          setFormData(response.data.data); 
        } catch (error) {
          console.error("Error fetching book:", error);
          setFormError(error.response?.data?.message || "Failed to load book data.");
        }
      };
      fetchBook();
    }
  }, [id]);

  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold">Access Denied</h2>
        <p>Only admins can access this page.</p>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    // Client-side validation
    if (formData.price <= 0) {
      setFormError("Price must be positive.");
      return;
    }
    try {
      if (id) {
        await axios.put(`http://localhost:3009/api/books/${id}`, formData);
        navigate("/", { 
          state: { 
            editSuccess: true, 
            message: `"${formData.title}" has been updated successfully!` 
          } 
        });
      } else {
        await axios.post("http://localhost:3009/api/books", formData);
        navigate("/", { 
          state: { 
            addSuccess: true, 
            message: `"${formData.title}" has been added successfully!` 
          } 
        });
      }
    } catch (error) {
      console.error("Error saving book:", error);
      setFormError(error.response?.data?.message || "Failed to save book. Please try again.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === "price" ? parseFloat(value) || "" : value });
  };

  return (
    <div className="container mx-auto p-4 max-w-lg">
      <h2 className="text-2xl font-bold mb-6">{id ? "Edit Book" : "Add Book"}</h2>
      {formError && <p className="text-red-500 mb-4">{formError}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Author</label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            step="0.01"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-colors"
        >
          {id ? "Update Book" : "Add Book"}
        </button>
      </form>
    </div>
  );
};

export default AddEditBook;