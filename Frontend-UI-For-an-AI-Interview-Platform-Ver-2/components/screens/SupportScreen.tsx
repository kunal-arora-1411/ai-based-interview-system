import React, { useState, useEffect, useRef } from 'react';
import { ScreenProps } from '../../types';

interface Message {
    text: string;
    sender: 'user' | 'ai';
}

const FaqItem: React.FC<{ question: string; children: React.ReactNode }> = ({ question, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-slate-500/20">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center py-4 text-left">
                <span className="font-semibold">{question}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    <polyline points="6 9 12 15 18 9"/>
                </svg>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
                <div className="pb-4 text-slate-700 dark:text-slate-400">{children}</div>
            </div>
        </div>
    );
}

const SupportScreen: React.FC<ScreenProps> = ({ navigate }) => {
    const [messages, setMessages] = useState<Message[]>([
        { sender: 'ai', text: "Hello! I'm the AI Assistant. How can I help you today?" }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messageListRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (messageListRef.current) {
            messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const getBotResponse = (userInput: string): string => {
        const lowerInput = userInput.toLowerCase();
        if (lowerInput.includes('billing') || lowerInput.includes('payment') || lowerInput.includes('subscription')) {
            return "For any billing or subscription questions, please check your account settings under 'Profile'. If you need more help, our support team can be reached via email at support@example.com.";
        }
        if (lowerInput.includes('password') || lowerInput.includes('reset')) {
            return "You can reset your password from the login screen by clicking 'Forgot Password?'. You can also change it in your 'Profile & Settings' page.";
        }
        return "I'm sorry, I'm not equipped to handle that question. For more complex issues, please email our support team and they'll get back to you within 24 hours.";
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedInput = inputValue.trim();
        if (!trimmedInput) return;

        const newUserMessage: Message = { text: trimmedInput, sender: 'user' };
        setMessages(prev => [...prev, newUserMessage]);
        setInputValue('');
        setIsTyping(true);

        setTimeout(() => {
            const botResponseText = getBotResponse(trimmedInput);
            const newAiMessage: Message = { text: botResponseText, sender: 'ai' };
            setMessages(prev => [...prev, newAiMessage]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <div className="p-4 md:p-8 h-full overflow-y-auto">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold">Support Center</h1>
                    <p className="text-slate-700 dark:text-slate-400">How can we help you today?</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* FAQ Section */}
                    <div className="glass-card shadow-glass-glow p-6">
                        <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
                        <div className="space-y-2">
                            <FaqItem question="How does the AI tailor questions?">
                                Our AI analyzes the CV you upload and the job description you provide. It identifies key skills, experiences, and requirements to generate interview questions that are highly relevant to the specific role and your background.
                            </FaqItem>
                             <FaqItem question="What aspects of my answer are analyzed?">
                                The AI focuses on the content and structure of your answer. It looks for clarity, conciseness, technical accuracy, and the application of frameworks like the STAR method for behavioral questions. It does not analyze your voice tone, sentiment, or video.
                            </FaqItem>
                             <FaqItem question="Can I use this for non-technical roles?">
                                Absolutely! While it's great for technical interviews, the AI is trained to handle a wide range of roles, including product management, design, marketing, and more. The feedback on structure and clarity is valuable for any professional interview.
                            </FaqItem>
                             <FaqItem question="How is my data protected?">
                                We take data privacy seriously. Your CV and interview data are encrypted and used solely for the purpose of generating questions and feedback for you. We do not share your data with third parties.
                            </FaqItem>
                        </div>
                    </div>
                    {/* Chatbot Section */}
                    <div className="glass-card shadow-glass-glow p-6 flex flex-col min-h-[500px]">
                        <h2 className="text-xl font-bold mb-4">Instant Help</h2>
                        <div className="chat-window">
                            <div ref={messageListRef} className="message-list">
                                {messages.map((msg, index) => {
                                    if (msg.sender === 'user') {
                                        return (
                                            <div key={index} className="chat-bubble chat-bubble-user">
                                                {msg.text}
                                            </div>
                                        );
                                    }
                                    return (
                                        <div key={index} className="flex items-end gap-3 max-w-[85%]">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-yellow-400 flex-shrink-0 flex items-center justify-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
                                            </div>
                                            <div className="chat-bubble chat-bubble-ai">
                                                {msg.text}
                                            </div>
                                        </div>
                                    );
                                })}
                                {isTyping && (
                                     <div className="flex items-end gap-3 max-w-[85%]">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-yellow-400 flex-shrink-0 flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
                                        </div>
                                        <div className="chat-bubble chat-bubble-ai">
                                            <div className="typing-indicator"><span></span><span></span><span></span></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <form onSubmit={handleSendMessage} className="mt-4 flex gap-2">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Ask a question..."
                                    className="block w-full rounded-full border-0 bg-slate-500/10 py-2.5 px-4 shadow-sm ring-1 ring-inset ring-slate-500/20 focus:ring-2 focus:ring-inset focus:ring-amber-500 transition"
                                />
                                <button type="submit" className="btn-primary p-3 flex-shrink-0 flex items-center justify-center" style={{width: '50px', height: '50px'}}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2 11 13"/><path d="m22 2-7 20-4-9-9-4 20-7z"/></svg>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupportScreen;