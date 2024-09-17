import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex items-center">
        {" "}
        {/* Removed justify-between */}
        <h1 className="text-white text-2xl font-bold mr-6">
          {" "}
          {/* Added margin-right */}
          <Link to="/">Your App Name</Link>
        </h1>
        <ul className="flex space-x-4">
          <li>
            <Link
              to="/create"
              className="text-white hover:text-gray-300 py-2 px-3 rounded" // Added padding and rounded corners
            >
              Create Thought
            </Link>
          </li>
          <li>
            <Link
              to="/"
              className="text-white hover:text-gray-300 py-2 px-3 rounded"
            >
              View Thoughts
            </Link>
          </li>
          {/* Add more navigation links as needed */}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
