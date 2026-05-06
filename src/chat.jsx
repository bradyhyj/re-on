import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, User, MessageCircle, Sparkles, ChevronLeft } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function Chat({ onBack }) {
    const [messages, setMessages] = useState([
        { id: 1, role: 'ai', text: '안녕하세요! 대구 청년들을 위한 AI 멘탈 케어 챗봇입니다. 😊', time: '오후 2:30' },
        { id: 2, role: 'ai', text: '요즘 마음이 어떠신가요? 누구에게도 말하지 못한 고민이 있다면 편하게 들려주세요. 모든 대화는 익명으로 안전하게 보호됩니다.', time: '오후 2:30' }
    ]);
    const [input, setInput] = useState('');
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMsg = {
            id: Date.now(),
            role: 'user',
            text: input,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');

        // Simulate AI response
        setTimeout(() => {
            const aiMsg = {
                id: Date.now() + 1,
                role: 'ai',
                text: '이야기해주셔서 감사합니다. 당신의 마음을 충분히 이해해요. 그런 감정을 느끼는 것은 아주 자연스러운 일입니다. 조금 더 구체적으로 말씀해주실 수 있을까요?',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, aiMsg]);
        }, 1000);
    };

    return (
        <div className="flex flex-col h-full w-full bg-[#F8F9FA] text-[#111] overflow-hidden fixed inset-0 z-[200]">
            {/* Header */}
            <div className="flex items-center justify-between px-4 pt-5 pb-4 bg-white border-b border-[#F0F0F0] shrink-0">
                <button onClick={onBack} className="p-2 text-[#666] hover:text-[#111] transition-colors">
                    <ChevronLeft size={24} />
                </button>
                <div className="flex flex-col items-center">
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
                        <span className="text-[16px] font-bold">AI 고민 상담소</span>
                    </div>
                    <span className="text-[11px] text-[#999]">Gemini 1.5 Flash 연동 중</span>
                </div>
                <div className="w-10"></div>
            </div>

            {/* Chat Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-6 space-y-6 scroll-smooth">
                <div className="flex justify-center mb-4">
                    <div className="px-4 py-1.5 bg-[#F0F0F0] rounded-full text-[11px] text-[#888] font-medium">
                        오늘
                    </div>
                </div>

                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2`}>
                        {msg.role === 'ai' && (
                            <div className="w-8 h-8 rounded-full bg-[#16A34A] flex items-center justify-center text-white shrink-0 mb-1">
                                <Sparkles size={16} />
                            </div>
                        )}
                        
                        <div className="flex flex-col max-w-[75%]">
                            {msg.role === 'ai' && <span className="text-[11px] text-[#999] ml-1 mb-1 font-medium">다시:ON AI</span>}
                            <div className={`px-4 py-3 rounded-[20px] text-[14px] leading-[1.6] shadow-sm
                                ${msg.role === 'user' 
                                    ? 'bg-[#16A34A] text-white rounded-br-none' 
                                    : 'bg-white text-[#111] border border-[#F0F0F0] rounded-bl-none'}`}>
                                {msg.text}
                            </div>
                        </div>

                        <span className="text-[10px] text-[#CCC] mb-1 whitespace-nowrap">{msg.time}</span>
                    </div>
                ))}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-[#F0F0F0] shrink-0 pb-safe">
                <div className="flex items-center gap-2 bg-[#F8F9FA] border border-[#E5E7EB] rounded-[24px] px-4 py-2 focus-within:border-[#16A34A] transition-colors">
                    <input 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="고민을 입력해보세요..."
                        className="flex-1 bg-transparent border-none outline-none text-[14px] py-2 placeholder-[#BBB]"
                    />
                    <button 
                        onClick={handleSend}
                        disabled={!input.trim()}
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all
                            ${input.trim() ? 'bg-[#16A34A] text-white' : 'bg-[#E5E7EB] text-[#CCC]'}`}>
                        <Send size={18} />
                    </button>
                </div>
            </div>
            <style>{`.pb-safe { padding-bottom: max(env(safe-area-inset-bottom), 16px); }`}</style>
        </div>
    );
}
