import { motion } from 'framer-motion';
import { BarChart2, AlertCircle, ChevronRight } from 'lucide-react';

// ── 오각형 레이더 차트 (간결화 버전) ──────────────────────────────────────────
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

export default function ReSkill({ scores, onBack }) {
    const radarData = (scores && scores.skillScores) ? scores.skillScores : [
        { label: '기술', value: 55 },
        { label: '경험', value: 30 },
        { label: '소통', value: 70 },
        { label: '자격', value: 40 },
        { label: '직무이해', value: 60 },
    ];

    const sortedRadar = [...radarData].sort((a, b) => a.value - b.value);
    const lowestLabels = sortedRadar.slice(0, 2).map(d => d.label);

    const weakPointsMap = {
        '기술': { icon: '⚛️', text: '실무 관련 프레임워크 숙련도 부족', level: '높음' },
        '경험': { icon: '📁', text: '포트폴리오 내 프로젝트 증빙 부족', level: '높음' },
        '소통': { icon: '🤝', text: '팀 협업 및 버전 관리 경험 부족', level: '중간' },
        '자격': { icon: '🗄️', text: '직무 관련 국가 공인 자격증 미취득', level: '중간' },
        '직무이해': { icon: '💡', text: '현업 트렌드 및 기술 스택 이해 부족', level: '중간' },
    };

    const weakPoints = lowestLabels.map(label => weakPointsMap[label]);

    return (
        <div className="flex flex-col h-full w-full bg-[#F8F9FA] text-[#111] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-4 bg-white sticky top-0 z-20 border-b border-[#F0F0F0]">
                <div className="w-[60px]"></div>
                <div className="text-[17px] font-bold">역량 분석 결과</div>
                <button onClick={onBack} className="w-[60px] flex justify-end text-[#666] hover:text-[#111] transition-colors">
                    <span className="text-[15px] font-bold">닫기</span>
                </button>
            </div>

            <div className="flex-1 overflow-y-auto pb-10">
                <div className="px-6 py-8 flex flex-col gap-8">
                    {/* 레이더 차트 */}
                    <section className="bg-white rounded-[24px] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-[16px] font-bold">역량 현황</h2>
                            <span className="text-[11px] font-bold text-[#4F46E5] bg-[#F2F3FB] px-2.5 py-1 rounded-full">
                                지망직무: {scores?.careerFields?.join(', ') || '미설정'}
                            </span>
                        </div>
                        <RadarChart data={radarData} />
                        <div className="grid grid-cols-5 gap-1 mt-4">
                            {radarData.map(d => (
                                <div key={d.label} className="flex flex-col items-center gap-1">
                                    <div className="text-[11px] font-bold text-[#999]">{d.label}</div>
                                    <div className="text-[14px] font-extrabold text-[#4F46E5]">{d.value}</div>
                                    <div className="w-full h-1 bg-[#E5E7EB] rounded-full overflow-hidden">
                                        <div className="h-full bg-[#4F46E5] rounded-full" style={{ width: `${d.value}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <div className="p-4 bg-[#F2F3FB] rounded-[20px] text-[13px] text-[#4F46E5] leading-[1.6] font-medium">
                        💡 팁: 상세한 맞춤 로드맵과 퀘스트는 메인 서비스의 <span className="font-extrabold">'역량 개발'</span> 트랙에서 확인하실 수 있습니다.
                    </div>
                </div>
            </div>
        </div>
    );
}
