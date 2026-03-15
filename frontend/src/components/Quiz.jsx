import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ChevronLeft, Loader2 } from 'lucide-react';
import Questions from './Questions';

export default function QuizPlay() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inQuiz, setInQuiz] = useState(false);
  const [quizDone, setQuizDone] = useState(false);
  const [score, setScore] = useState(0);
  const [loggedin, setLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      setLoggedIn(false);
    } else {
      setLoggedIn(true);
    }

    const fetchQuizData = async () => {
      try {
        const response = await fetch(`/api/quiz/${id}`);
        if (!response.ok) {
            console.log("Failed to load quiz data:", response.statusText);
            throw new Error('Failed to load quiz data');
            return;
        };
        const data = await response.json();
        setQuiz(data);
      } catch (error) {
        console.error("Error loading quiz:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizData();
  }, [id]);

  const handleQuizFinish = async (score) => {

    const saveScore = async () => {
      try {
        const response = await fetch('/api/attempts/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: localStorage.getItem('user')?.replace(/['"]+/g, ''),
            quizId: quiz.id,
            score: score
          })
        });

        const data = await response.json();
        setQuiz(data);
      } catch (error) {
        console.error("Error saving score:", error);
      }
    };

    await saveScore();

    setScore(score);
    setInQuiz(false); 
    setQuizDone(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-yellow-500" size={48} />
      </div>
    );
  }

  if (!quiz) return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto flex items-center justify-between mb-8">
        <button 
          onClick={() => navigate('/home')}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ChevronLeft size={20} /> Back to Dashboard
        </button>
      </div>

      <div className="p-10 text-center">Quiz not found.</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center justify-start">
      <div className="w-3xl flex items-center justify-between mb-8">
        <button 
          onClick={() => navigate('/home')}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
        >
          <ChevronLeft size={20} /> Back to Dashboard
        </button>
      </div>


      {!inQuiz ? (
        <>
        {!quizDone ? (
          <div className="w-2xl mx-auto bg-white rounded-2xl p-8 border border-gray-100">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">
                {quiz.name}
              </h1>
              <p className="text-gray-600 mb-8">
                This quiz contains 5 questions, for a maximum of 5 points. You cannot go back once you submit an answer. Good luck!
              </p>
              <button onClick={() => setInQuiz(true)} className="w-full py-4 bg-yellow-500 text-white rounded-2xl font-bold hover:bg-yellow-600 transition-all cursor-pointer">
                Begin Quiz
              </button>
          </div>
        ) : (
          <div className="w-2xl mx-auto bg-white rounded-2xl p-8 border border-gray-100">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">
                Your Score: {score} / 5 pts
              </h1>
              {!loggedin ? (<p className="text-gray-600 mb-8">
                Log in to save your score and appear on the leaderboard!
              </p>) : (
                <p className="text-gray-600 mb-8">
                Your score has been saved. Check out the leaderboard below!
              </p>
              )}
              <button onClick={() => navigate('/home')} className="w-full py-4 bg-yellow-500 text-white rounded-2xl font-bold hover:bg-yellow-600 transition-all cursor-pointer">
                Home
              </button>
          </div>
        )}

        <div className="w-2xl mt-8">
          <div className="flex items-center gap-2 mb-4 px-2">
            <h2 className="text-xl font-bold text-gray-800">Leaderboard</h2>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100">
            {quiz.attempts && quiz.attempts.length > 0 ? (
                <div className="divide-y divide-gray-50">
                {quiz.attempts
                    .sort((a, b) => b.score - a.score)
                    .map((attempt, index) => (
                    <div key={attempt.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                            index === 0 ? 'bg-yellow-100 text-yellow-600' : 
                            index === 1 ? 'bg-gray-100 text-gray-600' : 
                            index === 2 ? 'bg-orange-50 text-orange-600' : 'text-gray-400'
                            }`}>
                            {index + 1}
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900">{attempt.user?.name || 'Anonymous'}</p>
                            <p className="text-xs text-gray-400">{new Date(attempt.startedAt).toLocaleDateString()}</p>
                        </div>
                        </div>
                        <div className="text-right">
                        <span className="text-lg font-black text-gray-900">{attempt.score}</span>
                        <span className="text-xs text-gray-400 ml-1">/5 pts</span>
                        </div>
                    </div>
                ))}
                </div>
            ) : (
                <div className="p-8 text-center">
                    <p className="text-gray-400 italic">No attempts yet.</p>
                </div>
            )}
            </div>
        </div>
        </>
      ) : (
        <Questions quiz={quiz} onFinish={handleQuizFinish}/>
      )}
    </div>
  );
}