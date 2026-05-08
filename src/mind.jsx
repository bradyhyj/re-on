import { motion, AnimatePresence } from 'framer-motion';
import {
    Heart, MessageCircle, PhoneCall, CalendarHeart, ArrowRight, User,
    Users, Lightbulb, TrendingUp, Sparkles, ThumbsUp, MessageSquare,
    FileText, Search, Bookmark, CheckCircle2, Star, Compass
} from 'lucide-react';
import { useState } from 'react';

const TABS = [
    { key: 'counsel', label: '상담', icon: <Heart size={13} /> },
    { key: 'community', label: '커뮤니티', icon: <Users size={13} /> },
    { key: 'timeline', label: '성장기록', icon: <TrendingUp size={13} /> },
];

const POSTS = [
    { id: 1, category: '팁', title: '청년수당 신청할 때 이거 꼭 챙기세요', body: '주민등록등본이랑 건강보험료 납부확인서가 같이 필요해요. 저는 몰라서 두 번 갔다 왔어요 😭', likes: 47, comments: 12, time: '2시간 전', pinned: true },
    { id: 2, category: '취업', title: '대구은행 IT 최종 합격했어요!', body: '6개월 준비했는데 드디어 붙었습니다. 코테 → 인성검사 → PT면접 순서였어요.', likes: 83, comments: 31, time: '5시간 전', pinned: false },
    { id: 3, category: '팁', title: '국비지원 부트캠프 후기 (AI/SW 6개월)', body: '대구디진원 부트캠프 수료했습니다. 커리큘럼이나 취업 연계 궁금하신 분 댓글 달아주세요.', likes: 62, comments: 18, time: '1일 전', pinned: false },
    { id: 4, category: '고민', title: '백수 8개월차인데 자존감이 너무 떨어져요', body: '매일 지원하는데 서류도 통과를 못 하니... 저만 이런 건 아니죠?', likes: 104, comments: 57, time: '3일 전', pinned: false },
    { id: 5, category: '팁', title: '월세 특별지원 조건 정리해봤어요', body: '만 19~34세, 독립 거주, 월세 60만원 이하면 신청 가능. 보증금은 해당 안 돼요!', likes: 39, comments: 9, time: '4일 전', pinned: false },
];

const TIPS = [
    { emoji: '📋', title: '청년수당 신청 체크리스트', desc: '주민등록등본 + 건강보험료 납부확인서 필수' },
    { emoji: '🎯', title: '공고 마감 D-3 법칙', desc: '지원서는 마감 3일 전에 제출해야 검토 확률 2배' },
    { emoji: '💡', title: '자소서 AI 첨삭 활용법', desc: '직무 키워드 3개 먼저 뽑고 역순으로 작성하세요' },
];

const TIMELINE = [
    { date: '오늘', icon: <MessageCircle size={14} />, color: '#16A34A', title: 'AI 상담 진행', detail: '번아웃 관련 30분 대화' },
    { date: '5월 3일', icon: <FileText size={14} />, color: '#4F46E5', title: '이력서 수정', detail: '3번째 버전 업로드' },
    { date: '5월 1일', icon: <Search size={14} />, color: '#FF5A00', title: '공고 탐색', detail: '대구은행 IT 직무 북마크' },
    { date: '4월 28일', icon: <CheckCircle2 size={14} />, color: '#4F46E5', title: '퀘스트 완료', detail: '국민내일배움카드 발급' },
    { date: '4월 25일', icon: <Bookmark size={14} />, color: '#FF5A00', title: '정책 북마크', detail: '청년 월세 특별지원 저장' },
    { date: '4월 20일', icon: <Star size={14} />, color: '#16A34A', title: '역량 진단 완료', detail: '개발자 직무 오각형 분석' },
];

const PROGRESS_ITEMS = [
    { label: '이력서 완성도', value: 65, color: '#4F46E5' },
    { label: '퀘스트 달성률', value: 25, color: '#FF5A00' },
    { label: '정책 활용도', value: 40, color: '#16A34A' },
    { label: '심리 회복 지수', value: 55, color: '#16A34A' },
];

export default function Mind({ onBack, onProfile, bookmarks, onToggleBookmark, onStartChat }) {
    const isBookmarked = (category, id) => bookmarks.some(b => b.id === id && b.category === category);

    const [tab, setTab] = useState('counsel');
    const [filter, setFilter] = useState('전체');
    const filters = ['전체', '팁', '취업', '고민'];
    const filtered = filter === '전체' ? POSTS : POSTS.filter(p => p.category === filter);

    return (
        <div className="flex flex-col h-full w-full bg-[#F8F9FA] text-[#111] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-4 bg-white sticky top-0 z-20 border-b border-[#F0F0F0]">
                <div className="w-[60px]"></div>
                <div className="text-[17px] font-bold">심리 회복</div>
                <div className="w-[60px]"></div>
            </div>

            {/* 탭 바 */}
            <div className="flex bg-white border-b border-[#F0F0F0]">
                {TABS.map(t => (
                    <button key={t.key} onClick={() => setTab(t.key)}
                        className={`flex-1 flex flex-col items-center gap-1 py-2.5 text-[11px] font-bold border-b-2 transition-colors
                            ${tab === t.key ? 'border-[#16A34A] text-[#16A34A]' : 'border-transparent text-[#999]'}`}>
                        {t.icon}{t.label}
                    </button>
                ))}
            </div>

            <div className="flex-1 overflow-y-auto pb-24">
                <AnimatePresence mode="wait">

                    {/* ── 탭 1: 상담 ── */}
                    {tab === 'counsel' && (
                        <motion.div key="counsel"
                            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }}>
                            <div className="bg-[#F0FDF4] px-6 py-8">
                                <div className="w-14 h-14 rounded-[16px] bg-[#16A34A] flex items-center justify-center text-white mb-5 shadow-[0_4px_12px_rgba(22,163,74,0.3)]">
                                    <Heart size={28} />
                                </div>
                                <h1 className="text-[24px] font-extrabold leading-[1.3] mb-2 break-keep">지친 마음을<br />다독이는 시간</h1>
                                <p className="text-[13px] text-[#16A34A] font-bold">혼자 견디지 마세요. 언제든 도와드릴게요.</p>
                            </div>
                            <div className="px-6 py-8 flex flex-col gap-5">
                                <div className="bg-[#111] text-white p-7 rounded-[28px] relative overflow-hidden shadow-xl">
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="inline-block px-3 py-1 bg-white/20 rounded-full text-[11px] font-bold backdrop-blur-md">24시간 언제나</div>
                                            <div className="inline-block px-3 py-1 bg-[#16A34A]/80 rounded-full text-[11px] font-bold">Gemini 연동</div>
                                        </div>
                                        <h2 className="text-[20px] font-bold mb-3">AI 익명 고민 상담소</h2>
                                        <p className="text-[13px] text-[#A1A1AA] leading-[1.6] mb-7 break-keep">
                                            누구에게도 말하기 힘든 고민이 있다면<br />AI 멘탈 케어 챗봇과 편하게 대화해보세요.
                                        </p>
                                        <button onClick={onStartChat} className="bg-white text-[#111] px-6 py-3.5 rounded-full text-[14px] font-bold flex items-center gap-2 shadow-lg">
                                            <MessageCircle size={16} fill="currentColor" /> 대화 시작하기
                                        </button>
                                    </div>
                                    <MessageCircle size={140} className="absolute -right-10 -bottom-10 text-white/[0.03] rotate-12" />
                                </div>
                                <div className="bg-white p-6 rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-black/[0.02]">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center">
                                                <CalendarHeart size={20} />
                                            </div>
                                            <h2 className="text-[17px] font-bold">대구 청년마음건강지원</h2>
                                        </div>
                                        <button onClick={() => onToggleBookmark({ id: 'mind-program-1', title: '대구 청년마음건강지원', category: 'mind-program' })} className="text-[#CCC] hover:text-[#16A34A] transition-colors">
                                            <Bookmark size={20} className={isBookmarked('mind-program', 'mind-program-1') ? 'text-[#16A34A] fill-[#16A34A]' : ''} />
                                        </button>
                                    </div>
                                    <p className="text-[13px] text-[#666] leading-[1.6] mb-5 break-keep">대구시 지원 무료 전문 심리 상담 프로그램. 1:1 대면 상담을 통해 마음을 치유하세요.</p>
                                    <div className="flex gap-2">
                                        <button className="flex-1 py-3.5 bg-[#F8F9FA] text-[#111] rounded-[14px] text-[14px] font-bold border border-[#E5E7EB]">상세 보기</button>
                                        <button className="flex-1 py-3.5 bg-[#16A34A] text-white rounded-[14px] text-[14px] font-bold flex justify-center items-center gap-2">
                                            <PhoneCall size={16} /> 예약하기
                                        </button>
                                    </div>
                                </div>
                                <button onClick={() => setTab('timeline')}
                                    className="flex items-center justify-center p-4 bg-[#F9FAFB] rounded-[16px] border border-[#F3F4F6] hover:bg-[#F3F4F6] transition-colors">
                                    <span className="text-[13px] font-medium text-[#666]">나의 성장 타임라인 보기</span>
                                    <ArrowRight size={15} className="ml-2 text-[#999]" />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* ── 탭 2: 커뮤니티 ── */}
                    {tab === 'community' && (
                        <motion.div key="community"
                            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }}>
                            <div className="bg-[#F0FDF4] px-6 py-5">
                                <p className="text-[11px] font-bold text-[#16A34A] mb-3">📌 오늘의 청년 꿀팁</p>
                                <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
                                    {TIPS.map((tip, i) => (
                                        <div key={i} className="shrink-0 w-[220px] bg-white rounded-[16px] p-4 shadow-sm border border-[#E5E7EB]">
                                            <div className="text-[20px] mb-2">{tip.emoji}</div>
                                            <div className="text-[13px] font-bold text-[#111] mb-1 break-keep">{tip.title}</div>
                                            <div className="text-[11px] text-[#999] leading-[1.5] break-keep">{tip.desc}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-2 px-6 py-4 bg-white border-b border-[#F0F0F0] overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
                                {filters.map(f => (
                                    <button key={f} onClick={() => setFilter(f)}
                                        className={`shrink-0 px-3.5 py-1.5 rounded-full text-[12px] font-bold border transition-colors
                                            ${filter === f ? 'bg-[#111] text-white border-[#111]' : 'bg-white text-[#555] border-[#E5E7EB]'}`}>
                                        {f}
                                    </button>
                                ))}
                            </div>
                            <div className="flex flex-col divide-y divide-[#F0F0F0]">
                                {filtered.map(post => (
                                    <div key={post.id} className="bg-white px-6 py-5 hover:bg-[#F9FAFB] transition-colors cursor-pointer">
                                        <div className="flex items-center gap-2 mb-2">
                                            {post.pinned && <span className="text-[10px] font-bold text-[#FF5A00] bg-[#FFF5F0] px-2 py-0.5 rounded-full">📌 고정</span>}
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full
                                                ${post.category === '팁' ? 'bg-[#F0FDF4] text-[#16A34A]' : post.category === '취업' ? 'bg-[#F2F3FB] text-[#4F46E5]' : 'bg-[#F4F4F5] text-[#555]'}`}>
                                                {post.category}
                                            </span>
                                            <div className="flex items-center gap-2 ml-auto">
                                                <button onClick={(e) => { e.stopPropagation(); onToggleBookmark({ ...post, category: 'mind-post' }); }} className="text-[#CCC] hover:text-[#16A34A] transition-colors">
                                                    <Bookmark size={16} className={isBookmarked('mind-post', post.id) ? 'text-[#16A34A] fill-[#16A34A]' : ''} />
                                                </button>
                                                <span className="text-[11px] text-[#CCC]">{post.time}</span>
                                            </div>
                                        </div>
                                        <h3 className="text-[15px] font-bold text-[#111] mb-1.5 break-keep">{post.title}</h3>
                                        <p className="text-[12px] text-[#999] leading-[1.5] break-keep line-clamp-2">{post.body}</p>
                                        <div className="flex items-center gap-4 mt-3 text-[12px] text-[#999] font-medium">
                                            <span className="flex items-center gap-1"><ThumbsUp size={13} /> {post.likes}</span>
                                            <span className="flex items-center gap-1"><MessageSquare size={13} /> {post.comments}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="fixed bottom-28 right-6 z-30">
                                <button className="w-14 h-14 bg-[#16A34A] text-white rounded-full shadow-xl flex items-center justify-center text-[24px] font-light hover:bg-[#15803d] transition-colors">+</button>
                            </div>
                        </motion.div>
                    )}

                    {/* ── 탭 3: 성장기록 + 경험추출 통합 ── */}
                    {tab === 'timeline' && (
                        <motion.div key="timeline"
                            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }}>

                            {/* Hero */}
                            <div className="bg-[#F0FDF4] px-6 py-7">
                                <h1 className="text-[22px] font-extrabold mb-1 break-keep">아무것도 안 한 게 아니에요 💪</h1>
                                <p className="text-[13px] text-[#16A34A] font-bold">꾸준히 준비했던 모든 순간이 여기 있어요.</p>
                            </div>

                            <div className="px-6 py-6 flex flex-col gap-8">

                                {/* ① 준비 현황 Progress bars */}
                                <section className="bg-white rounded-[24px] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
                                    <h2 className="text-[15px] font-bold mb-4">나의 준비 현황</h2>
                                    <div className="flex flex-col gap-4">
                                        {PROGRESS_ITEMS.map((item, i) => (
                                            <div key={i}>
                                                <div className="flex justify-between mb-1.5">
                                                    <span className="text-[13px] font-bold text-[#333]">{item.label}</span>
                                                    <span className="text-[13px] font-extrabold" style={{ color: item.color }}>{item.value}%</span>
                                                </div>
                                                <div className="h-2 bg-[#F0F0F0] rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }} animate={{ width: `${item.value}%` }}
                                                        transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
                                                        className="h-full rounded-full" style={{ backgroundColor: item.color }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                {/* ② AI 경험 인사이트 */}
                                <section>
                                    <div className="flex items-center gap-2 mb-3">
                                        <Sparkles size={15} className="text-[#16A34A]" />
                                        <h2 className="text-[15px] font-bold">AI 경험 추출</h2>
                                        <span className="ml-auto text-[11px] text-[#CCC]">2026.05.06 분석</span>
                                    </div>

                                    {/* 인사이트 카드 */}
                                    <div className="bg-[#111] text-white p-6 rounded-[24px] relative overflow-hidden mb-3">
                                        <div className="relative z-10">
                                            <p className="text-[14px] font-bold leading-[1.8] break-keep">
                                                "당신은 지난 한 달간 <span className="text-[#4ade80]">개발자 직무를 꾸준히 탐색</span>하며,
                                                이력서를 <span className="text-[#4ade80]">3회 개선</span>하고
                                                관련 공고 <span className="text-[#4ade80]">5건을 북마크</span>했습니다.
                                                이는 명확한 방향성을 갖고 성실히 준비하고 있다는 증거입니다."
                                            </p>
                                        </div>
                                        <Sparkles size={80} className="absolute -right-4 -bottom-4 text-white/[0.04]" />
                                    </div>

                                    {/* 추출 태그 */}
                                    <div className="bg-white rounded-[20px] p-4 shadow-[0_2px_8px_rgba(0,0,0,0.03)] mb-3">
                                        <p className="text-[12px] font-bold text-[#999] mb-3">추출된 핵심 경험</p>
                                        <div className="flex flex-wrap gap-2">
                                            {['IT직무 탐색 6주', '이력서 3회 개선', '공고 북마크 5건', 'AI 상담 2회', '국비지원 신청 완료', '역량 진단 완료'].map((tag, i) => (
                                                <span key={i} className="px-3 py-1.5 rounded-full text-[11px] font-bold bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0]">
                                                    ✓ {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* 자소서 활용 제안 */}
                                    <div className="bg-white rounded-[20px] p-4 shadow-[0_2px_8px_rgba(0,0,0,0.03)] mb-3">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Lightbulb size={13} className="text-[#FF5A00]" />
                                            <p className="text-[12px] font-bold text-[#111]">자소서 활용 제안</p>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            {[
                                                { q: '지원 동기', hint: '6주간 IT 직무 탐색 경험을 구체적인 계기로 풀어보세요.' },
                                                { q: '성장 경험', hint: '이력서 3회 개선 과정의 피드백과 변화를 서술하세요.' },
                                                { q: '목표와 포부', hint: '부트캠프 → 자격증 취득 로드맵을 근거로 제시하세요.' },
                                            ].map((item, i) => (
                                                <div key={i} className="p-3 bg-[#F9FAFB] rounded-[12px]">
                                                    <div className="text-[10px] font-bold text-[#FF5A00] mb-0.5">Q. {item.q}</div>
                                                    <div className="text-[12px] text-[#555] leading-[1.5] break-keep">{item.hint}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* 재분석 버튼 */}
                                    <button className="w-full py-3.5 bg-[#16A34A] text-white rounded-[16px] text-[13px] font-bold flex justify-center items-center gap-2 shadow-[0_4px_16px_rgba(22,163,74,0.2)]">
                                        <Sparkles size={14} /> AI 재분석 요청
                                    </button>
                                </section>

                                {/* ③ 활동 시계열 타임라인 */}
                                <section>
                                    <h2 className="text-[15px] font-bold mb-4">활동 기록</h2>
                                    <div className="relative border-l-2 border-[#E5E7EB] ml-3 flex flex-col gap-5">
                                        {TIMELINE.map((item, i) => (
                                            <div key={i} className="relative pl-7">
                                                <div className="absolute -left-[13px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-white"
                                                    style={{ backgroundColor: item.color }}>
                                                    {item.icon}
                                                </div>
                                                <div className="bg-white p-4 rounded-[16px] shadow-[0_1px_6px_rgba(0,0,0,0.04)]">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="text-[14px] font-bold text-[#111]">{item.title}</span>
                                                        <span className="text-[11px] text-[#CCC]">{item.date}</span>
                                                    </div>
                                                    <span className="text-[12px] text-[#999]">{item.detail}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </div>
    );
}