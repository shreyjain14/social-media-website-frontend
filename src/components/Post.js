import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

const Post = ({ id, content, user_id, date, likes, liked }) => {
  const [isLiked, setIsLiked] = useState(liked);
  const [likeCount, setLikeCount] = useState(likes);

  const handleLike = async () => {
    const accessToken = Cookies.get('accessToken');
    if (!accessToken) {
      alert('Please log in to like posts');
      return;
    }

    try {
      const response = await axios.post('/api/thoughts/like', 
        { thought_id: id },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      if (response.data.success) {
        setIsLiked(prevIsLiked => !prevIsLiked);
        setLikeCount(prevCount => isLiked ? prevCount - 1 : prevCount + 1);
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  return (
    <div className="max-w-md rounded-lg overflow-hidden shadow-lg m-4 bg-white">
      <div className="px-6 py-4">
        <Link to={`/user/${user_id}`} className="font-bold text-xl mb-2 text-blue-600 hover:underline">
          {user_id || 'Anonymous'}
        </Link>
        <p className="text-gray-700 text-base mb-4">{content}</p>
        <p className="text-gray-500 text-sm">{new Date(date).toLocaleString()}</p>
        <button 
          onClick={handleLike}
          className={`text-sm focus:outline-none ${isLiked ? 'text-red-500' : 'text-gray-500'}`}
        >
          {likeCount} {isLiked ? '❤️' : '♡'}
        </button>
      </div>
    </div>
  );
};

export default Post;
