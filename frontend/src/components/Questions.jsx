import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronRight, Home } from 'lucide-react';

const Questions = ( { quiz, onFinish } ) => {
  const navigate = useNavigate();  
  const quizData = quiz
  const [questions, setQuestions] = useState([])
  const [currentQn, setCurrentQn] = useState(null);
  const [score, setScore] = useState(0)
  const [qncounter, setQncounter] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    handleNext();
  }, []);

  const handleNext = async  () => {

    if ( questions.length > 0 && selectedOption === questions[questions.length - 1].answer ) {
      setScore(prev => prev + 1)
    }

    if (questions.length === 5) {
        onFinish(score);
        return;
    }

    try {
      const response = await fetch('/api/quiz/next', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quiz: quizData,
          qns: questions,
          userid: localStorage.getItem('user')?.replace(/['"]+/g, '')
        })
      });

      console.log("Request payload:", {
        quiz: quizData,
        qns: questions,
        userid: localStorage.getItem('user')?.replace(/['"]+/g, '')
      });

      const data = await response.json();

      setQuestions(data)

      const nextQn = data[data.length - 1]; 
      setCurrentQn(nextQn);

      setSelectedOption(null);
      setQncounter(data.length);

    } catch (error) {
      console.error("Error fetching next question:", error);
      return;
    }
  };

  if (!currentQn) {
    return <div className="flex items-center justify-center h-screen">Loading your quiz...</div>;
  }

  return (
    <div className="bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-xl w-full bg-white rounded-2xl p-8 border border-gray-100">

        <div className="mb-8">
          <span className="text-xs font-bold text-yellow-600 uppercase tracking-widest">
            Question {questions.length} of 5
          </span>
          <h2 className="text-2xl font-bold text-gray-900 mt-2">
            {currentQn.question}
          </h2>
        </div>

        <div className="space-y-3 mb-8">
          {currentQn.options.map((option, index) => (
            <button
              key={index}
              onClick={() => setSelectedOption(option)}
              className={`w-full p-4 rounded-2xl text-left border-2 transition-all duration-150 font-medium cursor-pointer ${
                selectedOption === option 
                ? 'border-yellow-500 bg-yellow-50 text-yellow-700' 
                : 'border-gray-100 hover:border-gray-200 text-gray-600'
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <button 
            onClick={handleNext}
            disabled={!selectedOption}
            className={`grow py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              selectedOption 
              ? 'bg-yellow-600 text-white hover:bg-yellow-700' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {qncounter === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Questions;