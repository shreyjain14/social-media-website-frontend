import React, { useState } from 'react';
import { FaHeart } from 'react-icons/fa';

const Card = ({ title, features, image, postId, updatePostLikes, userName, userAvatar, date }) => {
  const [isLiked, setIsLiked] = useState(false);

  const toggleLike = () => {
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    console.log('After toggle:', newIsLiked);
    updatePostLikes(postId, newIsLiked);
  };

  return (
    <div className="max-w-lg mx-auto rounded overflow-hidden shadow-lg my-4 w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3">
      <img className="w-full" src={image} alt={title} />
      <div className="px-6 py-4">
        <div className="flex items-center mb-2">
          <img className="w-10 h-10 rounded-full mr-4" src={userAvatar} alt={userName} />
          <div className="text-sm">
            <p className="text-gray-900 leading-none">{userName}</p>
            <p className="text-gray-600">{new Date(date).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="font-bold text-xl mb-2">{title}</div>
        <ul className="text-gray-700 text-base">
          {(features && Array.isArray(features)) ? features.map((feature, index) => (
            <li key={index}>{feature}</li>
          )) : null}
        </ul>
      </div>
      <div className="px-6 pt-4 pb-2">
        <button onClick={toggleLike} className="focus:outline-none">
          <FaHeart className={`transition-all duration-300 ${isLiked ? 'text-red-500 scale-125' : 'text-gray-500'}`} />
        </button>
      </div>
    </div>
  );
};

export default Card;