import { useEffect } from 'react'

const TRACKS = {
    job: {
        emoji: '💼', label: '취업 정보',
        desc: '대구 청년 맞춤 정책과 공고를 AI가 자동 추천해드려요.',
        detail: '워크넷 연동 맞춤 공고 · 대구형 청년 수당 · 월세 지원 매칭',
        color: '#FF6B35', bg: '#FFF3EE', range: '9~13점',
    },
    skill: {
        emoji: '🎯', label: '역량 개발',
        desc: 'AI가 분석한 역량 진단과 단계별 커리어 로드맵을 제공해요.',
        detail: 'AI 역량 오각형 그래프 · 맞춤 국비 교육 연계 · 퀘스트형 목표',
        color: '#2D6A4F', bg: '#EEF7F2', range: '14~19점',
    },
    mental: {
        emoji: '🌱', label: '심리 회복',
        desc: 'AI 상담과 성장 타임라인으로 꾸준히 준비했음을 보여줘요.',
        detail: 'AI 대화 상담 · 성장 타임라인 · 커뮤니티 · 경험 추출기',
        color: '#7B5EA7', bg: '#F3EEF9', range: '20~27점',
    },
}

function getTrack(total) {
    if (total <= 13) return 'job'
    if (total <= 19) return 'skill'
    return 'mental'
}

/* ── SVG 레이더 그래프 (5각형) ── */
function Radar({ scores }) {
    const SIZE = 200
    const CX = SIZE / 2
    const CY = SIZE / 2
    const R = 70
    const N = 5

    // 5개 축 데이터 (3개 카테고리 → 5축으로 배분)
    const vals = [
        scores[0],                        // 구직 준비도
        (scores[0] + scores[2]) / 2,      // 실전 역량
        scores[2],                        // 정보 접근성
        scores[1],                        // 심리 상태
        (scores[1] + scores[0]) / 2,      // 종합
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
    const labelPts = Array.from({ length: N }, (_, i) => pt(i, 1.28))

    return (
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} width="200" height="200">
            {/* grid */}
            {bgLevels.map((lv) => (
                <polygon
                    key={lv}
                    points={toPolyStr(Array.from({ length: N }, (_, i) => pt(i, lv)))}
                    fill="none" stroke="#E8E6E1" strokeWidth="1"
                />
            ))}
            {/* axes */}
            {axisPts.map((p, i) => (
                <line key={i} x1={CX} y1={CY} x2={p.x} y2={p.y} stroke="#E8E6E1" strokeWidth="1" />
            ))}
            {/* data */}
            <polygon
                points={toPolyStr(dataPts)}
                fill="rgba(255,107,53,0.2)" stroke="#FF6B35" strokeWidth="2" strokeLinejoin="round"
            />
            {dataPts.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r="4" fill="#FF6B35" />
            ))}
            {/* labels */}
            {labelPts.map((p, i) => (
                <text key={i} x={p.x} y={p.y}
                    textAnchor="middle" dominantBaseline="middle"
                    fontSize="7.5" fill="#5A5A5A" fontFamily="Noto Sans KR" fontWeight="500"
                >
                    {labels[i]}
                </text>
            ))}
        </svg>
    )
}

export default function Result({ scores, onRetry, onHome }) {
    const { totalScore, categoryScores } = scores
    const trackKey = getTrack(totalScore)
    const track = TRACKS[trackKey]
    const others = Object.keys(TRACKS).filter((k) => k !== trackKey)

    const catNames = ['구직 준비도', '심리 상태', '정보 접근성']
    const catColors = ['#FF6B35', '#7B5EA7', '#1B4D8E']

    useEffect(() => {
        const els = document.querySelectorAll('.rr')
        els.forEach((el, i) => {
            el.style.opacity = '0'
            el.style.transform = 'translateY(20px)'
            el.style.transition = `opacity 0.5s ease ${0.1 + i * 0.12}s, transform 0.5s ease ${0.1 + i * 0.12}s`
            setTimeout(() => {
                el.style.opacity = '1'
                el.style.transform = 'translateY(0)'
            }, 50)
        })
    }, [])

    return (
        <div className="page result-page">
            <header className="result-header">
                <button className="back-btn" onClick={onHome}>← 홈으로</button>
                <span className="result-title">진단 결과</span>
                <div style={{ width: 60 }} />
            </header>

            {/* Score banner */}
            <div className="score-banner rr" style={{ background: track.color }}>
                <div className="score-label-text">총 점수</div>
                <div className="score-num">{totalScore}<span className="score-denom"> / 27</span></div>
                <div className="score-track">→ {track.label} 트랙 추천</div>
            </div>

            {/* Radar */}
            <section className="radar-sec rr">
                <div className="sec-title">나의 현재 상태</div>
                <div className="radar-center">
                    <Radar scores={categoryScores} />
                </div>

                <div className="cat-bars">
                    {catNames.map((name, i) => (
                        <div className="cat-bar" key={name}>
                            <div className="cat-bar-row">
                                <span className="cat-bar-name">{name}</span>
                                <span className="cat-bar-val" style={{ color: catColors[i] }}>
                                    {categoryScores[i]}<span className="cat-bar-max">/9</span>
                                </span>
                            </div>
                            <div className="bar-bg">
                                <div
                                    className="bar-fill"
                                    style={{
                                        width: `${(categoryScores[i] / 9) * 100}%`,
                                        background: catColors[i],
                                        transition: `width 0.8s ease ${0.5 + i * 0.1}s`,
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Recommended */}
            <section className="rec-sec rr">
                <div className="sec-title">추천 트랙</div>
                <div className="rec-card" style={{ background: track.bg, borderColor: track.color }}>
                    <div className="rec-head">
                        <span className="rec-emoji">{track.emoji}</span>
                        <div>
                            <div className="rec-badge" style={{ background: track.color }}>추천</div>
                            <div className="rec-name">{track.label}</div>
                        </div>
                    </div>
                    <p className="rec-desc">{track.desc}</p>
                    <div className="rec-detail">{track.detail}</div>
                    <button
                        className="btn-primary"
                        style={{ background: track.color, boxShadow: `0 4px 16px ${track.color}44` }}
                    >
                        {track.label} 시작하기 →
                    </button>
                </div>
            </section>

            {/* Other tracks */}
            <section className="other-sec rr">
                <div className="sec-title">다른 트랙도 언제든 이용할 수 있어요</div>
                {others.map((k) => {
                    const t = TRACKS[k]
                    return (
                        <div key={k} className="other-card" style={{ background: t.bg }}>
                            <span className="other-emoji">{t.emoji}</span>
                            <div className="other-info">
                                <div className="other-name">{t.label}</div>
                                <div className="other-range">{t.range}</div>
                            </div>
                            <span className="other-arrow" style={{ color: t.color }}>›</span>
                        </div>
                    )
                })}
            </section>

            {/* Retest */}
            <div className="retest rr">
                <span>🗓️</span>
                <div>
                    <div className="retest-title">1개월 후 재검사 권장</div>
                    <div className="retest-desc">상황이 변하면 추천 트랙도 달라질 수 있어요</div>
                </div>
            </div>

            {/* Buttons */}
            <div className="result-btns rr">
                <button className="sub-btn" onClick={onRetry}>🔄 다시 진단하기</button>
                <button className="sub-btn" onClick={onHome}>🏠 홈으로</button>
            </div>
        </div>
    )
}