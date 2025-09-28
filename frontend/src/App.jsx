import React, { useState, useEffect } from 'react';
import Manifest from '@mnfst/sdk';
import LandingPage from './screens/LandingPage';
import DashboardPage from './screens/DashboardPage';
import config from './constants.js';
import { testBackendConnection } from './services/apiService.js';
import './index.css';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [thoughts, setThoughts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [backendConnected, setBackendConnected] = useState(false);

  const manifest = new Manifest({ baseURL: config.BACKEND_URL, appId: config.APP_ID });

  useEffect(() => {
    const initializeApp = async () => {
      console.log('🚀 [APP] Starting backend connection test...');
      const connectionResult = await testBackendConnection();
      setBackendConnected(connectionResult.success);

      if (connectionResult.success) {
        console.log('✅ [APP] Backend connection successful. Checking session...');
        try {
          const user = await manifest.from('User').me();
          setCurrentUser(user);
          console.log('✅ [APP] User session found:', user.email);
        } catch (err) {
          setCurrentUser(null);
          console.log('ℹ️ [APP] No active user session.');
        } finally {
          setIsLoading(false);
        }
      } else {
        console.error('❌ [APP] Backend connection failed:', connectionResult.error);
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  const handleLogin = async (email, password) => {
    try {
      await manifest.login(email, password);
      const user = await manifest.from('User').me();
      setCurrentUser(user);
    } catch (err) {
      console.error('Login failed:', err);
      alert('Login failed. Please check your credentials.');
    }
  };

  const handleSignup = async (name, email, password) => {
    try {
      await manifest.from('User').signup({ name, email, password });
      await handleLogin(email, password);
    } catch (err) {
      console.error('Signup failed:', err);
      alert('Signup failed. The email might already be in use.');
    }
  };

  const handleLogout = async () => {
    await manifest.logout();
    setCurrentUser(null);
    setThoughts([]);
  };

  const loadThoughts = async () => {
    try {
      const response = await manifest.from('Thought').find({ 
        include: ['owner'],
        sort: { createdAt: 'desc' } 
      });
      setThoughts(response.data);
    } catch (err) {
      console.error('Failed to load thoughts:', err);
    }
  };

  const createThought = async (thoughtData) => {
    try {
      const newThought = await manifest.from('Thought').create(thoughtData);
      // Refetch thoughts to get the new one with owner data included
      await loadThoughts();
    } catch (err) {
      console.error('Failed to create thought:', err);
    }
  };

  const deleteThought = async (thoughtId) => {
    try {
      await manifest.from('Thought').delete(thoughtId);
      setThoughts(thoughts.filter(t => t.id !== thoughtId));
    } catch (err) {
      console.error('Failed to delete thought:', err);
    }
  }

  if (isLoading) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-900 font-sans text-white">
      <div className="fixed top-4 right-4 z-50 flex items-center space-x-2">
        <span className={`h-3 w-3 rounded-full ${backendConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
        <span className="text-xs text-gray-300">{backendConnected ? 'API Connected' : 'API Disconnected'}</span>
      </div>
      
      {currentUser ? (
        <DashboardPage
          user={currentUser}
          thoughts={thoughts}
          onLogout={handleLogout}
          onLoadThoughts={loadThoughts}
          onCreateThought={createThought}
          onDeleteThought={deleteThought}
        />
      ) : (
        <LandingPage onLogin={handleLogin} onSignup={handleSignup} />
      )}
    </div>
  );
}

export default App;
