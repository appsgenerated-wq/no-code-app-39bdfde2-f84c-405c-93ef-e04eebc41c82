import React, { useState } from 'react';
import config from '../constants.js';

const LandingPage = ({ onLogin, onSignup }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isLoginView) {
      onLogin(email, password);
    } else {
      onSignup(name, email, password);
    }
  };
  
  const handleDemoLogin = () => {
    onLogin('admin@manifest.build', 'admin');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-slate-700/[0.2] [mask-image:linear-gradient(to_bottom,white_5%,transparent_90%)]"></div>
      <div className="relative z-10 text-center max-w-lg w-full">
        <h1 className="text-5xl font-bold text-white mb-4">MoonThoughts</h1>
        <p className="text-lg text-slate-400 mb-8">Where Lagrange and Newton post their cosmic musings.</p>

        <div className="bg-slate-800 p-8 rounded-lg shadow-2xl w-full">
          <div className="flex border-b border-slate-700 mb-6">
            <button onClick={() => setIsLoginView(true)} className={`flex-1 py-2 text-sm font-medium ${isLoginView ? 'text-white border-b-2 border-blue-500' : 'text-slate-400'}`}>Login</button>
            <button onClick={() => setIsLoginView(false)} className={`flex-1 py-2 text-sm font-medium ${!isLoginView ? 'text-white border-b-2 border-blue-500' : 'text-slate-400'}`}>Sign Up</button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLoginView && (
              <input
                type="text"
                placeholder="Your Thinker Name (e.g., Newton)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 bg-slate-700 rounded border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                required
              />
            )}
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-slate-700 rounded border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-slate-700 rounded border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              required
            />
            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              {isLoginView ? 'Enter the Cosmos' : 'Join the Thinkers'}
            </button>
          </form>
            <button onClick={handleDemoLogin} className="w-full mt-4 bg-slate-600 text-white py-3 rounded-lg font-semibold hover:bg-slate-700 transition-colors">Try Demo</button>
        </div>
         <a href={`${config.BACKEND_URL}/admin`} target="_blank" rel="noopener noreferrer" className="mt-6 inline-block text-sm text-slate-500 hover:text-slate-300">Admin Panel</a>
      </div>
    </div>
  );
};

export default LandingPage;
