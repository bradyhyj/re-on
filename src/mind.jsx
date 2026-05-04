import { motion } from 'framer-motion';
import { ChevronLeft, Heart, MessageCircle, PhoneCall, CalendarHeart, ArrowRight, User } from 'lucide-react';

export default function Mind({ onBack, onProfile }) {
    return (
        <div className="flex flex-col h-full w-full bg-[#F8F9FA] text-[#111] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-4 bg-white sticky top-0 z-20 border-b border-[#F0F0F0]">
                <div className="w-[60px]"></div>
                <div className="text-[17px] font-bold">심리 회복</div>
                <button 
                    onClick={onProfile}
                    className="w-[60px] flex justify-end text-[#666] hover:text-[#111] transition-colors"
                >
                    <User size={22} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto pb-24">
                {/* Hero */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 0.5 }}
                    className="bg-[#F0FDF4] px-6 py-8"
                >
                    <div className="w-14 h-14 rounded-[16px] bg-[#16A34A] flex items-center justify-center text-white mb-5 shadow-[0_4px_12px_rgba(22,163,74,0.3)]">
                        <Heart size={28} />
                    </div>
                    <h1 className="text-[26px] font-extrabold text-[#111] leading-[1.3] mb-3 tracking-tight break-keep">
                        지친 마음을<br/>다독이는 시간
                    </h1>
                    <p className="text-[14px] text-[#16A34A] font-bold">
                        혼자 견디지 마세요. 언제든 도와드릴게요.
                    </p>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    transition={{ delay: 0.2 }}
                    className="px-6 py-8 flex flex-col gap-6"
                >
                    {/* Chatbot Card */}
                    <div className="bg-[#111] text-white p-7 rounded-[28px] relative overflow-hidden shadow-xl cursor-pointer hover:scale-[1.02] transition-transform">
                        <div className="relative z-10">
                            <div className="inline-block px-3 py-1 bg-white/20 rounded-full text-[11px] font-bold mb-4 backdrop-blur-md">
                                24시간 언제나
                            </div>
                            <h2 className="text-[20px] font-bold mb-3">AI 익명 고민 상담소</h2>
                            <p className="text-[14px] text-[#A1A1AA] leading-[1.6] mb-8 break-keep">
                                누구에게도 말하기 힘든 고민이 있다면<br/>AI 멘탈 케어 챗봇과 편하게 대화해보세요.
                            </p>
                            <button className="bg-white text-[#111] px-6 py-3.5 rounded-full text-[15px] font-bold flex items-center gap-2 shadow-lg">
                                <MessageCircle size={18} fill="currentColor" /> 대화 시작하기
                            </button>
                        </div>
                        <MessageCircle size={140} className="absolute -right-10 -bottom-10 text-white/[0.03] rotate-12" />
                    </div>

                    {/* Offline Consultation Card */}
                    <div className="bg-white p-6 rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-black/[0.02]">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center">
                                <CalendarHeart size={20} />
                            </div>
                            <h2 className="text-[18px] font-bold text-[#111]">대구 청년마음건강지원</h2>
                        </div>
                        <p className="text-[14px] text-[#666] leading-[1.6] mb-6 break-keep font-medium">
                            대구시에서 지원하는 무료 전문 심리 상담 프로그램입니다. 1:1 대면 상담을 통해 마음을 치유하세요.
                        </p>
                        <div className="flex gap-2">
                            <button className="flex-1 py-4 bg-[#F8F9FA] text-[#111] rounded-[16px] text-[15px] font-bold flex justify-center items-center gap-2 border border-[#E5E7EB] hover:bg-[#F3F4F6] transition-colors">
                                상세 보기
                            </button>
                            <button className="flex-1 py-4 bg-[#16A34A] text-white rounded-[16px] text-[15px] font-bold flex justify-center items-center gap-2 shadow-md hover:bg-[#15803d] transition-colors">
                                <PhoneCall size={18} /> 예약하기
                            </button>
                        </div>
                    </div>

                    <div className="mt-4 flex items-center justify-center p-4 bg-[#F9FAFB] rounded-[16px] border border-[#F3F4F6] cursor-pointer hover:bg-[#F3F4F6] transition-colors">
                        <span className="text-[14px] font-medium text-[#666]">나의 멘탈 케어 성장 타임라인 보기</span>
                        <ArrowRight size={16} className="ml-2 text-[#999]" />
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
