import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Button } from "@/components/ui/button";
import { Card as UICard, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Heart } from "lucide-react"; // Import Heart icon

const Post = ({ 
  id, 
  content = '', 
  user_id = null, 
  userAvatar = '', 
  date = new Date(), 
  likes = 0, 
  liked = false, 
  updatePostLikes 
}) => {
  const [isLiking, setIsLiking] = useState(false);
  const [localLiked, setLocalLiked] = useState(liked);
  const [localLikes, setLocalLikes] = useState(likes);
  const navigate = useNavigate();

  const handleLike = async () => {
    if (isLiking) return;
    const accessToken = Cookies.get('accessToken');
    if (!accessToken) {
      navigate('/login');
      return;
    }

    setIsLiking(true);

    const newLikedStatus = !localLiked;
    const newLikesCount = newLikedStatus ? localLikes + 1 : localLikes - 1;

    // Update local state immediately
    setLocalLiked(newLikedStatus);
    setLocalLikes(newLikesCount);

    try {
      const response = await axios.post('/api/thoughts/like', 
        { thought_id: id },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          }
        }
      );

      if (response.data.message === 'Success') {
        // Update parent component's state
        updatePostLikes(id, newLikedStatus, newLikesCount);
      } else {
        // If the server request fails, revert the local state
        setLocalLiked(!newLikedStatus);
        setLocalLikes(newLikedStatus ? localLikes - 1 : localLikes + 1);
      }
    } catch (error) {
      console.error('Error liking post:', error);
      // Revert the local state in case of error
      setLocalLiked(!newLikedStatus);
      setLocalLikes(newLikedStatus ? localLikes - 1 : localLikes + 1);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <UICard className="max-w-lg mx-auto rounded overflow-hidden shadow-lg my-4 w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3 hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-center mb-2">
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-4">
            <span className="text-lg font-bold text-gray-700">{user_id ? user_id.charAt(0).toUpperCase() : '?'}</span>
          </div>
          <div className="text-sm">
            <p className="text-gray-900 leading-none">{user_id || 'Unknown User'}</p>
            <p className="text-gray-600">{new Date(date).toLocaleDateString()}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 text-base">{content}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <Button onClick={handleLike} disabled={isLiking}>
          <Heart className={`transition-all duration-300 ${localLiked ? 'text-red-500 fill-current' : 'text-gray-500'}`} />
          <span className="ml-2">{localLikes}</span>
        </Button>
      </CardFooter>
    </UICard>
  );
};

export default Post;