import { motion } from 'framer-motion';
import { ChevronLeft, Compass, CheckCircle2, Lock, ChevronRight, User } from 'lucide-react';

export default function Skill({ onBack, onProfile }) {
    const quests = [
        { id: 1, title: '국민내일배움카드 발급', status: 'done', desc: '국비 지원 교육을 받기 위한 첫 걸음입니다. 고용노동부 HRD-Net에서 신청 완료했습니다.' },
        { id: 2, title: '대구 AI/SW 부트캠프 신청', status: 'current', desc: '실무 역량을 키울 수 있는 6개월 집중 코스입니다. 현재 모집 중이며 경쟁률이 높으니 서둘러주세요.' },
        { id: 3, title: '포트폴리오 완성 및 이력서 작성', status: 'locked', desc: '부트캠프 수료 후 진행할 프로젝트를 정리하고 이력서를 완성하는 단계입니다.' },
        { id: 4, title: '정보처리기사 자격증 취득', status: 'locked', desc: '기본적인 IT 역량을 증명할 수 있는 국가 공인 자격증 취득을 목표로 합니다.' }
    ];

    return (
        <div className="flex flex-col h-full w-full bg-[#F8F9FA] text-[#111] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-4 bg-white sticky top-0 z-20 border-b border-[#F0F0F0]">
                <div className="w-[60px]"></div>
                <div className="text-[17px] font-bold">역량 개발</div>
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
                    className="bg-[#F2F3FB] px-6 py-8"
                >
                    <div className="w-14 h-14 rounded-[16px] bg-[#4F46E5] flex items-center justify-center text-white mb-5 shadow-[0_4px_12px_rgba(79,70,229,0.3)]">
                        <Compass size={28} />
                    </div>
                    <h1 className="text-[26px] font-extrabold text-[#111] leading-[1.3] mb-3 tracking-tight break-keep">
                        단계별로 달성하는<br/>커리어 퀘스트
                    </h1>
                    <p className="text-[14px] text-[#4F46E5] font-bold">
                        AI가 분석한 최적의 성장 로드맵입니다.
                    </p>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    transition={{ delay: 0.2 }}
                    className="px-6 py-8"
                >
                    <h2 className="text-[18px] font-bold mb-8">나의 퀘스트 현황</h2>
                    <div className="relative border-l-[3px] border-[#E5E7EB] ml-4 flex flex-col gap-8 pb-4">
                        {quests.map((q, i) => (
                            <div key={q.id} className="relative pl-8">
                                {/* Timeline Dot */}
                                <div className={`absolute -left-[14px] top-1 w-6 h-6 rounded-full flex items-center justify-center border-[4px] border-[#F8F9FA]
                                    ${q.status === 'done' ? 'bg-[#4F46E5]' : q.status === 'current' ? 'bg-[#FF5A00] ring-4 ring-[#FF5A00]/20' : 'bg-[#D1D5DB]'}`}>
                                    {q.status === 'done' && <CheckCircle2 size={12} className="text-white"/>}
                                </div>
                                
                                {/* Card */}
                                <div className={`bg-white p-5 rounded-[20px] shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-black/[0.02] transition-all
                                    ${q.status === 'locked' ? 'opacity-50' : 'hover:-translate-y-1'}`}>
                                    
                                    <div className="flex items-center gap-2 mb-3">
                                        {q.status === 'done' && <span className="px-2 py-1 rounded bg-[#F2F3FB] text-[#4F46E5] text-[10px] font-bold">완료</span>}
                                        {q.status === 'current' && <span className="px-2 py-1 rounded bg-[#FFF5F0] text-[#FF5A00] text-[10px] font-bold">진행중</span>}
                                        {q.status === 'locked' && <Lock size={14} className="text-[#999]"/>}
                                        <h3 className="text-[16px] font-bold text-[#111]">{q.title}</h3>
                                    </div>
                                    
                                    <p className="text-[14px] text-[#666] font-medium leading-[1.6] break-keep mb-0">
                                        {q.desc}
                                    </p>

                                    {q.status === 'current' && (
                                        <div className="mt-5 pt-5 border-t border-[#F0F0F0]">
                                            <button className="w-full py-3.5 bg-[#111] text-white rounded-[14px] text-[15px] font-bold flex justify-center items-center gap-2 shadow-md hover:bg-black transition-colors">
                                                퀘스트 수행하기 <ChevronRight size={18} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
