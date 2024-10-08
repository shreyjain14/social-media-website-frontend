import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  const lastPostElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  useEffect(() => {
    const accessToken = Cookies.get('accessToken');
    if (accessToken) {
      fetchUserInfo(accessToken);
    }
    fetchPosts();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [page]);

  const fetchUserInfo = async (accessToken) => {
    try {
      const response = await axios.get('api/auth/whoami', {
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
    setLoading(true);
    try {
      const accessToken = Cookies.get('accessToken');
      let response;
      const params = { page: page };
      
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
      
      const newPosts = response.data;
      if (newPosts.length === 0) {
        setHasMore(false);
      } else {
        setPosts(prevPosts => {
          const updatedPosts = [...prevPosts, ...newPosts];
          const uniquePosts = updatedPosts.filter((post, index, self) =>
            index === self.findIndex((t) => t.id === post.id)
          );
          return uniquePosts.map(post => ({
            ...post,
            likes: post.likes || 0,
            liked: post.liked || false
          }));
        });
      }
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
    setPosts([]);
    setPage(1);
    setHasMore(true);
    fetchPosts();
  };

  const handleLogin = async (accessToken) => {
    await fetchUserInfo(accessToken);
    setPosts([]);
    setPage(1);
    setHasMore(true);
    await fetchPosts();
  };

  const handleLike = async (postId) => {
    const accessToken = Cookies.get('accessToken');
    if (!accessToken) {
      // Redirect to login if not authenticated
      return;
    }

    try {
      const response = await axios.post('/api/thoughts/like', 
        { thought_id: postId },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          }
        }
      );

      if (response.data.success) {
        setPosts(prevPosts => 
          prevPosts.map(post => 
            post.id === postId 
              ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 2 : post.likes + 2 } 
              : post
          )
        );
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const Home = () => (
    <div className="container mx-auto p-4 bg-gray-100 min-h-screen pt-10">
      {user && <PostForm onPostCreated={handlePostCreated} />}
      <div className="flex flex-col items-center">
        {posts.map((post, index) => {
          if (posts.length === index + 1) {
            return (
              <div ref={lastPostElementRef} key={post.id}>
                <Post {...post} onLike={() => handleLike(post.id)} />
              </div>
            );
          } else {
            return <Post key={post.id} {...post} onLike={() => handleLike(post.id)} />;
          }
        })}
        {loading && <p>Loading...</p>}
        {!hasMore && <p className="text-center mt-4">No more posts left</p>}
      </div>
    </div>
  );

  return (
    <Router>
      <div className="pt-16">
        <Navbar user={user} onLogout={handleLogout} />
        <Routes>
          <Route path="/login" element={<Login setUser={setUser} onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/user/:username" element={<UserPage />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;