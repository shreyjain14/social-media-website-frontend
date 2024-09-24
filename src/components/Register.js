import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import confetti from 'canvas-confetti';
import './Register.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [reenterPassword, setReenterPassword] = useState('');
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const [isRegistered, setIsRegistered] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let filledFields = 0;
    if (username) filledFields += 1;
    if (email) filledFields += 1;
    if (password) filledFields += 1;
    if (reenterPassword) filledFields += 1;
    setProgress((filledFields / 4) * 100);
  }, [username, email, password, reenterPassword]);

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validatePassword(password)) {
      setError('Password must be at least 8 characters long and contain at least 1 symbol, 1 uppercase letter, 1 lowercase letter, and 1 number.');
      return;
    }

    if (password !== reenterPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:5000/auth/register', {
        username,
        password,
        email
      });

      if (response.status === 201) {
        setIsRegistered(true);
        showConfetti();
        setTimeout(() => {
          navigate('/login');
        }, 5000); // Redirect after 5 seconds
      }
    } catch (error) {
      setError('Registration failed. Please try again.');
    }
  };

  const showConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="flex h-screen overflow-hidden relative">
      <div className="w-1/2 relative h-full">
        <img src="https://images.unsplash.com/photo-1503198515498-d0bd9ed16902?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Background" className="w-full h-full object-cover" />
        <div className="absolute inset-0 flex flex-col items-center justify-center glass-effect text-white p-8">
          <h1 className="text-4xl font-bold mb-4">Join Unveil</h1>
          <p className="text-lg">Become a part of our community and share your thoughts with the world.</p>
        </div>
      </div>
      <div className="w-1/2 flex items-center justify-center h-full">
        <div className="relative w-full max-w-md registration-form">
          <div className={`progress-bar ${error ? 'blink-red' : ''}`} style={{ width: `${progress}%` }}></div>
          <div className="relative px-8 py-6 mt-4 text-left shadow-lg bg-white rounded-lg">
            <h3 className="text-2xl font-bold text-center">Register for Unveil</h3>
            <form onSubmit={handleSubmit}>
              <div className="mt-4">
                <div>
                  <label className="block" htmlFor="username">Username</label>
                  <input
                    type="text"
                    placeholder="Username"
                    className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="mt-4">
                  <label className="block" htmlFor="email">Email</label>
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mt-4">
                  <label className="block" htmlFor="password">Password</label>
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="mt-4">
                  <label className="block" htmlFor="reenterPassword">Re-enter Password</label>
                  <input
                    type="password"
                    placeholder="Re-enter Password"
                    className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                    value={reenterPassword}
                    onChange={(e) => setReenterPassword(e.target.value)}
                    required
                  />
                </div>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                <div className="flex items-center justify-center">
                  <button className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900">Register</button>
                </div>
              </div>
            </form>
            <p className="mt-4 text-center">
              Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
            </p>
          </div>
        </div>
      </div>
      {isRegistered && (
        <div className="overlay">
          <div className="popup-message">
            Time to free your mind and share your thoughts with the world! Redirecting to login... :)
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;