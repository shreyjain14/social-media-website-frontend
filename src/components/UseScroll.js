import { useEffect } from 'react';

const useScrollLock = () => {
  useEffect(() => {
    // Lock the scroll
    document.body.style.overflow = 'hidden';

    // Cleanup function to unlock the scroll
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);
};

export default useScrollLock;