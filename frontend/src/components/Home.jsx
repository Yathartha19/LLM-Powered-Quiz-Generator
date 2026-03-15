import React, { useEffect, useState } from 'react';
import { LogOut, X, Pencil, Save } from 'lucide-react';
import { useNavigate } from 'react-router';
import Quizzcard from './Quizcard';

export default function QuizHome() {
  const [newQuizTopic, setNewQuizTopic] = useState('');
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null); 
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userData, setUserData] = useState({ name: '', email: '' });
  const navigate = useNavigate();
  const [isEditingQuiz, setIsEditingQuiz] = useState(false);
  const [quizName, setQuizName] = useState('');
  const [quizDesc, setQuizDesc] = useState('');

  useEffect(() => {
    const isAuth = localStorage.getItem('isAuthenticated');
    const userId = localStorage.getItem('user')?.replace(/['"]+/g, '');

    const fetchData = async () => {
      try {
        const response = await fetch(`/api/auth/user/${userId}`);
        const data = await response.json();
        setUserData({ name: data.name, email: data.email });
        setQuizzes(data.quizzes || []);
      } catch (err) { console.error("Fetch error:", err); }
    };

    if (isAuth === 'true' && userId) {
      fetchData();
    } else {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    if (selectedQuiz) {
      setQuizName(selectedQuiz.name);
      setQuizDesc(selectedQuiz.description);
      setIsEditingQuiz(false);
    }
  }, [selectedQuiz]);

  const handleCreateQuiz = async () => {
    if (!newQuizTopic.trim()) return;
    const userId = localStorage.getItem('user')?.replace(/['"]+/g, '');
    const response = await fetch('/api/quiz/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: `Quiz ${quizzes.length + 1}`,
        description: newQuizTopic,
        creatorId: userId
      })
    });
    const data = await response.json();
    setQuizzes(data);
    setNewQuizTopic('');
    setSelectedQuiz(data[data.length - 1]);
  };

  const handleDelete = async (id) => {
    const userId = localStorage.getItem('user')?.replace(/['"]+/g, '');
    const response = await fetch('/api/quiz/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, creatorId: userId })
    });
    const data = await response.json();
    setQuizzes(data);
  };

  const updateQuiz = async (newName, newDesc) => {
    const userId = localStorage.getItem('user')?.replace(/['"]+/g, '');
    const response = await fetch('/api/quiz/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: selectedQuiz.id,
        name: newName,
        description: newDesc,
        creatorId: userId
      })
    });
    setIsEditingQuiz(false);
    const data = await response.json();
    setQuizzes(data);
    setSelectedQuiz({ ...selectedQuiz, name: newName, description: newDesc });
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 relative overflow-x-hidden">

      <div className='absolute top-0 p-4 w-full h-[10vh] flex flex-row items-center justify-between z-30'>
        <button 
          onClick={() => {
            localStorage.clear();
            navigate('/login');
          }} 
          className="text-sm border border-red-700 text-red-700 hover:bg-red-700 hover:text-white px-3 py-2 rounded-md transition cursor-pointer flex items-center gap-2"
        >
          <LogOut size={16} className="rotate-180"/> Logout
        </button>

        <div className="relative">
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="w-10 h-10 bg-yellow-500 rounded-md flex items-center justify-center shadow-sm text-white uppercase font-bold cursor-pointer"
          >
            {userData.name ? userData.name[0] : '?'}
          </button>

          {isProfileOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)}></div>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-20">
                <div className="px-4 py-2">
                  <p className="text-md font-bold text-gray-900 truncate">{userData.name}</p>
                  <p className="text-sm text-gray-500 truncate">{userData.email}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="pt-[15vh] pb-12 px-6 flex flex-col items-center">
        <div className="w-full max-w-5xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Welcome back, {userData.name}!</h1>
            <p className="text-gray-500 text-lg">Enter a topic to generate a new quiz.</p>
          </div>

          <div className="flex justify-center mb-16">
            <div className="flex w-full max-w-2xl bg-white shadow-sm rounded-xl overflow-hidden border border-gray-300 focus-within:ring-2 focus-within:ring-yellow-500 transition-all">
              <input
                type="text"
                className="grow px-5 py-4 outline-none text-gray-700"
                placeholder="e.g., React Hooks, Science, History..."
                value={newQuizTopic}
                onChange={(e) => setNewQuizTopic(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateQuiz()}
              />
              <button onClick={handleCreateQuiz} className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold px-8 py-4 cursor-pointer">
                Create Quiz
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Your Quizzes</h2>
            <span className="text-sm font-medium text-gray-500 bg-gray-200 px-3 py-1 rounded-full">{quizzes.length} Total</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quizzes.map((quiz) => (
              <Quizzcard 
                key={quiz.id} 
                quiz={quiz} 
                handleDelete={handleDelete} 
                onClick={setSelectedQuiz} 
              />
            ))}
          </div>
        </div>
      </div>

      {selectedQuiz && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedQuiz(null)}></div>

          <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">

            <div className="bg-yellow-500 p-8 text-white">
               <div className="flex justify-between items-start">

                  {isEditingQuiz ? (
                    <div className='flex items-row justify-start'>
                      <input 
                        value={quizName}
                        onChange={(e) => setQuizName(e.target.value)}
                        className="text-3xl font-black bg-transparent border-b-2 border-white/50 outline-none"
                        autoFocus
                      />
                      <button 
                        onClick={() => updateQuiz(quizName, quizDesc)} 
                        className="hover:bg-white/20 p-2 rounded-full transition-colors cursor-pointer"
                      >
                        <Save size={20}/>
                      </button>
                    </div>
                  ) : (
                    <div className='flex items-row justify-start'>
                      <h2 className="text-3xl font-black">{selectedQuiz.name}</h2>
                      <button 
                        onClick={() => setIsEditingQuiz(true)} 
                        className="hover:bg-white/20 p-2 rounded-full transition-colors cursor-pointer"
                      >
                        <Pencil size={20}/>
                      </button>
                    </div>
                  )}

                  <button onClick={() => setSelectedQuiz(null)} className="hover:bg-white/20 p-1 rounded-full cursor-pointer"><X size={24}/></button>
               </div>
            </div>
            
            <div className="p-8 pb-2">
              
              <h4 className="text-xs uppercase font-bold text-gray-400 mb-2">Description</h4>
              {isEditingQuiz ? (
                    <div className='flex items-row justify-start text-gray-700'>
                      <input 
                        value={quizDesc}
                        onChange={(e) => setQuizDesc(e.target.value)}
                        className="text-gray-700 bg-transparent border-b-2 border-gray-700/50 outline-none"
                        autoFocus
                      />
                    </div>
                  ) : (
                    <div className='flex items-row justify-start text-gray-700 mb-8'>
                      <p className="text-gray-700">{selectedQuiz.description}</p>
                    </div>
                  )}
            </div>

            <div className="mb-8 px-8">
              <label className="text-xs uppercase font-bold text-gray-400 mb-2 block tracking-widest">
                Share Quiz
              </label>
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl p-1 pr-3 focus-within:border-yellow-500 transition-colors">
                <input 
                  type="text" 
                  readOnly
                  value={`${window.location.origin}/quiz/${selectedQuiz.id}`}
                  className="grow bg-transparent px-3 py-2 text-sm text-gray-600 outline-none cursor-pointer"
                  onClick={(e) => {
                    e.target.select();

                    const url = `${window.location.origin}/quiz/${selectedQuiz.id}`;
                    navigator.clipboard.writeText(url);
                    
                    navigate(`/quiz/${selectedQuiz.id}`);
                  }}
                />
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/quiz/${selectedQuiz.id}`);
                  }}
                  className="text-gray-400 hover:text-yellow-600 transition-colors p-1 cursor-pointer"
                  title="Copy Link"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                </button>
              </div>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}