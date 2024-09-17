import React, { useState, FormEvent } from "react";

const ThoughtInput: React.FC = () => {
  const [thought, setThought] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const maxChars = 1000;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const input = e.target.value.slice(0, maxChars);
    setThought(input);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(
        `http://127.0.0.1:5000/thoughts/create?content=${encodeURIComponent(
          thought
        )}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Thought submitted successfully:", result);
      setThought(""); // Clear the input after successful submission
      // Handle successful submission (e.g., show a success message)
    } catch (error) {
      console.error("Error submitting thought:", error);
      setError("Failed to submit thought. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="thought"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Enter your thought:
          </label>
          <textarea
            id="thought"
            name="thought"
            value={thought}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            placeholder="What's on your mind? (Max 1000 characters)"
          />
          <p className="mt-1 text-sm text-gray-500 text-right">
            {thought.length}/{maxChars}
          </p>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out ${
            isLoading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isLoading ? "Sending..." : "Send Thought"}
        </button>
      </form>
    </div>
  );
};

export default ThoughtInput;
