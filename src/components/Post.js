import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Heart } from "lucide-react";

const Post = ({ 
  id, 
  content = '', 
  user_id = null, 
  userAvatar = '', 
  date = '', 
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
    const newLikesCount = newLikedStatus ? localLikes + 2 : localLikes - 2;

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

      if (response.data.success) {
        updatePostLikes(id, newLikedStatus, newLikesCount);
      } else {
        setLocalLiked(!newLikedStatus);
        setLocalLikes(newLikedStatus ? newLikesCount - 2 : newLikesCount + 2);
      }
    } catch (error) {
      console.error('Error liking post:', error);
      setLocalLiked(!newLikedStatus);
      setLocalLikes(newLikedStatus ? newLikesCount - 2 : newLikesCount + 2);
    } finally {
      setIsLiking(false);
    }
  };

  const likeCount = Math.floor(localLikes / 2);
  const displayName = user_id || "Anonymous";
  const avatarFallback = displayName.charAt(0).toUpperCase();

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date');
      }
      return date.toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  const formattedDate = formatDate(date);

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar>
          <AvatarImage src={userAvatar} alt={displayName} />
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <Link to={user_id ? `/user/${user_id}` : '#'} className="text-lg font-semibold text-blue-600 hover:underline">
            {displayName}
          </Link>
          <p className="text-sm text-muted-foreground">{formattedDate}</p>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-base">{content}</p>
      </CardContent>
      <CardFooter>
        <Button
          variant="ghost"
          size="sm"
          className={`flex items-center gap-2 ${localLiked ? "text-red-500" : "text-muted-foreground"}`}
          onClick={handleLike}
          disabled={isLiking}
        >
          <Heart className={`h-5 w-5 ${localLiked ? "fill-current" : ""}`} />
          <span>{likeCount}</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Post;
