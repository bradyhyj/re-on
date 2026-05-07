import { motion, AnimatePresence } from 'framer-motion';
import { Compass, CheckCircle2, Lock, ChevronRight, User, BarChart2, BookOpen, AlertCircle, ExternalLink, Bookmark, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

// ── 오각형 레이더 차트 ──────────────────────────────────────────
function RadarChart({ data }) {
    const cx = 130, cy = 130, r = 75;
    const total = data.length;

    const angle = (i) => (Math.PI / 2) + (2 * Math.PI * i / total) * -1;

    const point = (i, ratio) => ({
        x: cx + r * ratio * Math.cos(angle(i)),
        y: cy - r * ratio * Math.sin(angle(i)),
    });

    const gridLevels = [0.25, 0.5, 0.75, 1];

    const toPath = (pts) => pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ') + 'Z';

    const gridPath = (ratio) => toPath(data.map((_, i) => point(i, ratio)));
    const dataPath = toPath(data.map((d, i) => point(i, d.value / 100)));

    return (
        <svg viewBox="0 0 260 260" className="w-full max-w-[280px] mx-auto overflow-visible">
            {/* 배경 그리드 */}
            {gridLevels.map((lv, idx) => (
                <path key={idx} d={gridPath(lv)} fill="none" stroke="#E5E7EB" strokeWidth="1" />
            ))}
            {/* 축선 */}
            {data.map((_, i) => {
                const p = point(i, 1);
                return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#E5E7EB" strokeWidth="1" />;
            })}
            {/* 데이터 영역 */}
            <motion.path
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                d={dataPath}
                fill="rgba(79,70,229,0.15)"
                stroke="#4F46E5"
                strokeWidth="2.5"
                strokeLinejoin="round"
            />
            {/* 점 */}
            {data.map((d, i) => {
                const p = point(i, d.value / 100);
                return (
                    <motion.circle
                        key={i}
                        initial={{ r: 0 }}
                        animate={{ r: 4 }}
                        transition={{ delay: 0.8 + (i * 0.1), duration: 0.4 }}
                        cx={p.x} cy={p.y} fill="#4F46E5"
                    />
                );
            })}
            {/* 라벨 */}
            {data.map((d, i) => {
                const lp = point(i, 1.28);
                return (
                    <text key={i} x={lp.x} y={lp.y} textAnchor="middle" dominantBaseline="middle"
                        fontSize="10" fontWeight="700" fill="#555">
                        {d.label}
                    </text>
                );
            })}
        </svg>
    );
}

// ── 메인 컴포넌트 ───────────────────────────────────────────────
export default function Skill({ scores, onBack, onProfile, bookmarks, onToggleBookmark, onStartPortfolioSearch, isViewOnly }) {
    const isBookmarked = (category, id) => bookmarks.some(b => b.id === id && b.category === category);
    const [tab, setTab] = useState('diagnosis'); // 'diagnosis' | 'roadmap'
    const [aiData, setAiData] = useState({ weakPoints: [], recommendations: [], quests: [] });
    const [isAiLoading, setIsAiLoading] = useState(true);

    const radarData = (scores && scores.skillScores) ? scores.skillScores : [
        { label: '기술', value: 55 },
        { label: '경험', value: 30 },
        { label: '소통', value: 70 },
        { label: '자격', value: 40 },
        { label: '직무이해', value: 60 },
    ];

    useEffect(() => {
        const fetchAiData = async () => {
            const cacheKey = 'reon_skill_ai_data_v2';
            const cacheHash = JSON.stringify(radarData);

            const cachedStr = localStorage.getItem(cacheKey);
            if (cachedStr) {
                try {
                    const cached = JSON.parse(cachedStr);
                    if (cached.hash === cacheHash && cached.data && cached.data.weakPoints) {
                        setAiData(cached.data);
                        setIsAiLoading(false);
                        return;
                    }
                } catch (e) {
                    console.error('Failed to parse cached skill data');
                }
            }

            setIsAiLoading(true);
            try {
                const { generateSkillRecommendations } = await import('./gemini');
                const result = await generateSkillRecommendations(radarData, scores?.careerFields);
                setAiData(result);
                localStorage.setItem(cacheKey, JSON.stringify({ hash: cacheHash, data: result }));
            } catch (err) {
                console.error(err);
            } finally {
                setIsAiLoading(false);
            }
        };

        fetchAiData();
    }, [scores]);

    const { weakPoints, recommendations, quests } = aiData;

    const completeQuest = (questId) => {
        const newQuests = quests.map(q =>
            q.id === questId ? { ...q, status: 'done' } : q
        );
        const newAiData = { ...aiData, quests: newQuests };
        setAiData(newAiData);

        const cacheKey = 'reon_skill_ai_data';
        const cachedStr = localStorage.getItem(cacheKey);
        if (cachedStr) {
            try {
                const cached = JSON.parse(cachedStr);
                cached.data = newAiData;
                localStorage.setItem(cacheKey, JSON.stringify(cached));
            } catch (e) {
                console.error(e);
            }
        }
    };

    return (
        <div className="flex flex-col h-full w-full bg-[#F8F9FA] text-[#111] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-4 bg-white sticky top-0 z-20 border-b border-[#F0F0F0]">
                <div className="w-[60px]"></div>
                <div className="text-[17px] font-bold">역량 개발</div>
                <button onClick={onBack} className="w-[60px] flex justify-end text-[#666] hover:text-[#111] transition-colors">
                    <span className="text-[15px] font-bold">{isViewOnly ? '닫기' : '뒤로'}</span>
                </button>
            </div>

            {/* 탭 */}
            <div className="flex bg-white px-6 pb-0 gap-1 border-b border-[#F0F0F0]">
                {[
                    { key: 'diagnosis', label: '역량 진단', icon: <BarChart2 size={14} /> },
                    { key: 'roadmap', label: '커리어 로드맵', icon: <Compass size={14} /> },
                ].map(t => (
                    <button key={t.key} onClick={() => setTab(t.key)}
                        className={`flex items-center gap-1.5 px-4 py-3 text-[13px] font-bold border-b-2 transition-colors
                            ${tab === t.key ? 'border-[#4F46E5] text-[#4F46E5]' : 'border-transparent text-[#999]'}`}>
                        {t.icon} {t.label}
                    </button>
                ))}
            </div>

            <div className="flex-1 overflow-y-auto pb-24">
                <AnimatePresence mode="wait">

                    {/* ── 탭 1: 역량 진단 ── */}
                    {tab === 'diagnosis' && (
                        <motion.div key="diagnosis" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }} transition={{ duration: 0.25 }}>
                            {/* Hero */}
                            <div className="bg-[#F2F3FB] px-6 py-8 flex justify-between items-end">
                                <div>
                                    <div className="w-14 h-14 rounded-[16px] bg-[#4F46E5] flex items-center justify-center text-white mb-5 shadow-[0_4px_12px_rgba(79,70,229,0.3)]">
                                        <BarChart2 size={28} />
                                    </div>
                                    <h1 className="text-[24px] font-extrabold leading-[1.3] mb-2 break-keep">
                                        나의 직무 역량<br />현황 분석
                                    </h1>
                                    <p className="text-[13px] text-[#4F46E5] font-bold">포트폴리오 기반 AI 분석 결과</p>
                                </div>
                                <button
                                    onClick={onStartPortfolioSearch}
                                    className="mb-1 px-4 py-2.5 bg-white border border-[#4F46E5] text-[#4F46E5] rounded-xl text-[13px] font-bold shadow-sm hover:bg-[#F2F3FB] transition-all flex items-center gap-1.5"
                                >
                                    <BarChart2 size={14} /> 다시 진단하기
                                </button>
                            </div>

                            <div className="px-6 py-8 flex flex-col gap-8">
                                {/* 레이더 차트 */}
                                <section className="bg-white rounded-[24px] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-[16px] font-bold">역량 오각형</h2>
                                        <span className="text-[11px] font-bold text-[#4F46E5] bg-[#F2F3FB] px-2.5 py-1 rounded-full">
                                            지망직무: {scores?.careerFields?.join(', ') || '미설정'}
                                        </span>
                                    </div>
                                    <RadarChart data={radarData} />
                                    {/* 수치 요약 */}
                                    <div className="grid grid-cols-5 gap-1 mt-4">
                                        {radarData.map(d => (
                                            <div key={d.label} className="flex flex-col items-center gap-1">
                                                <div className="text-[11px] font-bold text-[#999]">{d.label}</div>
                                                <div className="text-[14px] font-extrabold text-[#4F46E5]">{d.value}</div>
                                                {/* 게이지 바 */}
                                                <div className="w-full h-1 bg-[#E5E7EB] rounded-full overflow-hidden">
                                                    <div className="h-full bg-[#4F46E5] rounded-full" style={{ width: `${d.value}%` }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                {/* 부족 역량 리스트 */}
                                <section>
                                    <div className="flex items-center gap-2 mb-4">
                                        <AlertCircle size={16} className="text-[#FF5A00]" />
                                        <h2 className="text-[16px] font-bold">보강이 필요한 역량</h2>
                                    </div>
                                    <div className="flex flex-col gap-2.5">
                                        {isAiLoading ? (
                                            <div className="bg-white p-8 rounded-[16px] flex flex-col items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.03)] border border-[#E5E7EB] border-dashed">
                                                <Loader2 size={24} className="animate-spin text-[#4F46E5] mb-2" />
                                                <p className="text-[13px] font-bold text-[#666]">AI가 역량 데이터를 분석하고 있어요</p>
                                            </div>
                                        ) : (
                                            weakPoints.map((w, i) => (
                                                <div key={i} className="bg-white p-4 rounded-[16px] flex items-center gap-4 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
                                                    <span className="text-[22px]">{w.icon}</span>
                                                    <div className="flex-1">
                                                        <p className="text-[14px] font-bold text-[#111]">{w.text}</p>
                                                    </div>
                                                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0
                                                        ${w.level === '높음' ? 'bg-[#FFF5F0] text-[#FF5A00]' : 'bg-[#F4F4F5] text-[#666]'}`}>
                                                        {w.level}
                                                    </span>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </section>

                                {/* CTA */}
                                <button onClick={() => setTab('roadmap')}
                                    className="w-full py-4 bg-[#4F46E5] text-white rounded-[18px] text-[15px] font-bold flex justify-center items-center gap-2 shadow-[0_4px_16px_rgba(79,70,229,0.3)]">
                                    맞춤 로드맵 보러가기 <ChevronRight size={18} />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* ── 탭 2: 커리어 로드맵 ── */}
                    {tab === 'roadmap' && (
                        <motion.div key="roadmap" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.25 }}>
                            {/* Hero */}
                            <div className="bg-[#F2F3FB] px-6 py-8">
                                <div className="w-14 h-14 rounded-[16px] bg-[#4F46E5] flex items-center justify-center text-white mb-5 shadow-[0_4px_12px_rgba(79,70,229,0.3)]">
                                    <Compass size={28} />
                                </div>
                                <h1 className="text-[24px] font-extrabold leading-[1.3] mb-2 break-keep">
                                    단계별로 달성하는<br />커리어 퀘스트
                                </h1>
                                <p className="text-[13px] text-[#4F46E5] font-bold">AI가 분석한 최적의 성장 로드맵입니다.</p>
                            </div>

                            <div className="px-6 py-8 flex flex-col gap-10">
                                {/* 맞춤 콘텐츠 추천 */}
                                <section>
                                    <div className="flex items-center gap-2 mb-4">
                                        <BookOpen size={16} className="text-[#4F46E5]" />
                                        <h2 className="text-[16px] font-bold">맞춤 교육 추천</h2>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        {isAiLoading ? (
                                            <div className="bg-white p-8 rounded-[18px] flex flex-col items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.03)] border border-[#E5E7EB] border-dashed">
                                                <Loader2 size={24} className="animate-spin text-[#4F46E5] mb-2" />
                                                <p className="text-[13px] font-bold text-[#666]">추천 교육을 찾고 있어요</p>
                                            </div>
                                        ) : (
                                            recommendations.map((rec, i) => (
                                                <div key={i} className="bg-white p-4 rounded-[18px] flex items-center gap-4 shadow-[0_2px_8px_rgba(0,0,0,0.03)] border border-black/[0.02]">
                                                    <div className={`w-10 h-10 shrink-0 rounded-[12px] flex items-center justify-center text-[11px] font-bold
                                                        ${rec.free ? 'bg-[#F0FDF4] text-[#16A34A]' : 'bg-[#F4F4F5] text-[#555]'}`}>
                                                        {rec.free ? '무료' : '유료'}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-[13px] font-extrabold text-[#111] break-keep leading-[1.4]">{rec.title}</div>
                                                        <div className="text-[11px] text-[#999] mt-1">{rec.org} · {rec.tag}</div>
                                                    </div>
                                                    <div className="flex gap-2 shrink-0">
                                                        <button onClick={() => onToggleBookmark({ ...rec, id: `skill-rec-${i}`, category: 'skill-rec' })} className="text-[#CCC] hover:text-[#FF5A00] transition-colors">
                                                            <Bookmark size={16} className={isBookmarked('skill-rec', `skill-rec-${i}`) ? 'text-[#FF5A00] fill-[#FF5A00]' : ''} />
                                                        </button>
                                                        <button className="text-[#CCC] hover:text-[#4F46E5] transition-colors">
                                                            <ExternalLink size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </section>

                                {/* 퀘스트 타임라인 */}
                                <section>
                                    <h2 className="text-[16px] font-bold mb-6">나의 퀘스트 현황</h2>
                                    <div className="relative border-l-[3px] border-[#E5E7EB] ml-4 flex flex-col gap-8 pb-4">
                                        {isAiLoading ? (
                                            <div className="bg-white p-8 rounded-[18px] ml-4 flex flex-col items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.03)] border border-[#E5E7EB] border-dashed">
                                                <Loader2 size={24} className="animate-spin text-[#4F46E5] mb-2" />
                                                <p className="text-[13px] font-bold text-[#666]">맞춤형 퀘스트를 설계하고 있어요</p>
                                            </div>
                                        ) : (
                                            quests.map((q) => (
                                                <div key={q.id} className="relative pl-8">
                                                    {/* 타임라인 점 */}
                                                    <div className={`absolute -left-[14px] top-1 w-6 h-6 rounded-full flex items-center justify-center border-[4px] border-[#F8F9FA]
                                                        ${q.status === 'done' ? 'bg-[#4F46E5]' : q.status === 'current' ? 'bg-[#FF5A00] ring-4 ring-[#FF5A00]/20' : 'bg-[#D1D5DB]'}`}>
                                                        {q.status === 'done' && <CheckCircle2 size={12} className="text-white" />}
                                                    </div>

                                                    <div className={`bg-white p-5 rounded-[20px] shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-black/[0.02] transition-all
                                                        ${q.status === 'locked' ? 'opacity-50' : 'hover:-translate-y-1'}`}>
                                                        <div className="flex items-start justify-between gap-2 mb-2">
                                                            <div className="flex items-start gap-2 pt-0.5">
                                                                {q.status === 'done' && <span className="shrink-0 whitespace-nowrap mt-0.5 px-2 py-0.5 rounded bg-[#F2F3FB] text-[#4F46E5] text-[11px] font-bold">완료</span>}
                                                                {q.status === 'current' && <span className="shrink-0 whitespace-nowrap mt-0.5 px-2 py-0.5 rounded bg-[#FFF5F0] text-[#FF5A00] text-[11px] font-bold">진행중</span>}
                                                                {q.status === 'locked' && <div className="shrink-0 mt-1"><Lock size={14} className="text-[#999]" /></div>}
                                                                <h3 className="flex-1 text-[15px] font-bold text-[#111] leading-[1.4] break-keep">{q.title}</h3>
                                                            </div>
                                                            <button onClick={() => onToggleBookmark({ ...q, category: 'skill-quest' })} className="text-[#CCC] hover:text-[#FF5A00] transition-colors shrink-0 pt-0.5">
                                                                <Bookmark size={18} className={isBookmarked('skill-quest', q.id) ? 'text-[#FF5A00] fill-[#FF5A00]' : ''} />
                                                            </button>
                                                        </div>
                                                        <p className="text-[13px] text-[#666] leading-[1.6] break-keep">{q.desc}</p>

                                                        {/* 주간 목표 */}
                                                        {q.weeklyGoals && (
                                                            <div className="mt-4 pt-4 border-t border-[#F0F0F0] flex flex-col gap-2">
                                                                {q.weeklyGoals.map((g, gi) => (
                                                                    <div key={gi} className="flex items-center gap-3">
                                                                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0
                                                                            ${q.status === 'done' ? 'text-[#4F46E5] bg-[#F2F3FB]' : 
                                                                            q.status === 'locked' ? 'text-[#999] bg-[#F4F4F5]' : 
                                                                            'text-[#FF5A00] bg-[#FFF5F0]'}`}>
                                                                            {g.week}
                                                                        </span>
                                                                        <span className={`text-[13px] font-medium ${q.status === 'done' ? 'text-[#666] line-through opacity-70' : q.status === 'locked' ? 'text-[#999]' : 'text-[#333]'}`}>{g.task}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}

                                                        {q.status === 'current' && (
                                                            <div className="mt-4 pt-4 border-t border-[#F0F0F0]">
                                                                <button onClick={() => completeQuest(q.id)} className="w-full py-3.5 bg-[#111] text-white rounded-[14px] text-[15px] font-bold flex justify-center items-center gap-2 shadow-md hover:bg-black transition-colors">
                                                                    퀘스트 완료하기 <ChevronRight size={18} />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))
                                        )}
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