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

  useEffect(() => {
    const accessToken = Cookies.get('accessToken');
    if (accessToken) {
      fetchUserInfo(accessToken);
    }
    fetchPosts(); // Fetch posts regardless of login status
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

  const fetchPosts = async () => {
    try {
      const response = await axios.get('/api/thoughts/get');
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  const handleLogout = () => {
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    setUser(null);
  };

  const Home = () => (
    <div className="container mx-auto p-4 bg-gray-100 min-h-screen pt-10"> 
      
      <p className="text-center mb-4">Welcome, {user ? user.username : 'Guest'}!</p>
      {user && <PostForm onPostCreated={handlePostCreated} />}
      <div className="flex flex-col items-center">
        {posts.map(post => (
          <Post key={post.id} {...post} />
        ))}
      </div>
    </div>
  );

  return (
    <Router>
      <div className="pt-16"> {/* Added padding-top to account for fixed navbar */}
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
