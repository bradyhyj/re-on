import { motion } from 'framer-motion';
import { User, Bookmark, CheckCircle2, Heart, FileText, Settings, Bell, HelpCircle, ChevronRight, LogOut, MapPin, Trash2, BarChart2 } from 'lucide-react';
import { useState, useEffect } from 'react';

const BOOKMARK_KEY = 'bookmarks';

export default function Profile({ onBack, onGoToResult, onGoToSkill, bookmarks, onToggleBookmark }) {
    const jobBookmarks = bookmarks.filter(b => b.category === 'job');
    const policyBookmarks = bookmarks.filter(b => b.category === 'policy');
    const skillBookmarks = bookmarks.filter(b => b.category.includes('skill'));
    const mindBookmarks = bookmarks.filter(b => b.category.includes('mind'));

    const [status, setStatus] = useState(() => localStorage.getItem('user_status') || '잠시 쉬어가는 중이에요');

    const handleStatusChange = (e) => {
        const val = e.target.value;
        setStatus(val);
        localStorage.setItem('user_status', val);
    };

    return (
        <div className="flex flex-col h-full w-full bg-[#F8F9FA] text-[#111] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-4 bg-white sticky top-0 z-20 border-b border-[#F0F0F0]">
                <div className="w-[60px]"></div>
                <div className="text-[17px] font-bold">마이페이지</div>
                <button onClick={onBack} className="w-[60px] flex justify-end text-[#666] hover:text-[#111] transition-colors">
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
                    <div className="flex items-center gap-5 mb-2">
                        <div className="w-20 h-20 rounded-[24px] bg-[#FFF5F0] text-[#FF5A00] flex items-center justify-center shadow-inner border border-[#FF5A00]/10">
                            <User size={36} strokeWidth={2} />
                        </div>
                        <div className="flex-1">
                            <h1 className="text-[22px] font-bold text-[#111] mb-1.5">김대구 님</h1>
                            <div className="relative group max-w-[200px]">
                                <input 
                                    type="text" 
                                    value={status} 
                                    onChange={handleStatusChange}
                                    placeholder="자신의 좌우명을 적어보세요"
                                    className="w-full bg-[#F4F4F5] text-[#555] text-[12px] font-medium px-3 py-1.5 rounded-full border-none focus:ring-1 focus:ring-[#FF5A00]/30 transition-all outline-none"
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-[#CCC] pointer-events-none">
                                    편집
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col gap-3 px-6 py-4"
                >
                    {/* 스마트 북마크 — 실제 데이터 */}
                    <div className="bg-white rounded-[24px] p-2 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                        <div className="flex items-center justify-between px-4 py-3 pb-1">
                            <h2 className="text-[13px] font-bold text-[#999]">스마트 북마크</h2>
                            <div className="text-[11px] font-bold text-[#FF5A00] bg-[#FFF5F0] px-2.5 py-1 rounded-full flex items-center gap-1">
                                <Bell size={12} /> 마감 임박 순
                            </div>
                        </div>

                        <div className="p-2 flex flex-col gap-2">
                            {/* 채용공고 북마크 */}
                            {jobBookmarks.map(j => (
                                <div key={`job-${j.id}`} className="p-4 bg-[#F8F9FA] rounded-[16px] relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-[#FF5A00]"></div>
                                    <div className="flex justify-between items-start mb-1">
                                        <div className="text-[15px] font-bold text-[#111] pr-2">{j.title}</div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <div className="text-[13px] font-extrabold text-[#FF5A00] bg-[#FFF5F0] px-2 py-0.5 rounded-[6px]">{j.dday}</div>
                                            <button onClick={() => onToggleBookmark(j)}>
                                                <Trash2 size={15} className="text-[#CCC] hover:text-red-400 transition-colors" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 mt-1 text-[12px] text-[#999]">
                                        <MapPin size={12} /> {j.location}
                                        <span className="ml-2 text-[11px] font-medium text-[#555] bg-white px-2 py-0.5 rounded-md border border-[#E5E7EB]">{j.type}</span>
                                    </div>
                                </div>
                            ))}

                            {/* 정책/상담/퀘스트 북마크 */}
                            {bookmarks.filter(b => b.category !== 'job').map(p => (
                                <div key={`${p.category}-${p.id}`} className="p-4 bg-[#F8F9FA] rounded-[16px] border border-transparent">
                                    <div className="flex justify-between items-start mb-1">
                                        <div className="flex flex-col gap-1">
                                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded w-fit
                                                ${p.category === 'policy' ? 'bg-[#111] text-white' : 
                                                  p.category.includes('skill') ? 'bg-[#F2F3FB] text-[#4F46E5]' : 
                                                  'bg-[#F0FDF4] text-[#16A34A]'}`}>
                                                {p.category === 'policy' ? '정책' : p.category.includes('skill') ? '역량 퀘스트' : '심리/커뮤니티'}
                                            </span>
                                            <div className="text-[15px] font-bold text-[#111] pr-2">{p.title}</div>
                                        </div>
                                        <button onClick={() => onToggleBookmark(p)}>
                                            <Trash2 size={15} className="text-[#CCC] hover:text-red-400 transition-colors shrink-0" />
                                        </button>
                                    </div>
                                    {p.desc && <p className="text-[12px] text-[#999] leading-[1.5] break-keep">{p.desc}</p>}
                                </div>
                            ))}

                            {/* 북마크 없을 때 */}
                            {bookmarks.length === 0 && (
                                <div className="py-8 text-center text-[14px] text-[#999]">
                                    아직 저장한 항목이 없어요 🔖<br />
                                    <span className="text-[12px]">취업 정보 탭에서 북마크해보세요!</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 나의 진단 기록 */}
                    <div className="bg-white rounded-[24px] p-2 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                        <h2 className="text-[13px] font-bold text-[#999] px-4 py-3 pb-1">나의 진단 기록</h2>
                        <button onClick={onGoToResult} className="w-full flex items-center justify-between p-4 hover:bg-[#F8F9FA] rounded-[16px] transition-colors group">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-[12px] bg-[#FFF5F0] text-[#FF5A00] flex items-center justify-center">
                                    <FileText size={20} />
                                </div>
                                <span className="text-[16px] font-bold text-[#333]">최근 맞춤 진단 결과 보기</span>
                            </div>
                            <ChevronRight size={20} className="text-[#CCC] group-hover:text-[#111] transition-colors" />
                        </button>
                        <button onClick={onGoToSkill} className="w-full flex items-center justify-between p-4 hover:bg-[#F8F9FA] rounded-[16px] transition-colors group">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-[12px] bg-[#F2F3FB] text-[#4F46E5] flex items-center justify-center">
                                    <BarChart2 size={20} />
                                </div>
                                <span className="text-[16px] font-bold text-[#333]">역량 분석 결과 보기</span>
                            </div>
                            <ChevronRight size={20} className="text-[#CCC] group-hover:text-[#111] transition-colors" />
                        </button>
                    </div>

                    {/* 앱 설정 */}
                    <div className="bg-white rounded-[24px] p-2 shadow-[0_4px_20px_rgba(0,0,0,0.02)] mt-2">
                        <h2 className="text-[13px] font-bold text-[#999] px-4 py-3 pb-1">앱 설정</h2>
                        <button className="w-full flex items-center justify-between p-4 hover:bg-[#F8F9FA] rounded-[16px] transition-colors group">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-[12px] bg-[#F4F4F5] text-[#555] flex items-center justify-center"><Bell size={20} /></div>
                                <span className="text-[16px] font-bold text-[#333]">알림 설정</span>
                            </div>
                            <ChevronRight size={20} className="text-[#CCC] group-hover:text-[#111] transition-colors" />
                        </button>
                        <button className="w-full flex items-center justify-between p-4 hover:bg-[#F8F9FA] rounded-[16px] transition-colors group">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-[12px] bg-[#F4F4F5] text-[#555] flex items-center justify-center"><HelpCircle size={20} /></div>
                                <span className="text-[16px] font-bold text-[#333]">자주 묻는 질문 (FAQ)</span>
                            </div>
                            <ChevronRight size={20} className="text-[#CCC] group-hover:text-[#111] transition-colors" />
                        </button>
                        <button className="w-full flex items-center justify-between p-4 hover:bg-[#F8F9FA] rounded-[16px] transition-colors group">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-[12px] bg-[#F4F4F5] text-[#555] flex items-center justify-center"><Settings size={20} /></div>
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