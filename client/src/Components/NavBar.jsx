import { Link } from "react-router-dom";
import { useAuth } from "./../Components/Auth";

const Navbar = () => {
  const { user, logout, loading } = useAuth();

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between">
        <Link to="/" className="text-xl font-bold">BookStore</Link>
        {!loading && (
          <div className="space-x-4">
            <Link to="/" className="hover:underline">Home</Link>
            {user?.role === "admin" && (
              <Link to="/add" className="hover:underline">Add Book</Link>
            )}
            {user ? (
              <button onClick={logout} className="hover:underline">Logout</button>
            ) : (
              <Link to="/login" className="hover:underline">Login</Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;