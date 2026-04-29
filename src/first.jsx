import { useEffect } from 'react'

const TRACKS = [
    {
        id: 'job',
        emoji: '💼',
        label: '취업 정보',
        desc: '대구 청년 정책·공고 맞춤 추천',
        color: '#FF6B35',
        bg: '#FFF3EE',
        tag: '정책 매칭',
    },
    {
        id: 'skill',
        emoji: '🎯',
        label: '역량 개발',
        desc: 'AI 역량 진단 + 커리어 로드맵',
        color: '#2D6A4F',
        bg: '#EEF7F2',
        tag: '커리어 설계',
    },
    {
        id: 'mental',
        emoji: '🌱',
        label: '심리 회복',
        desc: 'AI 상담 + 성장 타임라인',
        color: '#7B5EA7',
        bg: '#F3EEF9',
        tag: '마음 챙김',
    },
]

const STATS = [
    { value: '44.3만', label: '2024 쉬었음 청년' },
    { value: '70%', label: '10년간 증가' },
    { value: '3가지', label: '맞춤 케어 트랙' },
]

export default function First({ onStart }) {
    useEffect(() => {
        const els = document.querySelectorAll('.reveal')
        els.forEach((el, i) => {
            el.style.opacity = '0'
            el.style.transform = 'translateY(20px)'
            el.style.transition = `opacity 0.5s ease ${i * 0.1}s, transform 0.5s ease ${i * 0.1}s`
            setTimeout(() => {
                el.style.opacity = '1'
                el.style.transform = 'translateY(0)'
            }, 50)
        })
    }, [])

    return (
        <div className="page">
            {/* Header */}
            <header className="header">
                <div className="logo">
                    <span className="logo-mark">쉬</span>
                    <span className="logo-text">었음청년</span>
                </div>
                <div className="daegu-badge">📍 대구광역시</div>
            </header>

            {/* Hero */}
            <section className="hero">
                <div className="circle c1" />
                <div className="circle c2" />

                <div className="hero-tag reveal">🌟 대구 청년 맞춤 플랫폼</div>

                <h1 className="hero-title reveal">
                    쉬고 있는 지금,<br />
                    <span className="accent">괜찮습니다.</span>
                </h1>

                <p className="hero-desc reveal">
                    쉬었음 청년을 위한 맞춤 진단부터<br />
                    취업·역량·심리 케어까지 한 번에.
                </p>

                <div className="stats reveal">
                    {STATS.map((s) => (
                        <div className="stat" key={s.label}>
                            <span className="stat-value">{s.value}</span>
                            <span className="stat-label">{s.label}</span>
                        </div>
                    ))}
                </div>

                <button className="btn-primary reveal" onClick={onStart}>
                    내 맞춤 진단 시작하기 →
                </button>
                <p className="cta-sub reveal">약 3분 소요 · 무료</p>
            </section>

            {/* Tracks */}
            <section className="tracks">
                <div className="section-label reveal">3가지 맞춤 케어 트랙</div>
                {TRACKS.map((t, i) => (
                    <div
                        className="track-card reveal"
                        key={t.id}
                        style={{ background: t.bg }}
                    >
                        <span className="track-emoji">{t.emoji}</span>
                        <div className="track-info">
                            <div className="track-top">
                                <span className="track-name">{t.label}</span>
                                <span className="track-tag" style={{ color: t.color }}>{t.tag}</span>
                            </div>
                            <p className="track-desc">{t.desc}</p>
                        </div>
                        <span className="track-arrow" style={{ color: t.color }}>›</span>
                    </div>
                ))}
            </section>

            {/* Daegu */}
            <div className="daegu-box reveal">
                <span className="daegu-icon">🏙️</span>
                <div>
                    <div className="daegu-title">대구 특화 서비스</div>
                    <div className="daegu-desc">대구시 청년 정책·일자리·교육을 AI가 추천해요</div>
                </div>
            </div>

            {/* Bottom CTA */}
            <div className="bottom-cta reveal">
                <button className="btn-primary" onClick={onStart}>지금 바로 시작하기 →</button>
            </div>
        </div>
    )
}