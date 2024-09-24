import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

const Post = ({ id, content, user_id, date, likes, liked, updatePostLikes }) => {
  const [isLiking, setIsLiking] = useState(false);  // For handling like button click state

  const handleLike = async () => {
    if (isLiking) return; // Prevent multiple like actions while one is in progress

    const accessToken = Cookies.get('accessToken');
    if (!accessToken) {
      alert('Please log in to like posts');
      return;
    }

    setIsLiking(true);  // Disable button while processing the like action

    try {
      // Make a POST request to like/unlike the post
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
        // Toggle the liked status and update likes count by 2
        const newLikedStatus = !liked;
        const newLikesCount = newLikedStatus ? likes + 2 : likes - 2;  // Change by 2
        updatePostLikes(id, newLikedStatus, newLikesCount);  // Call parent to update post state
      }
    } catch (error) {
      console.error('Error liking post:', error);
    } finally {
      setIsLiking(false);  // Re-enable the like button after processing
    }
  };

  const likeCount = Math.floor(likes / 2);  // Show actual likes by dividing

  return (
    <div className="max-w-md rounded-lg overflow-hidden shadow-lg m-4 bg-white">
      <div className="px-6 py-4">
        {/* Link to user's profile */}
        <Link to={`/user/${user_id}`} className="font-bold text-xl mb-2 text-blue-600 hover:underline">
          {user_id || 'Anonymous'}
        </Link>

        {/* Post content */}
        <p className="text-gray-700 text-base mb-4">{content}</p>
        
        {/* Post date */}
        <p className="text-gray-500 text-sm">{new Date(date).toLocaleString()}</p>

        {/* Like button */}
        <button 
          onClick={handleLike}  // Like/Unlike post on button click
          disabled={isLiking}  // Disable button while like request is being processed
          className={`text-sm focus:outline-none ${liked ? 'text-red-500' : 'text-gray-500'}`}  // Change color based on liked status
        >
          {likeCount} {liked ? '💗' : '🤍'}  {/* Show the correct heart icon */}
        </button>
      </div>
    </div>
  );
};

export default Post;
