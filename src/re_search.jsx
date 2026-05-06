import { useState, useEffect } from 'react'
import { Briefcase, Sprout, ClipboardList, ChevronLeft, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const QUESTIONS = [
    // [구직 준비도]
    { id: 1, catIdx: 0, cat: '구직 준비도', text: '마지막으로 구직 활동(지원서 제출, 면접 등)을 하신 시기는 언제인가요?', options: ['0개월~1년 사이', '1년 이상', '구직 경험 없음'] },
    { id: 2, catIdx: 0, cat: '구직 준비도', text: '본인의 직무 역량(자격증, 프로젝트 등)이 시장에서 어느 정도 수준이라고 생각하시나요?', options: ['충분함', '보강이 필요함', '전혀 모르겠음'] },
    { id: 3, catIdx: 0, cat: '구직 준비도', text: '자기소개서나 면접 등 실전 취업 기술에 대해 얼마나 자신 있나요?', options: ['능숙함', '이론은 알지만 실전은 어려움', '아예 모름'] },

    // [심리 상태]
    { id: 4, catIdx: 1, cat: '심리 상태', text: '현재 아침에 일어날 때 느끼는 에너지 수준은 어떠신가요?', options: ['활기참', '보통', '무기력하고 아무것도 하기 싫음'] },
    { id: 5, catIdx: 1, cat: '심리 상태', text: '새로운 일을 시작하거나 구직 활동을 생각할 때 드는 감정은?', options: ['기대감/설렘', '막막함/불안함', '거부감/회피하고 싶음'] },
    { id: 6, catIdx: 1, cat: '심리 상태', text: '최근 한 달간 사람들과의 교류나 외부 활동 빈도는 어떠했나요?', options: ['주기적으로 활동함', '가끔 나감', '거의 집에서만 생활함'] },

    // [정보 접근성]
    { id: 7, catIdx: 2, cat: '정보 접근성', text: '정부나 대구시에서 제공하는 청년 지원 정책을 이용해 본 적 있나요?', options: ['잘 알고 이용 중임', '들어봤지만 신청법을 모름', '나에게 해당되는 게 있는지 모름'] },
    { id: 8, catIdx: 2, cat: '정보 접근성', text: '구직 활동을 주저하게 만드는 가장 큰 외부적 요인은 무엇인가요?', options: ['나에게 맞는 일자리 부족', '경제적 여유 부족', '지원 정책 정보 부족'] },
    { id: 9, catIdx: 2, cat: '정보 접근성', text: '나에게 맞는 취업 정보나 정책을 찾는 경로를 아시나요?', options: ['경로를 잘 알고 있다', '찾기 어렵다', '어디서부터 찾아야 할지 모른다'] },
]

const CAT_COLORS = ['#FF5A00', '#4F46E5', '#16A34A']
const CAT_BG = ['#FFF5F0', '#EEEDF9', '#F0FDF4']
const CAT_ICONS = [Briefcase, Sprout, ClipboardList]
const CAT_NAMES = ['구직 준비도', '심리 상태', '정보 접근성']

export default function ReSearch({ onComplete, onBack }) {
    const [current, setCurrent] = useState(0)
    const [answers, setAnswers] = useState({})
    const [selected, setSelected] = useState(null)
    const [direction, setDirection] = useState(1)

    const q = QUESTIONS[current]
    const isLast = current === QUESTIONS.length - 1
    const color = CAT_COLORS[q.catIdx]
    const bgColor = CAT_BG[q.catIdx]

    useEffect(() => {
        setSelected(answers[q.id] ?? null)
    }, [current, answers, q.id])

    const handleNext = () => {
        if (selected === null) return
        const newAnswers = { ...answers, [q.id]: selected }
        setAnswers(newAnswers)

        if (isLast) {
            const catScores = [0, 0, 0]
            let total = 0

            QUESTIONS.forEach((question) => {
                const score = 3 - (newAnswers[question.id] ?? 2)
                catScores[question.catIdx] += score
                total += score
            })

            onComplete({ totalScore: total, categoryScores: catScores })
        } else {
            setDirection(1)
            setCurrent((c) => c + 1)
        }
    }

    const handlePrev = () => {
        if (current === 0) onBack()
        else {
            setDirection(-1)
            setCurrent((c) => c - 1)
        }
    }

    const variants = {
        enter: (dir) => ({ x: dir > 0 ? 50 : -50, opacity: 0 }),
        center: { zIndex: 1, x: 0, opacity: 1 },
        exit: (dir) => ({ zIndex: 0, x: dir < 0 ? 50 : -50, opacity: 0 })
    };

    return (
        <div className="flex flex-col h-full w-full bg-[#F8F9FA] text-[#111] relative overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-4 bg-white sticky top-0 z-20 border-b border-[#F0F0F0]">
                <button onClick={handlePrev} className="flex items-center gap-1 text-[#666] hover:text-[#111] transition-colors font-medium -ml-2">
                    <ChevronLeft size={22} />
                    <span>{current === 0 ? '이전' : '이전'}</span>
                </button>
                <div className="text-[13px] font-bold px-3 py-1 rounded-full" style={{ color: color, backgroundColor: bgColor }}>
                    {current + 1} / {QUESTIONS.length}
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-[#E5E7EB] h-1.5 relative">
                <div className="absolute top-0 left-0 h-full transition-all duration-300 ease-out"
                    style={{ width: `${((current + (selected !== null ? 1 : 0)) / QUESTIONS.length) * 100}%`, backgroundColor: color }} />
            </div>

            {/* Category tabs */}
            <div className="bg-white px-6 py-4 flex gap-3 overflow-x-auto scrollbar-hide border-b border-[#F0F0F0] shrink-0">
                <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; } .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
                {CAT_NAMES.map((name, i) => {
                    const isActive = q.catIdx === i;
                    const Icon = CAT_ICONS[i];
                    return (
                        <div key={name} className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all whitespace-nowrap ${isActive ? 'shadow-sm border border-transparent' : 'opacity-40'}`}
                            style={{ backgroundColor: isActive ? CAT_BG[i] : '#FFF', borderColor: isActive ? CAT_COLORS[i] : '', color: isActive ? CAT_COLORS[i] : '#999' }}>
                            <Icon size={15} />
                            <span className={`text-[12px] ${isActive ? 'font-bold' : 'font-medium'}`}>{name}</span>
                        </div>
                    )
                })}
            </div>

            {/* Question Area */}
            <div className="flex-1 overflow-y-auto px-6 pt-8 pb-32 relative">
                <AnimatePresence custom={direction} mode="wait">
                    <motion.div key={current} custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3, ease: "easeInOut" }} className="w-full">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold mb-4" style={{ backgroundColor: bgColor, color: color }}>
                            {q.cat}
                        </div>
                        <h2 className="text-[21px] font-extrabold leading-[1.4] mb-8 break-keep">
                            <span style={{ color: color }} className="mr-1.5">Q{q.id}.</span>
                            {q.text}
                        </h2>
                        <div className="flex flex-col gap-3">
                            {q.options.map((opt, i) => {
                                const isSelected = selected === i;
                                return (
                                    <motion.button whileTap={{ scale: 0.98 }} key={i} onClick={() => setSelected(i)}
                                        className={`w-full text-left p-5 rounded-[18px] border-[1.5px] flex items-center gap-4 transition-all ${isSelected ? 'shadow-md bg-white' : 'border-[#EEE] bg-white text-[#666]'}`}
                                        style={{ borderColor: isSelected ? color : undefined }}>
                                        <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-[1.5px] transition-colors"
                                            style={{ borderColor: isSelected ? color : '#DDD', backgroundColor: isSelected ? color : 'transparent', color: isSelected ? 'white' : '#CCC' }}>
                                            {isSelected ? <Check size={14} strokeWidth={3} /> : <span className="text-[11px] font-bold">{i + 1}</span>}
                                        </div>
                                        <span className={`text-[15px] ${isSelected ? 'font-bold text-[#111]' : 'font-medium'}`}>{opt}</span>
                                    </motion.button>
                                )
                            })}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Footer Action */}
            <div className="absolute bottom-0 left-0 w-full bg-white/80 backdrop-blur-xl border-t border-black/[0.04] p-6 pb-safe-offset z-50">
                <style>{`.pb-safe-offset { padding-bottom: calc(max(env(safe-area-inset-bottom), 24px)); }`}</style>
                <motion.button whileTap={selected !== null ? { scale: 0.98 } : {}} onClick={handleNext} disabled={selected === null}
                    className={`w-full py-4 rounded-[16px] text-[16px] font-bold flex justify-center items-center transition-all duration-300 ${selected !== null ? 'text-white' : 'bg-[#E5E7EB] text-[#A1A1AA] cursor-not-allowed'}`}
                    style={{ backgroundColor: selected !== null ? color : undefined, boxShadow: selected !== null ? `0 8px 24px ${color}40` : undefined }}>
                    {isLast ? '재진단 완료 · 결과 보기' : '다음 문항으로'}
                </motion.button>
            </div>
        </div>
    )
}
