import { motion } from 'framer-motion';
import { ChevronLeft, Briefcase, ExternalLink, MapPin, Calendar, User } from 'lucide-react';

export default function Information({ onBack, onProfile }) {
    const jobs = [
        { id: 1, title: '대구은행 IT 직무 채용', type: '정규직', location: '수성구', dday: 'D-5' },
        { id: 2, title: '공공기관 청년 인턴십 (행정)', type: '인턴', location: '중구', dday: 'D-12' },
        { id: 3, title: '대구형 청년 뉴딜 일자리', type: '계약직', location: '달서구', dday: '상시모집' }
    ];

    const policies = [
        { id: 1, title: '대구형 청년수당', desc: '취업 준비 기간 동안 월 50만원의 활동비를 지원하여 경제적 부담 완화' },
        { id: 2, title: '청년 월세 특별지원', desc: '독립 청년들의 주거 안정을 위해 최대 12개월, 월 20만원 한도 지원' }
    ];

    return (
        <div className="flex flex-col h-full w-full bg-[#F8F9FA] text-[#111] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-4 bg-white sticky top-0 z-20 border-b border-[#F0F0F0]">
                <div className="w-[60px]"></div>
                <div className="text-[17px] font-bold">취업 정보</div>
                <div className="w-[60px]"></div>
            </div>

            <div className="flex-1 overflow-y-auto pb-24">
                {/* Hero */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-[#FFF5F0] px-6 py-8"
                >
                    <div className="w-14 h-14 rounded-[16px] bg-[#FF5A00] flex items-center justify-center text-white mb-5 shadow-[0_4px_12px_rgba(255,90,0,0.3)]">
                        <Briefcase size={28} />
                    </div>
                    <h1 className="text-[26px] font-extrabold text-[#111] leading-[1.3] mb-3 tracking-tight break-keep">
                        나에게 딱 맞는<br/>대구 청년 정책과 일자리
                    </h1>
                    <p className="text-[14px] text-[#FF5A00] font-bold">
                        AI가 분석한 맞춤형 추천 리스트입니다.
                    </p>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    transition={{ delay: 0.2 }}
                    className="px-6 py-8 flex flex-col gap-10"
                >
                    {/* Jobs */}
                    <section>
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-[18px] font-bold">맞춤 채용 공고</h2>
                            <span className="text-[12px] font-bold text-[#999]">워크넷 연동</span>
                        </div>
                        <div className="flex flex-col gap-3">
                            {jobs.map(j => (
                                <div key={j.id} className="bg-white p-5 rounded-[20px] shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-black/[0.02] cursor-pointer hover:border-[#FF5A00] transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="inline-block px-2 py-1 rounded bg-[#F5F5F5] text-[11px] font-bold text-[#555] mb-2">
                                            {j.type}
                                        </div>
                                        <div className="text-[13px] font-bold text-[#FF5A00] bg-[#FFF5F0] px-2 py-0.5 rounded-full">{j.dday}</div>
                                    </div>
                                    <div className="text-[16px] font-bold text-[#111] mb-3 leading-[1.4] break-keep">{j.title}</div>
                                    <div className="flex items-center gap-4 text-[13px] text-[#999] font-medium">
                                        <div className="flex items-center gap-1.5"><MapPin size={14}/> {j.location}</div>
                                        <div className="flex items-center gap-1.5"><Calendar size={14}/> 2026.05 마감</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Policies */}
                    <section>
                        <h2 className="text-[18px] font-bold mb-5">대구시 추천 정책</h2>
                        <div className="flex gap-4 overflow-x-auto scrollbar-hide -mx-6 px-6 pb-4 snap-x snap-mandatory">
                            <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; } .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
                            {policies.map(p => (
                                <div key={p.id} className="w-[280px] shrink-0 snap-start bg-[#111] text-white p-6 rounded-[24px] shadow-lg cursor-pointer flex flex-col">
                                    <h3 className="text-[18px] font-bold mb-3">{p.title}</h3>
                                    <p className="text-[14px] text-[#A1A1AA] leading-[1.6] mb-6 break-keep whitespace-normal">{p.desc}</p>
                                    <div className="mt-auto">
                                        <button className="flex items-center gap-1.5 text-[14px] text-[#FF5A00] font-bold">
                                            신청하러 가기 <ExternalLink size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <div className="w-2 shrink-0"></div>
                        </div>
                    </section>
                </motion.div>
            </div>
        </div>
    )
}
