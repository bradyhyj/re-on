import { motion } from 'framer-motion';
import { Briefcase, ExternalLink, MapPin, Calendar, Bookmark, Star } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Information({ scores, onBack, onProfile, bookmarks, onToggleBookmark }) {
    const selectedFields = scores?.careerFields || [];
    
    // 직무 필드에 따른 더미 데이터 매핑
    const getJobs = () => {
        if (selectedFields.includes('IT/개발')) {
            return [
                { id: 1, title: '대구은행 IT 직무 채용', type: '정규직', location: '수성구', dday: 'D-5', deadline: '2026-05-11', sponsored: true, category: 'job' },
                { id: 2, title: '대구 AI 스타트업 프론트엔드 개발자', type: '정규직', location: '동구', dday: 'D-8', deadline: '2026-05-14', sponsored: false, category: 'job' },
                { id: 3, title: '지역 중소기업 전산망 관리직', type: '계약직', location: '달서구', dday: '상시모집', deadline: null, sponsored: false, category: 'job' }
            ];
        } else if (selectedFields.includes('사무/행정')) {
            return [
                { id: 201, title: '공공기관 청년 인턴십 (행정)', type: '인턴', location: '중구', dday: 'D-12', deadline: '2026-05-18', sponsored: false, category: 'job' },
                { id: 202, title: '대구테크노파크 일반사무직', type: '정규직', location: '북구', dday: 'D-3', deadline: '2026-05-09', sponsored: true, category: 'job' }
            ];
        }
        return [
            { id: 301, title: '대구형 청년 뉴딜 일자리', type: '계약직', location: '달서구', dday: '상시모집', deadline: null, sponsored: false, category: 'job' },
            { id: 302, title: '지역 청년 사회적 기업 인턴', type: '인턴', location: '남구', dday: 'D-10', deadline: '2026-05-16', sponsored: false, category: 'job' }
        ];
    };

    const jobs = getJobs();

    const policies = [
        { id: 101, title: '대구형 청년수당', desc: '취업 준비 기간 동안 월 50만원의 활동비를 지원하여 경제적 부담 완화', deadline: '2026-05-20', category: 'policy', dday: 'D-14' },
        { id: 102, title: '청년 월세 특별지원', desc: '독립 청년들의 주거 안정을 위해 최대 12개월, 월 20만원 한도 지원', deadline: '2026-05-30', category: 'policy', dday: 'D-24' }
    ];

    const isBookmarked = (category, id) => bookmarks.some(b => b.id === id && b.category === category);


    return (
        <div className="flex flex-col h-full w-full bg-[#F8F9FA] text-[#111] overflow-hidden">
            <div className="flex items-center justify-between px-6 pt-5 pb-4 bg-white sticky top-0 z-20 border-b border-[#F0F0F0]">
                <div className="w-[60px]"></div>
                <div className="text-[17px] font-bold">취업 정보</div>
                <button onClick={onBack} className="w-[60px] flex justify-end text-[#666] hover:text-[#111] transition-colors">
                    <span className="text-[15px] font-bold">뒤로</span>
                </button>
            </div>

            <div className="flex-1 overflow-y-auto pb-24">
                <motion.div
                    initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                    className="bg-[#FFF5F0] px-6 py-8"
                >
                    <div className="w-14 h-14 rounded-[16px] bg-[#FF5A00] flex items-center justify-center text-white mb-5 shadow-[0_4px_12px_rgba(255,90,0,0.3)]">
                        <Briefcase size={28} />
                    </div>
                    <h1 className="text-[26px] font-extrabold text-[#111] leading-[1.3] mb-3 tracking-tight break-keep">
                        나에게 딱 맞는<br />대구 청년 정책과 일자리
                    </h1>
                    <p className="text-[14px] text-[#FF5A00] font-bold">AI가 분석한 맞춤형 추천 리스트입니다.</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
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
                                <div key={j.id} className={`bg-white p-5 rounded-[20px] shadow-[0_2px_12px_rgba(0,0,0,0.03)] border transition-colors ${j.sponsored ? 'border-[#FF5A00]/30' : 'border-black/[0.02] hover:border-[#FF5A00]'}`}>
                                    {/* 스폰서 뱃지 */}
                                    {j.sponsored && (
                                        <div className="flex items-center gap-1 mb-2">
                                            <Star size={11} className="text-[#FF5A00] fill-[#FF5A00]" />
                                            <span className="text-[11px] font-bold text-[#FF5A00]">채용 파트너</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="inline-block px-2 py-1 rounded bg-[#F5F5F5] text-[11px] font-bold text-[#555]">{j.type}</div>
                                        <div className="flex items-center gap-2">
                                            <div className="text-[13px] font-bold text-[#FF5A00] bg-[#FFF5F0] px-2 py-0.5 rounded-full">{j.dday}</div>
                                            <button onClick={() => onToggleBookmark(j)} className="transition-transform active:scale-90">
                                                <Bookmark size={20} className={isBookmarked('job', j.id) ? 'text-[#FF5A00] fill-[#FF5A00]' : 'text-[#CCC]'} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="text-[16px] font-bold text-[#111] mb-3 leading-[1.4] break-keep">{j.title}</div>
                                    <div className="flex items-center gap-4 text-[13px] text-[#999] font-medium">
                                        <div className="flex items-center gap-1.5"><MapPin size={14} /> {j.location}</div>
                                        <div className="flex items-center gap-1.5"><Calendar size={14} /> {j.deadline ? j.deadline.slice(0, 7).replace('-', '.') + ' 마감' : '상시모집'}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Policies */}
                    <section>
                        <h2 className="text-[18px] font-bold mb-5">대구시 추천 정책</h2>
                        <div className="flex flex-col gap-4">
                            {policies.map(p => (
                                <div key={p.id} className="w-full bg-[#111] text-white p-6 rounded-[24px] shadow-lg flex flex-col">
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="text-[18px] font-bold">{p.title}</h3>
                                        <button onClick={() => onToggleBookmark(p)} className="ml-2 shrink-0 transition-transform active:scale-90">
                                            <Bookmark size={20} className={isBookmarked('policy', p.id) ? 'text-[#FF5A00] fill-[#FF5A00]' : 'text-[#666]'} />
                                        </button>
                                    </div>
                                    <p className="text-[14px] text-[#A1A1AA] leading-[1.6] mb-6 break-keep">{p.desc}</p>
                                    <div className="mt-auto">
                                        <button className="flex items-center gap-1.5 text-[14px] text-[#FF5A00] font-bold">
                                            신청하러 가기 <ExternalLink size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </motion.div>
            </div>
        </div>
    );
}