import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Post from './Post';

const PostsList = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Fetch posts from the API
    const fetchPosts = async () => {
      try {
        const response = await axios.get('/api/thoughts');
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  const updatePostLikes = (id, liked, likes) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === id ? { ...post, liked, likes } : post
      )
    );
  };

  return (
    <div>
      {posts.map((post) => (
        <Post
          key={post.id}
          id={post.id}
          content={post.content}
          user_id={post.user_id}
          userAvatar={post.userAvatar}
          date={post.date}
          likes={post.likes}
          liked={post.liked}
          updatePostLikes={updatePostLikes} // Pass the function here
        />
      ))}
    </div>
  );
};

export default PostsList;