import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

export default function Login() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect (() => {
      const isAuth = localStorage.getItem('isAuthenticated');
      const userId = localStorage.getItem('user');
    
      if (isAuth === 'true' && userId) {
        navigate('/home', { replace: true });
      }
    }, [navigate]);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if ( password != confirmPassword ) {
      setError('Passwords do not match');
      return;
    }

    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    })

    if (response.ok) {
      setMessage('Account created Successfully.');
      
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } else {
      const body = await response.json();
      setError(body.message || 'Signup failed');
    }

  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50 p-4 ">
      <div className="w-[30vw] bg-white rounded-2xl border border-gray-200 p-8">
        <h2 className="text-xl font-bold text-center mb-8">
          Create An Account
        </h2>
        
        <form onSubmit={handleSignup}>
          <div className='mb-6'>
            <label className="block text-sm mb-2">Name</label>
            <input 
              type="name" 
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-yellow-500 focus:outline-none transition duration-150"
              placeholder="John doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className='mb-6'>
            <label className="block text-sm mb-2">Email</label>
            <input 
              type="email" 
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-yellow-500 focus:outline-none transition duration-150"
              placeholder="johndoe@gmail.com"
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

          <div className='mb-6'>
            <label className="block text-sm mb-2">Confirm Password</label>
            <input 
              type="password" 
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-yellow-500 focus:outline-none transition duration-150"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          {message && <p className="text-green-500 text-sm mb-4">{message}</p>}

          <button 
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 hover:cursor-pointer text-white py-2 rounded-lg transition duration-200"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have a account? <button onClick={() => navigate("/login")} className="text-blue-600 hover:underline hover:cursor-pointer">Login</button>
        </p>
      </div>
    </div>
  );
}