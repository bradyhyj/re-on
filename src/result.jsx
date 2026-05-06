import { useEffect } from 'react'
import { Briefcase, Target, Sprout, Calendar, RotateCcw, Home, ChevronRight, ChevronLeft, Award, User } from 'lucide-react'
import { motion } from 'framer-motion'

// [유지] 트랙 데이터 정의
const TRACKS = {
    job: {
        icon: <Briefcase size={24} />, label: '취업 정보',
        desc: '대구 청년 맞춤 정책과 공고를 AI가 자동 추천해드려요.',
        detail: '워크넷 연동 맞춤 공고 · 대구형 청년 수당 · 월세 지원 매칭',
        color: '#FF5A00', bg: '#FFF5F0', reason: '정보 부족 보완',
    },
    skill: {
        icon: <Target size={24} />, label: '역량 개발',
        desc: 'AI가 분석한 역량 진단과 단계별 커리어 로드맵을 제공해요.',
        detail: 'AI 역량 오각형 그래프 · 맞춤 국비 교육 연계 · 퀘스트형 목표',
        color: '#FF8540', bg: '#FFF5F0', reason: '실전 역량 강화',
    },
    mental: {
        icon: <Sprout size={24} />, label: '심리 회복',
        desc: 'AI 상담과 성장 타임라인으로 꾸준히 준비했음을 보여줘요.',
        detail: 'AI 대화 상담 · 성장 타임라인 · 커뮤니티 · 경험 추출기',
        color: '#FFB080', bg: '#FFF5F0', reason: '심리 안정 케어',
    },
}

// [수정] 점수가 가장 '낮은' 파트를 트랙으로 추천하는 로직
function getTrack(categoryScores) {
    const scores = [
        { key: 'skill', score: categoryScores[0] },  // 구직 준비도
        { key: 'mental', score: categoryScores[1] }, // 심리 상태
        { key: 'job', score: categoryScores[2] }     // 정보 접근성
    ];

    // 오름차순 정렬: 점수가 가장 낮은(가장 취약한) 항목이 0번째로 오게 함
    scores.sort((a, b) => a.score - b.score);
    return scores[0].key;
}

/* [유지] SVG 레이더 그래프 */
function Radar({ scores }) {
    const SIZE = 240
    const CX = SIZE / 2
    const CY = SIZE / 2
    const R = 80
    const N = 5

    const vals = [
        scores[0],                         // 구직 준비도
        (scores[0] + scores[2]) / 2,       // 실전 역량
        scores[2],                         // 정보 접근성
        scores[1],                         // 심리 상태
        (scores[1] + scores[0]) / 2,       // 종합
    ]
    const labels = ['구직 준비도', '실전 역량', '정보 접근성', '심리 상태', '종합']
    const MAX = 9

    const pt = (i, ratio) => {
        const angle = (2 * Math.PI * i) / N - Math.PI / 2
        return {
            x: CX + R * ratio * Math.cos(angle),
            y: CY + R * ratio * Math.sin(angle),
        }
    }

    const bgLevels = [0.25, 0.5, 0.75, 1]
    const toPolyStr = (pts) => pts.map((p) => `${p.x},${p.y}`).join(' ')

    const axisPts = Array.from({ length: N }, (_, i) => pt(i, 1))
    const dataPts = vals.map((v, i) => pt(i, v / MAX))
    const labelPts = Array.from({ length: N }, (_, i) => pt(i, 1.3))

    return (
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full max-w-[240px] mx-auto overflow-visible">
            {bgLevels.map((lv) => (
                <polygon
                    key={lv}
                    points={toPolyStr(Array.from({ length: N }, (_, i) => pt(i, lv)))}
                    fill="none" stroke="#E5E7EB" strokeWidth="1"
                />
            ))}
            {axisPts.map((p, i) => (
                <line key={i} x1={CX} y1={CY} x2={p.x} y2={p.y} stroke="#E5E7EB" strokeWidth="1" />
            ))}
            <motion.polygon
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, type: "spring" }}
                style={{ transformOrigin: `${CX}px ${CY}px` }}
                points={toPolyStr(dataPts)}
                fill="rgba(255,90,0,0.15)" stroke="#FF5A00" strokeWidth="2.5" strokeLinejoin="round"
            />
            {dataPts.map((p, i) => (
                <motion.circle
                    key={i}
                    initial={{ r: 0 }}
                    animate={{ r: 4.5 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    cx={p.x} cy={p.y} fill="#FF5A00" stroke="#FFF" strokeWidth="1.5"
                />
            ))}
            {labelPts.map((p, i) => (
                <text key={i} x={p.x} y={p.y}
                    textAnchor="middle" dominantBaseline="middle"
                    fontSize="11" fill="#71717A" fontFamily="inherit" fontWeight="600"
                >
                    {labels[i]}
                </text>
            ))}
        </svg>
    )
}

// [수정] export default 추가 및 전체 디자인 유지
export default function Result({ scores, onRetry, onReSearch, onHome, onStartTrack, onProfile, isViewOnly, onClose }) {
    const { totalScore, categoryScores } = scores
    const trackKey = getTrack(categoryScores)
    const track = TRACKS[trackKey]
    const others = Object.keys(TRACKS).filter((k) => k !== trackKey)

    const catNames = ['구직 준비도', '심리 상태', '정보 접근성']
    const catColors = ['#FF8540', '#FFB080', '#FF5A00']

    const stagger = {
        hidden: { opacity: 0, y: 20 },
        visible: (i = 1) => ({
            opacity: 1,
            y: 0,
            transition: { staggerChildren: 0.1, delayChildren: 0.1 * i, duration: 0.6 }
        })
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    return (
        <div className="flex flex-col h-full w-full bg-[#F8F9FA] text-[#111] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-center px-6 pt-5 pb-4 bg-white sticky top-0 z-20 border-b border-[#F0F0F0]">
                <div className="text-[17px] font-bold">진단 결과</div>
            </div>

            <div className="flex-1 overflow-y-auto pb-32">
                {/* Score banner */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-white px-6 py-8 flex flex-col items-center border-b border-[#F0F0F0]"
                >
                    <div className="w-16 h-16 rounded-full bg-[#FFF5F0] flex items-center justify-center text-[#FF5A00] mb-3">
                        <Award size={32} strokeWidth={2} />
                    </div>
                    <div className="text-[15px] font-bold text-[#666] mb-1">나의 종합 진단 점수</div>
                    <div className="text-[42px] font-extrabold leading-none mb-3 text-[#111] tracking-tight">
                        {totalScore}<span className="text-[20px] text-[#A1A1AA] font-bold"> / 27</span>
                    </div>
                    {/* [수정] 상황이 안 좋을 때 점수가 낮으므로 직관적인 텍스트 노출 */}
                    <div className="text-[13px] font-bold text-[#FF5A00] mb-4">
                        {totalScore <= 12 ? "적극적인 관리가 필요한 상태입니다" : totalScore <= 20 ? "보완이 필요한 상태입니다" : "안정적인 상태입니다"}
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-bold text-[14px]" style={{ backgroundColor: track.bg, color: track.color }}>
                        {track.label} 트랙 추천
                    </div>
                </motion.div>

                <motion.div variants={stagger} initial="hidden" animate="visible" className="px-6 py-8 flex flex-col gap-8">
                    {/* Radar Section */}
                    <motion.section variants={item} className="bg-white p-6 rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-black/[0.02]">
                        <div className="text-[18px] font-bold mb-6">나의 현재 상태</div>
                        <div className="mb-8 flex justify-center">
                            <Radar scores={categoryScores} />
                        </div>

                        <div className="flex flex-col gap-4">
                            {catNames.map((name, i) => (
                                <div key={name}>
                                    <div className="flex justify-between items-center mb-1.5">
                                        <span className="text-[14px] font-bold text-[#555]">{name}</span>
                                        <span className="text-[14px] font-bold" style={{ color: catColors[i] }}>
                                            {categoryScores[i]}<span className="text-[#A1A1AA] text-[12px]">/9</span>
                                        </span>
                                    </div>
                                    <div className="w-full bg-[#F5F5F5] h-2.5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(categoryScores[i] / 9) * 100}%` }}
                                            transition={{ duration: 1, delay: 0.5 + i * 0.2 }}
                                            className="h-full rounded-full"
                                            style={{ backgroundColor: catColors[i] }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.section>

                    {!isViewOnly && (
                        <>
                            {/* Recommended Track */}
                            <motion.section variants={item}>
                                <div className="text-[20px] font-extrabold mb-1 px-1 leading-tight tracking-tight text-[#111]">
                                    메인 트랙 선택하고<br />서비스 이용하기
                                </div>
                                <div className="text-[14px] font-bold mb-4 px-1 text-[#999]">AI 추천 트랙</div>
                                <div className="p-6 rounded-[24px] border-[1.5px]" style={{ backgroundColor: track.bg, borderColor: `${track.color}40` }}>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-12 h-12 rounded-[14px] bg-white flex items-center justify-center shadow-sm" style={{ color: track.color }}>
                                            {track.icon}
                                        </div>
                                        <div>
                                            <div className="inline-block px-2 py-0.5 rounded text-[10px] font-bold text-white mb-1" style={{ backgroundColor: track.color }}>추천</div>
                                            <div className="text-[20px] font-bold text-[#111]">{track.label}</div>
                                        </div>
                                    </div>
                                    <p className="text-[15px] text-[#555] font-medium leading-[1.6] mb-4 break-keep">
                                        {track.desc}
                                    </p>
                                    <div className="bg-white/60 p-3 rounded-xl text-[13px] font-bold text-[#666] mb-6">
                                        {track.detail}
                                    </div>
                                    <motion.button
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => onStartTrack && onStartTrack(trackKey)}
                                        className="w-full py-4 rounded-[14px] text-white font-bold text-[15px] shadow-lg flex items-center justify-center gap-1.5 tracking-tight"
                                        style={{ backgroundColor: track.color, boxShadow: `0 8px 24px ${track.color}50` }}
                                    >
                                        지금 바로 시작하기 <ChevronRight size={18} />
                                    </motion.button>
                                </div>
                            </motion.section>

                            {/* Other Tracks */}
                            <motion.section variants={item}>
                                <div className="text-[16px] font-bold mb-4 px-1 text-[#666]">다른 트랙도 이용할 수 있어요</div>
                                <div className="flex flex-col gap-3">
                                    {others.map((k) => {
                                        const t = TRACKS[k]
                                        return (
                                            <motion.div
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => onStartTrack && onStartTrack(k)}
                                                key={k}
                                                className="bg-white p-4 rounded-[20px] shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-black/[0.02] flex items-center gap-4 cursor-pointer"
                                            >
                                                <div className="w-12 h-12 rounded-[12px] flex items-center justify-center shrink-0 bg-[#F4F4F5] text-[#71717A]">
                                                    {t.icon}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="text-[16px] font-bold text-[#111] mb-0.5">{t.label}</div>
                                                    <div className="text-[12px] font-medium text-[#999]">{t.reason} 추천</div>
                                                </div>
                                                <ChevronRight size={20} className="text-[#CCC]" />
                                            </motion.div>
                                        )
                                    })}
                                </div>
                            </motion.section>

                            {/* Retest Banner */}
                            <motion.div variants={item} className="bg-[#111] rounded-[20px] p-5 flex items-center gap-4 text-white">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                                    <Calendar size={20} className="text-white" />
                                </div>
                                <div>
                                    <div className="text-[15px] font-bold mb-1">1개월 후 재검사 권장</div>
                                    <div className="text-[13px] text-[#A1A1AA] break-keep font-medium">상황이 변하면 추천 트랙도 달라질 수 있어요</div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </motion.div>
            </div>

            {/* Bottom Actions */}
            <div className="absolute bottom-0 left-0 w-full bg-white/80 backdrop-blur-xl border-t border-black/[0.04] p-4 pb-safe-offset z-50">
                <style>{`.pb-safe-offset { padding-bottom: calc(max(env(safe-area-inset-bottom), 16px)); }`}</style>
                {isViewOnly ? (
                    <div className="flex flex-col gap-2 w-full">
                        <motion.button 
                            whileTap={{ scale: 0.98 }}
                            onClick={onReSearch} 
                            className="w-full py-4 rounded-[14px] bg-[#FF5A00] text-white font-bold text-[15px] flex items-center justify-center gap-2 shadow-sm hover:bg-[#E65100] transition-colors"
                        >
                            <RotateCcw size={18} /> 다시 진단하기
                        </motion.button>
                        <motion.button 
                            whileTap={{ scale: 0.98 }}
                            onClick={onClose} 
                            className="w-full py-3 rounded-[14px] bg-[#F4F4F5] text-[#666] font-bold text-[14px] flex items-center justify-center gap-2 transition-colors"
                        >
                            닫기
                        </motion.button>
                    </div>
                ) : (
                    <motion.button 
                        whileTap={{ scale: 0.98 }}
                        onClick={onRetry} 
                        className="w-full py-4 rounded-[14px] bg-white border border-[#E5E7EB] text-[#333] font-bold text-[15px] flex items-center justify-center gap-2 shadow-sm hover:bg-[#F8F9FA] transition-colors"
                    >
                        <RotateCcw size={18} /> 다시 진단하기
                    </motion.button>
                )}
            </div>
        </div>
    )
}