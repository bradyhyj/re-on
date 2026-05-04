import { motion } from 'framer-motion';
import { ChevronLeft, User, Bookmark, CheckCircle2, Heart, FileText, Settings, Bell, HelpCircle, ChevronRight, LogOut } from 'lucide-react';

export default function Profile({ onBack, onGoToResult }) {
    return (
        <div className="flex flex-col h-full w-full bg-[#F8F9FA] text-[#111] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-4 bg-white sticky top-0 z-20 border-b border-[#F0F0F0]">
                <div className="w-[60px]"></div>
                <div className="text-[17px] font-bold">마이페이지</div>
                <button
                    onClick={onBack}
                    className="w-[60px] flex justify-end text-[#666] hover:text-[#111] transition-colors"
                >
                    <span className="text-[15px] font-bold">닫기</span>
                </button>
            </div>

            <div className="flex-1 overflow-y-auto pb-10">
                {/* Profile Info */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="bg-white px-6 py-8 mb-3"
                >
                    <div className="flex items-center gap-5 mb-6">
                        <div className="w-20 h-20 rounded-[24px] bg-[#FFF5F0] text-[#FF5A00] flex items-center justify-center shadow-inner border border-[#FF5A00]/10">
                            <User size={36} strokeWidth={2} />
                        </div>
                        <div className="flex-1">
                            <h1 className="text-[22px] font-bold text-[#111] mb-1">김대구 님</h1>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F4F4F5] text-[#555] text-[12px] font-medium">
                                <span className="text-[14px]">☁️</span> 잠시 쉬어가는 중이에요
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="flex gap-3">
                        <div className="flex-1 bg-[#F8F9FA] rounded-[20px] p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-[#F0F0F0] transition-colors">
                            <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-[#4F46E5]">
                                <CheckCircle2 size={16} />
                            </div>
                            <div className="text-[12px] font-bold text-[#666]">진행 퀘스트</div>
                            <div className="text-[18px] font-extrabold text-[#111]">2개</div>
                        </div>
                        <div className="flex-1 bg-[#F8F9FA] rounded-[20px] p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-[#F0F0F0] transition-colors">
                            <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-[#FF5A00]">
                                <Bookmark size={16} />
                            </div>
                            <div className="text-[12px] font-bold text-[#666]">저장한 공고</div>
                            <div className="text-[18px] font-extrabold text-[#111]">5개</div>
                        </div>
                        <div className="flex-1 bg-[#F8F9FA] rounded-[20px] p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-[#F0F0F0] transition-colors">
                            <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-[#16A34A]">
                                <Heart size={16} />
                            </div>
                            <div className="text-[12px] font-bold text-[#666]">관심 정책</div>
                            <div className="text-[18px] font-extrabold text-[#111]">3개</div>
                        </div>
                    </div>
                </motion.div>

                {/* Settings Menu */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col gap-3 px-6 py-4"
                >
                    <div className="bg-white rounded-[24px] p-2 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                        <h2 className="text-[13px] font-bold text-[#999] px-4 py-3 pb-1">나의 진단 기록</h2>
                        <button
                            onClick={onGoToResult}
                            className="w-full flex items-center justify-between p-4 hover:bg-[#F8F9FA] rounded-[16px] transition-colors group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-[12px] bg-[#FFF5F0] text-[#FF5A00] flex items-center justify-center">
                                    <FileText size={20} />
                                </div>
                                <span className="text-[16px] font-bold text-[#333]">최근 맞춤 진단 결과 보기</span>
                            </div>
                            <ChevronRight size={20} className="text-[#CCC] group-hover:text-[#111] transition-colors" />
                        </button>
                        <button className="w-full flex items-center justify-between p-4 hover:bg-[#F8F9FA] rounded-[16px] transition-colors group">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-[12px] bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center">
                                    <Heart size={20} />
                                </div>
                                <span className="text-[16px] font-bold text-[#333]">멘탈 케어 다이어리</span>
                            </div>
                            <ChevronRight size={20} className="text-[#CCC] group-hover:text-[#111] transition-colors" />
                        </button>
                    </div>

                    <div className="bg-white rounded-[24px] p-2 shadow-[0_4px_20px_rgba(0,0,0,0.02)] mt-2">
                        <h2 className="text-[13px] font-bold text-[#999] px-4 py-3 pb-1">앱 설정</h2>
                        <button className="w-full flex items-center justify-between p-4 hover:bg-[#F8F9FA] rounded-[16px] transition-colors group">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-[12px] bg-[#F4F4F5] text-[#555] flex items-center justify-center">
                                    <Bell size={20} />
                                </div>
                                <span className="text-[16px] font-bold text-[#333]">알림 설정</span>
                            </div>
                            <ChevronRight size={20} className="text-[#CCC] group-hover:text-[#111] transition-colors" />
                        </button>
                        <button className="w-full flex items-center justify-between p-4 hover:bg-[#F8F9FA] rounded-[16px] transition-colors group">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-[12px] bg-[#F4F4F5] text-[#555] flex items-center justify-center">
                                    <HelpCircle size={20} />
                                </div>
                                <span className="text-[16px] font-bold text-[#333]">자주 묻는 질문 (FAQ)</span>
                            </div>
                            <ChevronRight size={20} className="text-[#CCC] group-hover:text-[#111] transition-colors" />
                        </button>
                        <button className="w-full flex items-center justify-between p-4 hover:bg-[#F8F9FA] rounded-[16px] transition-colors group">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-[12px] bg-[#F4F4F5] text-[#555] flex items-center justify-center">
                                    <Settings size={20} />
                                </div>
                                <span className="text-[16px] font-bold text-[#333]">계정 관리</span>
                            </div>
                            <ChevronRight size={20} className="text-[#CCC] group-hover:text-[#111] transition-colors" />
                        </button>
                    </div>

                    <div className="mt-8 mb-4 flex justify-center">
                        <button className="flex items-center gap-2 text-[14px] text-[#999] hover:text-[#555] transition-colors font-medium">
                            <LogOut size={16} /> 로그아웃
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
