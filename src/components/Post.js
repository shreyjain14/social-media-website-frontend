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
  date = new Date(), 
  likes = 0, 
  liked = false, 
  updatePostLikes 
}) => {
  const [isLiking, setIsLiking] = useState(false);
  const [likeState, setLikeState] = useState({ liked, likes });
  const navigate = useNavigate();

  const handleLike = async () => {
    if (isLiking) return;
    const accessToken = Cookies.get('accessToken');
    if (!accessToken) {
      navigate('/login');
      return;
    }

    setIsLiking(true);

    const newLikedStatus = !likeState.liked;
    const newLikesCount = newLikedStatus ? likeState.likes + 2 : likeState.likes - 2;
    setLikeState({ liked: newLikedStatus, likes: newLikesCount });

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
        setLikeState({ liked, likes });
      }
    } catch (error) {
      console.error('Error liking post:', error);
      setLikeState({ liked, likes });
    } finally {
      setIsLiking(false);
    }
  };

  const likeCount = Math.floor(likeState.likes / 2);
  const displayName = user_id || "Anonymous";
  const avatarFallback = displayName.charAt(0).toUpperCase();

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
          <p className="text-sm text-muted-foreground">{new Date(date).toLocaleString()}</p>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-base">{content}</p>
      </CardContent>
      <CardFooter>
        <Button
          variant="ghost"
          size="sm"
          className={`flex items-center gap-2 ${likeState.liked ? "text-red-500" : "text-muted-foreground"}`}
          onClick={handleLike}
          disabled={isLiking}
        >
          <Heart className={`h-5 w-5 ${likeState.liked ? "fill-current" : ""}`} />
          <span>{likeCount}</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Post;
