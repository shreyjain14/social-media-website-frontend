import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const PostForm = ({ onPostCreated }) => {
  const [newPost, setNewPost] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const navigate = useNavigate();

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    const accessToken = Cookies.get('accessToken');
    
    if (!accessToken) {
      // Redirect to login page if no access token is found
      navigate('/login');
      return;
    }

    if (newPost.trim() !== '') {
      try {
        const response = await fetch('/api/thoughts/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify({
            content: newPost,
            anonymous: isAnonymous
          })
        });

        if (!response.ok) {
          if (response.status === 401) {
            // Token might be expired, redirect to login
            Cookies.remove('accessToken');
            navigate('/login');
            return;
          }
          throw new Error('Network response was not ok');
        }

        const createdPost = await response.json();
        onPostCreated(createdPost);
        setNewPost('');
        setIsAnonymous(false);
      } catch (error) {
        console.error('Error creating post:', error);
      }
    }
  };

  return (
  <div className="max-w-lg mx-auto p-4 bg-white rounded-lg shadow-md">
    <form onSubmit={handlePostSubmit} className="mb-8">
      <textarea
        className="w-full p-4 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-blue-500"
        rows="4"
        placeholder="Share your thoughts..."
        value={newPost}
        onChange={(e) => setNewPost(e.target.value)}
      ></textarea>
      <div className="mt-4 flex items-center">
        <input
          type="checkbox"
          className="form-checkbox h-5 w-5 text-blue-600"
          checked={isAnonymous}
          onChange={(e) => setIsAnonymous(e.target.checked)}
        />
        <label className="ml-2 text-gray-700">Post anonymously</label>
      </div>
      <button 
        type="submit"
        className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        Post
      </button>
    </form>
  </div>
);
}
export default PostForm;
