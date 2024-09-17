import React, { useEffect, useState } from "react";

interface Thought {
  id: number;
  content: string;
  date: string;
  user_id: number | null;
}

function ViewThoughts() {
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchThoughts = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/thoughts/get");
        if (!response.ok) {
          throw new Error("Error fetching thoughts");
        }
        const data = await response.json();
        setThoughts(data);
      } catch (error) {
        console.error("Error fetching thoughts:", error);
        setError("Failed to fetch thoughts. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchThoughts();
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <div>
      <h2>View Thoughts</h2>
      {isLoading && <p>Loading thoughts...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <ul>
        {thoughts.length > 0 &&
          thoughts.map((thought) => (
            <li key={thought.id}>
              <p>{thought.content}</p>
              <p className="text-gray-500 text-sm">
                {new Date(thought.date).toLocaleString()}
              </p>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default ViewThoughts;
