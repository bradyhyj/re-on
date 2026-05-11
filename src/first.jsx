import { useState, useRef } from 'react';
import { Briefcase, Compass, Heart, CreditCard, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// 사용자가 저장한 이미지를 불러옵니다.
// src/assets/ 폴더에 이미지를 저장하고 이름을 각각 folder.png, chart.png로 맞춰주세요.
import folderImg from './assets/folder.png';
import chartImg from './assets/chart.png';
import { useDragScroll } from './hooks/useDragScroll';

export default function First({ onStart }) {
    const [expandedTrack, setExpandedTrack] = useState(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const dragScroll = useDragScroll();
    const sliderRef = dragScroll.ref;

    const slides = [
        {
            id: 1,
            title: (
                <>쉬고 있는 지금,<br /><span className="text-[#FF5A00]">괜찮습니다.</span></>
            ),
            desc: (
                <>잠깐 멈춘 것뿐이에요.<br />조급해하지 않아도 괜찮아요.</>
            ),
            illustration: null,
            hasData: true
        },
        {
            id: 2,
            title: (
                <>나만을 위한<br /><span className="text-[#FF5A00]">맞춤 진단</span></>
            ),
            desc: (
                <>3분이면 충분해요.<br />취업·역량·심리 중 내게 맞는 트랙을 찾아드려요.</>
            ),
            illustration: (
                <img src={folderImg} alt="진단 폴더 이미지" className="w-full h-full object-contain relative z-10 p-4" />
            ),
            hasTracks: true
        },
        {
            id: 3,
            title: (
                <>한 걸음씩,<br /><span className="text-[#FF5A00]">함께 나아가요.</span></>
            ),
            desc: (
                <>대구 청년 정책부터 심리 지원까지<br />든든한 페이스메이커가 되어드릴게요.</>
            ),
            illustration: (
                <img src={chartImg} alt="성장 차트 이미지" className="w-full h-full object-contain relative z-10 p-4" />
            )
        }
    ];

    const tracks = [
        {
            id: 1,
            title: '취업 정보',
            tag: '정책 매칭',
            tagColor: '#FF5A00',
            tagBg: '#FFF5F0',
            desc: '대구 청년 정책·공고 맞춤 추천',
            detail: '워크넷과 연동하여 내 스펙과 관심사에 맞는 양질의 공고를 추천합니다. 또한 대구형 청년 수당, 월세 지원 등 지금 당장 받을 수 있는 지원 정책을 놓치지 않게 알려드려요.',
            icon: Briefcase
        },
        {
            id: 2,
            title: '역량 개발',
            tag: '커리어 설계',
            tagColor: '#4F46E5',
            tagBg: '#F2F3FB',
            desc: 'AI 역량 진단 + 커리어 로드맵',
            detail: '현재 나의 직무 역량을 다각도로 진단하고, 부족한 점을 채울 수 있는 국비 지원 교육이나 자격증 취득 경로 등 체계적인 퀘스트형 커리어 로드맵을 제공합니다.',
            icon: Compass
        },
        {
            id: 3,
            title: '심리 회복',
            tag: '마음 챙김',
            tagColor: '#16A34A',
            tagBg: '#F0FDF4',
            desc: 'AI 상담 + 성장 타임라인',
            detail: '구직 활동 중 지친 마음을 다독이는 AI 기반 멘탈 케어 서비스와, 대구시에서 지원하는 무료 전문 심리 상담 프로그램(청년마음건강지원)을 바로 연결해 드립니다.',
            icon: Heart
        }
    ];

    const handleScroll = (e) => {
        if (!sliderRef.current) return;
        const width = sliderRef.current.clientWidth;
        const scrollLeft = e.target.scrollLeft;
        const index = Math.round(scrollLeft / width);
        setCurrentSlide(index);
    };

    const toggleTrack = (id) => {
        if (expandedTrack === id) setExpandedTrack(null);
        else setExpandedTrack(id);
    };

    return (
        <div className="flex flex-col h-full w-full bg-white text-[#111] relative overflow-hidden">
            <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
                <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; } .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }`}</style>

                {/* Onboarding Slider Section */}
                <div className="h-full flex flex-col relative min-h-[600px] w-full">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex items-center px-6 pt-5 pb-4 bg-transparent z-20 shrink-0"
                    >
                        <div className="text-[20px] font-extrabold tracking-tight">
                            <span className="text-[#FF5A00]">다시:</span>
                            <span className="text-black">ON</span>
                        </div>
                    </motion.div>

                    {/* Slider */}
                    <div
                        className="flex-1 flex overflow-x-auto snap-x snap-mandatory scrollbar-hide select-none"
                        onScroll={handleScroll}
                        ref={sliderRef}
                        onMouseDown={dragScroll.onMouseDown}
                        onMouseLeave={dragScroll.onMouseLeave}
                        onMouseUp={dragScroll.onMouseUp}
                        onMouseMove={dragScroll.onMouseMove}
                        style={dragScroll.style}
                    >
                        {slides.map(slide => (
                            <div key={slide.id} className="w-full h-full flex-shrink-0 snap-start overflow-y-auto px-6 pb-10">
                                <div className="flex flex-col items-center justify-center min-h-full py-8">
                                    {/* Illustration */}
                                    {slide.illustration && (
                                        <motion.div
                                            initial={{ scale: 0.9, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ duration: 0.5 }}
                                            className="relative w-[200px] h-[200px] mb-6 shrink-0 flex items-center justify-center"
                                        >
                                            {slide.illustration}
                                        </motion.div>
                                    )}
                                    {/* Text */}
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ duration: 0.5, delay: 0.2 }}
                                        className="text-center text-[26px] font-extrabold leading-[1.3] tracking-tight mb-4 text-[#111]"
                                    >
                                        {slide.title}
                                    </motion.div>
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ duration: 0.5, delay: 0.3 }}
                                        className="text-center text-[15px] text-[#777] leading-[1.6] break-keep"
                                    >
                                        {slide.desc}
                                    </motion.div>

                                    {slide.hasData && (
                                        <motion.div
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ duration: 0.5, delay: 0.4 }}
                                            className="w-full mt-8 bg-[#F8F9FA] rounded-[24px] p-6 border border-black/[0.03]"
                                        >
                                            <div className="text-[15px] font-bold text-[#111] mb-2 flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-[#FF5A00]" />
                                                당신만의 고민이 아니에요
                                            </div>
                                            <div className="text-[13px] text-[#666] leading-relaxed break-keep mb-5">
                                                2024년 기준 <strong className="text-[#FF5A00]">44.3만 명</strong>의 청년들이 같은 시간을 보내고 있습니다. <span className="text-[#999]">(10년 전 대비 70% 증가)</span>
                                            </div>

                                            <div className="w-full mt-8 flex justify-center px-1">
                                                <svg viewBox="0 0 300 130" className="w-full max-w-[320px] overflow-visible">
                                                    <defs>
                                                        <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="0%" stopColor="#FF5A00" stopOpacity="0.15" />
                                                            <stop offset="100%" stopColor="#FF5A00" stopOpacity="0" />
                                                        </linearGradient>
                                                    </defs>
                                                    <motion.path
                                                        d="M 20,110 L 20,80 L 85,57.5 L 150,25 L 215,45 L 280,15 L 280,110 Z"
                                                        fill="url(#lineGrad)"
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        transition={{ duration: 1, delay: 0.8 }}
                                                    />
                                                    <motion.path
                                                        d="M 20,80 L 85,57.5 L 150,25 L 215,45 L 280,15"
                                                        fill="none"
                                                        stroke="#FF5A00"
                                                        strokeWidth="3"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        initial={{ pathLength: 0 }}
                                                        animate={{ pathLength: 1 }}
                                                        transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
                                                    />
                                                    {[
                                                        { x: 20, y: 80, val: '2.8%', year: '14년' },
                                                        { x: 85, y: 57.5, val: '3.7%', year: '18년' },
                                                        { x: 150, y: 25, val: '5.0%', year: '20년' },
                                                        { x: 215, y: 45, val: '4.2%', year: '22년' },
                                                        { x: 280, y: 15, val: '5.4%', year: '24년', highlight: true }
                                                    ].map((pt, i) => (
                                                        <g key={i}>
                                                            <motion.circle
                                                                cx={pt.x} cy={pt.y} r="4.5"
                                                                fill={pt.highlight ? "#FF5A00" : "#FFF"}
                                                                stroke="#FF5A00"
                                                                strokeWidth="2"
                                                                initial={{ scale: 0, opacity: 0 }}
                                                                animate={{ scale: 1, opacity: 1 }}
                                                                transition={{ delay: 0.4 + (i * 0.15) }}
                                                            />
                                                            <motion.text
                                                                x={pt.x} y={pt.y - 12}
                                                                textAnchor="middle"
                                                                fill={pt.highlight ? "#FF5A00" : "#555"}
                                                                fontSize="12"
                                                                fontWeight="bold"
                                                                initial={{ opacity: 0, y: 5 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                transition={{ delay: 0.5 + (i * 0.15) }}
                                                            >
                                                                {pt.val}
                                                            </motion.text>
                                                            <motion.text
                                                                x={pt.x} y="125"
                                                                textAnchor="middle"
                                                                fill={pt.highlight ? "#FF5A00" : "#999"}
                                                                fontSize="11"
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                transition={{ delay: 0.8 }}
                                                            >
                                                                {pt.year}
                                                            </motion.text>
                                                        </g>
                                                    ))}
                                                </svg>
                                            </div>
                                            <div className="text-[10px] text-[#A1A1AA] mt-4 text-right">출처: 고용노동부 청년 실태조사</div>
                                        </motion.div>
                                    )}

                                    {slide.hasTracks && (
                                        <div className="w-full mt-12 flex flex-col justify-center">
                                            <div className="flex items-center gap-2 mb-5 px-1">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#FF5A00]" />
                                                <div className="text-[14px] font-bold text-[#666]">3가지 맞춤 케어 트랙</div>
                                            </div>

                                            <div className="flex flex-col gap-3 mb-8">
                                                {tracks.map((t) => {
                                                    const isExpanded = expandedTrack === t.id;
                                                    const Icon = t.icon;
                                                    return (
                                                        <motion.div
                                                            key={t.id}
                                                            layout
                                                            className="bg-white rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-black/[0.05] overflow-hidden"
                                                        >
                                                            <motion.div
                                                                whileHover={{ backgroundColor: "rgba(0,0,0,0.01)" }}
                                                                whileTap={{ scale: 0.99 }}
                                                                onClick={() => toggleTrack(t.id)}
                                                                className="p-4 flex items-center gap-4 cursor-pointer"
                                                            >
                                                                <div className="w-[52px] h-[52px] rounded-[14px] bg-[#F4F4F5] flex items-center justify-center text-[#71717A] shrink-0 transition-colors">
                                                                    <Icon size={24} strokeWidth={1.8} />
                                                                </div>
                                                                <div className="flex-1">
                                                                    <div className="flex items-center gap-2 mb-1.5">
                                                                        <span className="text-[16px] font-bold text-[#111]">{t.title}</span>
                                                                        <span className="text-[10px] font-bold px-2 py-[3px] rounded-md" style={{ color: t.tagColor, backgroundColor: t.tagBg }}>
                                                                            {t.tag}
                                                                        </span>
                                                                    </div>
                                                                    <div className="text-[13px] text-[#666] font-medium">{t.desc}</div>
                                                                </div>
                                                                <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} className="text-[#CCC]">
                                                                    <ChevronDown size={20} />
                                                                </motion.div>
                                                            </motion.div>

                                                            <AnimatePresence>
                                                                {isExpanded && (
                                                                    <motion.div
                                                                        initial={{ height: 0, opacity: 0 }}
                                                                        animate={{ height: 'auto', opacity: 1 }}
                                                                        exit={{ height: 0, opacity: 0 }}
                                                                        transition={{ duration: 0.3 }}
                                                                        className="px-4 pb-4 pt-1"
                                                                    >
                                                                        <div className="bg-[#F8F9FA] p-4 rounded-[14px] text-[13px] text-[#555] leading-[1.6] break-keep font-medium">
                                                                            {t.detail}
                                                                        </div>
                                                                    </motion.div>
                                                                )}
                                                            </AnimatePresence>
                                                        </motion.div>
                                                    );
                                                })}
                                            </div>

                                            {/* Daegu Special Box - Premium Glassmorphism */}
                                            <motion.div
                                                whileHover={{ y: -2, scale: 1.01 }}
                                                whileTap={{ scale: 0.98 }}
                                                className="relative overflow-hidden bg-[#1A1A1A] rounded-[24px] p-5 flex items-center gap-4 cursor-pointer shadow-[0_12px_30px_rgba(0,0,0,0.15)] group"
                                            >
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF5A00] opacity-20 blur-[40px] rounded-full group-hover:opacity-30 transition-opacity" />

                                                <div className="w-[52px] h-[52px] rounded-[16px] bg-gradient-to-br from-[#FF5A00] to-[#FF8A00] flex items-center justify-center text-white shrink-0 shadow-[0_4px_12px_rgba(255,90,0,0.3)] relative z-10">
                                                    <CreditCard size={24} strokeWidth={1.8} />
                                                </div>
                                                <div className="flex-1 relative z-10">
                                                    <div className="text-[16px] font-bold text-white mb-1">대구 특화 서비스</div>
                                                    <div className="text-[13px] text-[#A1A1AA] break-keep font-medium">대구시 청년 정책·일자리·교육을 AI가 맞춤 추천해 드려요</div>
                                                </div>
                                            </motion.div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Bottom Actions */}
                    <div className="px-6 pb-8 flex flex-col items-center z-10 bg-white shrink-0">
                        <div className="flex gap-2 mb-6">
                            {slides.map((_, i) => (
                                <div key={i} className={`h-2 rounded-full transition-all duration-300 ${currentSlide === i ? 'w-6 bg-[#FF5A00]' : 'w-2 bg-[#E2E2E2]'}`} />
                            ))}
                        </div>

                        <motion.button
                            whileHover={currentSlide === 2 ? { scale: 1.02 } : {}}
                            whileTap={currentSlide === 2 ? { scale: 0.98 } : {}}
                            onClick={currentSlide === 2 ? onStart : null}
                            className={`w-full max-w-[400px] relative group overflow-hidden rounded-[16px] py-[18px] text-[16px] font-bold flex justify-center items-center transition-all duration-300 ${currentSlide === 2 ? 'bg-[#FF5A00] text-white shadow-[0_8px_30px_rgba(255,90,0,0.2)]' : 'bg-[#F4F4F5] text-[#A1A1AA] cursor-not-allowed'}`}
                        >
                            {currentSlide === 2 && <div className="absolute inset-0 bg-gradient-to-r from-[#FF5A00] to-[#FF8A00] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />}
                            <span className="relative z-10">내 맞춤 진단 시작하기</span>
                        </motion.button>

                    </div>
                </div>
            </div>
        </div>
    );
}