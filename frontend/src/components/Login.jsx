import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); 
  const navigate = useNavigate();

  useEffect (() => {
    const isAuth = localStorage.getItem('isAuthenticated');
    const userId = localStorage.getItem('user');
  
    if (isAuth === 'true' && userId) {
      navigate('/home', { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })

    if (response.ok) {
      const data = await response.json();

      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', data.user);
      
      navigate('/home');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50 p-4 ">
      <div className="w-[30vw] bg-white rounded-2xl border border-gray-200 p-8">
        <h2 className="text-xl font-bold text-center mb-8">
          Login to Your Account
        </h2>
        
        <form onSubmit={handleLogin}>
          <div className='mb-6'>
            <label className="block text-sm mb-2">Email</label>
            <input 
              type="email" 
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-yellow-500 focus:outline-none transition duration-150"
              placeholder="test@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className='mb-6'>
            <label className="block text-sm mb-2">Password</label>
            <input 
              type="password" 
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-yellow-500 focus:outline-none transition duration-150"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <button 
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 hover:cursor-pointer text-white py-2 rounded-lg transition duration-200"
          >
            Sign In
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account? <button onClick={() => navigate("/signup")} className="text-blue-600 hover:underline hover:cursor-pointer">Sign up</button>
        </p>
      </div>
    </div>
  );
}