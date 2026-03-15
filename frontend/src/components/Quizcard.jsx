import { Trash2 } from 'lucide-react';

const Quizcard = ({ quiz, handleDelete, onClick }) => {
  return (
    <div className='group' onClick={() => onClick(quiz)}>
      <div className="cursor-pointer bg-white p-6 rounded-2xl border border-gray-200 shadow-sm group-hover:shadow-md group-hover:border-yellow-400 transition-all duration-200 flex flex-col justify-between h-42">
        <div>
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-xl text-gray-900 group-hover:text-yellow-600 transition-colors truncate pr-2 w-3/4">
              {quiz.name}
            </h3>
          </div>
          <p className="text-sm text-gray-600 line-clamp-3 mt-2">
            {quiz.description}
          </p>
        </div>
        
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(quiz.id);
            }}
            className="text-red-500 hover:text-red-700 cursor-pointer transition-colors p-1"
          >
            <Trash2 size={20}/>
          </button>
          <button className="text-yellow-500 font-semibold group-hover:translate-x-1 transition-transform cursor-pointer">
            Start &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};

export default Quizcard;