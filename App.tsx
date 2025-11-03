
import React, { useState, useRef, useEffect } from 'react';
import { Message, Role } from './types';
import { INITIAL_MESSAGE } from './constants';
import { runChat, resetChat } from './services/geminiService';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import ProcedureListCard from './components/ProcedureListCard';

const App: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>(() => {
        try {
            const savedHistory = localStorage.getItem('chatHistory');
            if (savedHistory) {
                const parsedHistory = JSON.parse(savedHistory);
                if (Array.isArray(parsedHistory) && parsedHistory.length > 0) {
                    return parsedHistory;
                }
            }
        } catch (error) {
            console.error("Failed to parse chat history from localStorage", error);
        }
        return [INITIAL_MESSAGE];
    });

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        try {
            localStorage.setItem('chatHistory', JSON.stringify(messages));
        } catch (error) {
            console.error("Failed to save chat history to localStorage", error);
        }
    }, [messages]);

    const handleSendMessage = async (userInput: string) => {
        const newUserMessage: Message = { role: Role.USER, content: userInput };
        setMessages(prevMessages => [...prevMessages, newUserMessage]);
        setIsLoading(true);
        
        let newAssistantMessage: Message;

        try {
            const { responseText, cardData, procedureListData, citations } = await runChat(userInput);

            newAssistantMessage = {
                role: Role.ASSISTANT,
                content: responseText,
                cardData,
                procedureListData,
                citations,
            };

        } catch (error) {
             const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
             newAssistantMessage = { role: Role.ASSISTANT, content: errorMessage };
        }

        setMessages(prev => [...prev, newAssistantMessage]);
        setIsLoading(false);
    };

    const handleNewChat = () => {
        setIsLoading(false);
        setMessages([INITIAL_MESSAGE]);
        resetChat();
        localStorage.removeItem('chatHistory');
    };

    return (
        <div className="h-screen w-screen flex flex-col font-sans max-w-3xl mx-auto bg-slate-50 shadow-2xl">
            <header className="p-4 bg-white border-b border-slate-200 flex items-center justify-between gap-4 sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-xl">
                        PP
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800">PolicyPal</h1>
                        <p className="text-sm text-slate-500">Your Health Coverage Assistant</p>
                    </div>
                </div>
                <button 
                    onClick={handleNewChat}
                    className="px-3 py-1.5 border border-slate-300 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                >
                    New Chat
                </button>
            </header>
            <main className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-100">
                {messages.map((msg, index) => (
                    <ChatMessage key={index} message={msg} />
                ))}
                {isLoading && (
                    <div className="flex items-start gap-3 justify-start">
                        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                            PP
                        </div>
                        <div className="p-4 max-w-md md:max-w-lg shadow-sm bg-white text-slate-700 rounded-r-xl rounded-bl-xl flex items-center gap-3">
                           <div className="flex items-center gap-2">
                               <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                               <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                               <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                           </div>
                           <span className="text-sm text-slate-500">PolicyPal is typing...</span>
                        </div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </main>
            <footer className="sticky bottom-0">
                 <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
            </footer>
        </div>
    );
};

export default App;