
import React, { useState } from 'react';
import { Message, Role } from '../types';
import CoverageCard from './CoverageCard';
import ProcedureListCard from './ProcedureListCard';

// TypeScript declarations for global variables from script tags in index.html
declare var marked: { parse: (text: string) => string };
declare var DOMPurify: { sanitize: (html: string) => string };

const AssistantIcon = () => (
    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
        PP
    </div>
);

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-slate-500" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
);


const ChatMessage: React.FC<{ message: Message }> = ({ message }) => {
    const isAssistant = message.role === Role.ASSISTANT;
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(message.content).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
        });
    };
    
    const wrapperClasses = isAssistant
        ? 'flex items-start gap-3 justify-start'
        : 'flex items-start gap-3 justify-end';

    const bubbleClasses = isAssistant
        ? 'bg-white text-black rounded-r-xl rounded-bl-xl'
        : 'bg-green-500 text-white rounded-l-xl rounded-br-xl';
    
    const renderContent = () => {
        if (isAssistant) {
             // Ensure marked and DOMPurify are available (from script tags in index.html)
            if (typeof marked?.parse === 'function' && typeof DOMPurify?.sanitize === 'function') {
                const rawMarkup = marked.parse(message.content);
                // Basic styling for lists and other elements
                const styledMarkup = rawMarkup
                    .replace(/<ul>/g, '<ul class="list-disc list-inside pl-2">')
                    .replace(/<ol>/g, '<ol class="list-decimal list-inside pl-2">');
                const cleanMarkup = DOMPurify.sanitize(styledMarkup);
                return <div className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: cleanMarkup }} />;
            }
        }
        return <p className="text-sm leading-relaxed">{message.content}</p>;
    };

    return (
        <div className={wrapperClasses}>
            {isAssistant && <AssistantIcon />}
            <div className={`relative group p-4 max-w-md md:max-w-lg shadow-sm ${bubbleClasses}`}>
                {renderContent()}
                {message.cardData && <CoverageCard data={message.cardData} />}
                {message.procedureListData && <ProcedureListCard data={message.procedureListData} />}
                {message.citations && message.citations.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-300/50">
                        <h4 className="text-xs font-bold mb-2 text-slate-600">Sources:</h4>
                        <ol className="list-decimal list-inside space-y-1">
                            {message.citations.map((citation, index) => (
                                <li key={index} className="text-xs">
                                    <a 
                                        href={citation.uri} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline break-all"
                                    >
                                        {citation.title}
                                    </a>
                                </li>
                            ))}
                        </ol>
                    </div>
                )}
                {isAssistant && (
                    <button 
                        onClick={handleCopy} 
                        className="absolute -top-2 -right-2 p-1.5 bg-white border rounded-full text-slate-500 hover:bg-slate-100 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                        aria-label="Copy message"
                    >
                        {isCopied ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        )}
                    </button>
                )}
            </div>
            {!isAssistant && <UserIcon />}
        </div>
    );
};

export default ChatMessage;