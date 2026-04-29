import { useState, useEffect } from 'react'

const QUESTIONS = [
    {
        id: 1, catIdx: 0, cat: '구직 준비도 및 경험',
        text: '마지막으로 구직 활동(지원서 제출, 면접 등)을 하신 시기는 언제인가요?',
        options: ['0개월~1년 사이', '1년 이상', '구직 경험 없음'],
    },
    {
        id: 2, catIdx: 0, cat: '구직 준비도 및 경험',
        text: '본인의 직무 역량(자격증, 프로젝트 등)이 시장에서 어느 정도 수준이라고 생각하시나요?',
        options: ['충분하지만 정보가 부족함', '보강이 필요함', '무엇을 준비해야 할지 전혀 모름'],
    },
    {
        id: 3, catIdx: 0, cat: '구직 준비도 및 경험',
        text: '자기소개서나 면접 등 실전 취업 기술에 대해 얼마나 자신 있나요?',
        options: ['능숙함', '이론은 알지만 실전은 어려움', '아예 모름'],
    },
    {
        id: 4, catIdx: 1, cat: '심리 상태 및 무기력도',
        text: '현재 아침에 일어날 때 느끼는 에너지 수준은 어떠신가요?',
        options: ['활기참', '보통', '무기력하고 아무것도 하기 싫음'],
    },
    {
        id: 5, catIdx: 1, cat: '심리 상태 및 무기력도',
        text: '새로운 일을 시작하거나 구직 활동을 생각할 때 가장 먼저 드는 감정은?',
        options: ['기대감/설렘', '막막함/불안함', '거부감/회피하고 싶음'],
    },
    {
        id: 6, catIdx: 1, cat: '심리 상태 및 무기력도',
        text: '최근 한 달간 사람들과의 교류나 외부 활동 빈도는 어떠했나요?',
        options: ['주기적으로 활동함', '가끔 나감', '거의 집에서만 생활함'],
    },
    {
        id: 7, catIdx: 2, cat: '정보 접근성 및 환경',
        text: '정부나 대구시에서 제공하는 청년 지원 정책(수당, 교육 등)을 이용해 본 적 있나요?',
        options: ['잘 알고 이용 중임', '들어봤지만 신청법을 모름', '나에게 해당되는 게 있는지 모름'],
    },
    {
        id: 8, catIdx: 2, cat: '정보 접근성 및 환경',
        text: '구직 활동을 주저하게 만드는 가장 큰 외부적 요인은 무엇인가요?',
        options: ['나에게 맞는 양질의 일자리 부족', '경제적 여유 부족', '지원 정책 정보 부족'],
    },
    {
        id: 9, catIdx: 2, cat: '정보 접근성 및 환경',
        text: '나에게 맞는 취업 정보나 정책을 어떻게 찾는지 아시나요?',
        options: ['필요한 정보를 찾는 경로를 잘 알고 있다', '검색해봤지만 딱 맞는 정보 찾기 어렵다', '무엇을 어디서부터 찾아야 할지 모른다'],
    },
]

const CAT_COLORS = ['#FF6B35', '#7B5EA7', '#1B4D8E']
const CAT_EMOJIS = ['💼', '🌱', '📋']
const CAT_NAMES = ['구직 준비도', '심리 상태', '정보 접근성']

export default function Search({ onComplete, onBack }) {
    const [current, setCurrent] = useState(0)
    const [answers, setAnswers] = useState({})
    const [selected, setSelected] = useState(null)
    const [dir, setDir] = useState('in')

    const q = QUESTIONS[current]
    const isLast = current === QUESTIONS.length - 1
    const color = CAT_COLORS[q.catIdx]

    useEffect(() => {
        setSelected(answers[q.id] ?? null)
        setDir('in')
    }, [current])

    const handleNext = () => {
        if (selected === null) return
        const newAnswers = { ...answers, [q.id]: selected }
        setAnswers(newAnswers)

        if (isLast) {
            const catScores = [0, 0, 0]
            let total = 0
            QUESTIONS.forEach((question) => {
                const score = (newAnswers[question.id] ?? 0) + 1
                catScores[question.catIdx] += score
                total += score
            })
            onComplete({ totalScore: total, categoryScores: catScores })
        } else {
            setDir('out')
            setTimeout(() => setCurrent((c) => c + 1), 180)
        }
    }

    const handlePrev = () => {
        if (current === 0) onBack()
        else {
            setDir('out')
            setTimeout(() => setCurrent((c) => c - 1), 180)
        }
    }

    return (
        <div className="page search-page">
            {/* Header */}
            <header className="search-header">
                <button className="back-btn" onClick={handlePrev}>
                    ← {current === 0 ? '홈' : '이전'}
                </button>
                <span className="q-count">{current + 1} / {QUESTIONS.length}</span>
            </header>

            {/* Progress */}
            <div className="progress-wrap">
                <div
                    className="progress-fill"
                    style={{
                        width: `${((current + (selected !== null ? 0.5 : 0)) / QUESTIONS.length) * 100}%`,
                        background: color,
                    }}
                />
            </div>

            {/* Category tabs */}
            <div className="cat-tabs">
                {CAT_NAMES.map((name, i) => (
                    <div
                        key={name}
                        className={`cat-tab ${q.catIdx === i ? 'cat-active' : q.catIdx > i ? 'cat-done' : ''}`}
                        style={{ '--cc': CAT_COLORS[i] }}
                    >
                        <div className="cat-dot">{CAT_EMOJIS[i]}</div>
                        <span className="cat-name-text">{name}</span>
                    </div>
                ))}
            </div>

            {/* Question */}
            <div className={`q-wrap ${dir === 'out' ? 'q-out' : 'q-in'}`}>
                <div className="q-cat-tag" style={{ background: color + '22', color }}>
                    {CAT_EMOJIS[q.catIdx]} {q.cat}
                </div>

                <h2 className="q-text">Q{q.id}. {q.text}</h2>

                <div className="options">
                    {q.options.map((opt, i) => (
                        <button
                            key={i}
                            className={`option ${selected === i ? 'opt-selected' : ''}`}
                            style={{ '--oc': color }}
                            onClick={() => setSelected(i)}
                        >
                            <div className="opt-circle">
                                {selected === i ? '✓' : ['①', '②', '③'][i]}
                            </div>
                            <span className="opt-text">{opt}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Next */}
            <div className="search-footer">
                <button
                    className="btn-primary"
                    onClick={handleNext}
                    disabled={selected === null}
                    style={{
                        background: selected !== null ? color : '#CCC',
                        boxShadow: selected !== null ? `0 4px 16px ${color}55` : 'none',
                    }}
                >
                    {isLast ? '결과 보기 →' : '다음 문항 →'}
                </button>
            </div>
        </div>
    )
}