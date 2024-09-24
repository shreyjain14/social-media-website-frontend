import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import Navbar from './components/Navbar';
import Post from './components/Post';
import Login from './components/Login';
import Register from './components/Register';
import PostForm from './components/PostForm';
import UserPage from './components/UserPage';

const App = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const accessToken = Cookies.get('accessToken');
    if (accessToken) {
      fetchUserInfo(accessToken);
    }
    fetchPosts(currentPage);
  }, []);

  const fetchUserInfo = async (accessToken) => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/auth/whoami', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      const { user_details } = response.data;
      setUser(user_details);
    } catch (error) {
      console.error('Error fetching user info:', error);
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      setUser(null);
    }
  };

  const fetchPosts = async (page) => {
    setLoading(true);
    try {
      const accessToken = Cookies.get('accessToken');
      let response;
      const params = { post: page };
      
      if (accessToken) {
        response = await axios.get('/api/thoughts/get-with-login', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          params
        });
      } else {
        response = await axios.get('/api/thoughts/get', { params });
      }
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostCreated = (newPost) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
  };

  const handleLogout = () => {
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    setUser(null);
    setCurrentPage(1);
    fetchPosts(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchPosts(newPage);
  };

  const Home = () => (
    <div className="container mx-auto p-4 bg-gray-100 min-h-screen pt-10">
      <p className="text-center mb-4">Welcome, {user ? user.username : 'Guest'}!</p>
      {user && <PostForm onPostCreated={handlePostCreated} />}
      <div className="flex flex-col items-center">
        {loading ? (
          <p>Loading...</p>
        ) : (
          posts.map(post => <Post key={post.id} {...post} />)
        )}
      </div>
      <div className="flex justify-center mt-4">
        <button 
          onClick={() => handlePageChange(currentPage - 1)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
          disabled={currentPage === 1 || loading}
        >
          Previous
        </button>
        <button 
          onClick={() => handlePageChange(currentPage + 1)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          disabled={loading}
        >
          Next
        </button>
      </div>
    </div>
  );

  return (
    <Router>
      <div className="pt-16">
        <Navbar user={user} onLogout={handleLogout} />
        <Routes>
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/user/:username" element={<UserPage />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;