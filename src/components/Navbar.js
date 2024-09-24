import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ user, onLogout }) => {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search.trim() !== '') {
      navigate(`/user/${search}`);
      setSearch(''); // Clear the search input after submitting
    }
  };

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <nav className="fixed-navbar bg-gray-600 p-4 w-full">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold">Unveil</Link>
        <form onSubmit={handleSearchSubmit} className="flex items-center">
          <input
            type="text"
            placeholder="Search by username"
            className="px-4 py-2 rounded-l-lg border-none focus:outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button 
            type="submit"
            className="px-4 py-2 bg-blue-700 text-white rounded-r-lg hover:bg-blue-800 focus:outline-none"
          >
            Search
          </button>
        </form>
        <div className="user-info flex items-center">
          {user ? (
            <>
              <span className="text-white mr-4">Welcome, {user.username}</span>
              <button 
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 focus:outline-none mr-2">Login</Link>
              <Link to="/register" className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 focus:outline-none">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;