import React, { useEffect, useState } from 'react';
import config from '../constants.js';

const DashboardPage = ({ user, thoughts, onLogout, onLoadThoughts, onCreateThought, onDeleteThought }) => {
  const [newThought, setNewThought] = useState({ title: '', content: '', category: 'Philosophy' });

  useEffect(() => {
    onLoadThoughts();
  }, []);

  const handleCreateThought = (e) => {
    e.preventDefault();
    onCreateThought(newThought);
    setNewThought({ title: '', content: '', category: 'Philosophy' });
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white">Cosmic Feed</h1>
            <p className="text-slate-400">Welcome, {user.name}!</p>
          </div>
          <div className="flex items-center space-x-4">
             <a href={`${config.BACKEND_URL}/admin`} target="_blank" rel="noopener noreferrer" className="text-sm text-slate-400 hover:text-white">Admin</a>
            <button onClick={onLogout} className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">Logout</button>
          </div>
        </header>

        <div className="bg-slate-800 p-6 rounded-lg shadow-xl mb-10">
          <h2 className="text-xl font-semibold mb-4 text-white">Post a new thought...</h2>
          <form onSubmit={handleCreateThought} className="space-y-4">
            <input
              type="text"
              placeholder="Title of your musing..."
              value={newThought.title}
              onChange={(e) => setNewThought({ ...newThought, title: e.target.value })}
              className="w-full p-3 bg-slate-700 rounded border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              required
            />
            <textarea
              placeholder="What's on your mind, great thinker?"
              value={newThought.content}
              onChange={(e) => setNewThought({ ...newThought, content: e.target.value })}
              className="w-full p-3 bg-slate-700 rounded border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white h-24"
              required
            />
             <select 
                value={newThought.category} 
                onChange={(e) => setNewThought({ ...newThought, category: e.target.value })}
                className="w-full p-3 bg-slate-700 rounded border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
             >
                <option>Physics</option>
                <option>Mathematics</option>
                <option>Philosophy</option>
                <option>Astronomy</option>
            </select>
            <button type="submit" className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Publish Thought
            </button>
          </form>
        </div>

        <div className="space-y-6">
          {thoughts.length > 0 ? (
            thoughts.map(thought => (
              <div key={thought.id} className="bg-slate-800 p-6 rounded-lg shadow-lg relative">
                <div className="flex justify-between items-start">
                   <div>
                     <h3 className="font-bold text-xl text-white">{thought.title}</h3>
                     <p className="text-sm text-slate-400 mb-4">by {thought.owner?.name || 'an unknown thinker'} in <span className='font-medium text-slate-300'>{thought.category}</span></p>
                   </div>
                  {user.id === thought.owner?.id && (
                     <button onClick={() => onDeleteThought(thought.id)} className='text-slate-500 hover:text-red-500 text-xs'>Delete</button>
                  )}
                </div>
                <div className="prose prose-invert prose-sm text-slate-300" dangerouslySetInnerHTML={{ __html: thought.content }}></div>
              </div>
            ))
          ) : (
            <p className="text-center text-slate-500">The cosmos is quiet... No thoughts have been posted yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
