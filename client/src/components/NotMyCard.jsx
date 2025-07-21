import { assets } from "../assets/assets";

const NotMyCard = ({ 
  title = "No Card Found", 
  message = "You don't have any cards saved yet.", 
  showAddButton = true,
  onAddCard,
  className = "" 
}) => {
  return (
    <div className={`border border-gray-500/20 rounded-md p-6 bg-white text-center ${className}`}>
      <div className="flex flex-col items-center justify-center space-y-4">
        {/* Card Icon */}
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
          <svg 
            className="w-8 h-8 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" 
            />
          </svg>
        </div>
        
        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-700">
          {title}
        </h3>
        
        {/* Message */}
        <p className="text-gray-500/60 text-sm max-w-xs">
          {message}
        </p>
        
        {/* Add Card Button */}
        {showAddButton && (
          <button
            onClick={onAddCard}
            className="flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-md font-medium transition-colors duration-200"
          >
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
              />
            </svg>
            Add New Card
          </button>
        )}
      </div>
    </div>
  );
};

export default NotMyCard; 