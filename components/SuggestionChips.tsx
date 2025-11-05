
import React from 'react';

interface SuggestionChipsProps {
    onSuggestionClick: (suggestion: string) => void;
}

const suggestions = [
    "Is physiotherapy covered under the Gold/Family plan?",
    "What does the Silver/Individual plan cover?",
    "What are the symptoms of typhoid fever?",
];

const SuggestionChips: React.FC<SuggestionChipsProps> = ({ onSuggestionClick }) => {
    return (
        <div className="px-6 pb-4 flex flex-wrap gap-2 justify-start">
            <p className="w-full text-sm text-slate-500 mb-2">Try asking:</p>
            {suggestions.map((suggestion, index) => (
                <button
                    key={index}
                    onClick={() => onSuggestionClick(suggestion)}
                    className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-full text-sm font-medium hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                    {suggestion}
                </button>
            ))}
        </div>
    );
};

export default SuggestionChips;
