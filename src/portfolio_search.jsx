import { useState } from 'react'
import { ChevronLeft, Check, Upload, FileText, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function PortfolioSearch({ onComplete, onBack }) {
    const [portfolioFile, setPortfolioFile] = useState(null)
    const color = '#8B5CF6' // Using the Skill track color
    const bgColor = '#F5F3FF'

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPortfolioFile({ name: file.name, size: (file.size / 1024 / 1024).toFixed(2) + 'MB' });
        }
    }

    const handleComplete = () => {
        // Simulated improvement in skill scores after portfolio upload
        const simulatedSkillScores = portfolioFile ? [
            { label: '기술', value: 85 },
            { label: '경험', value: 75 },
            { label: '소통', value: 70 },
            { label: '자격', value: 65 },
            { label: '직무이해', value: 90 },
        ] : null;

        onComplete({
            portfolio: portfolioFile,
            skillScores: simulatedSkillScores
        })
    }

    return (
        <div className="flex flex-col h-full w-full bg-[#F8F9FA] text-[#111] relative overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-4 bg-white sticky top-0 z-20 border-b border-[#F0F0F0]">
                <button onClick={onBack} className="flex items-center gap-1 text-[#666] hover:text-[#111] transition-colors font-medium -ml-2">
                    <ChevronLeft size={22} />
                    <span>이전</span>
                </button>
                <div className="text-[13px] font-bold px-3 py-1 rounded-full" style={{ color: color, backgroundColor: bgColor }}>
                    포트폴리오 업데이트
                </div>
            </div>

            {/* Progress Bar (Simple) */}
            <div className="w-full bg-[#E5E7EB] h-1.5 relative">
                <div className="absolute top-0 left-0 h-full bg-[#8B5CF6] w-full" />
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto px-6 pt-12 pb-32">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold mb-4" style={{ backgroundColor: bgColor, color: color }}>
                        역량 증빙
                    </div>
                    <h2 className="text-[24px] font-extrabold leading-[1.3] mb-3 break-keep">
                        나의 실력을 증명할<br />
                        <span style={{ color: color }}>포트폴리오</span>를 업로드해주세요.
                    </h2>
                    <p className="text-[14px] text-[#666] mb-10 leading-[1.6]">
                        파일을 업로드하면 AI가 실무 역량을 더 정확하게 분석하여<br />
                        맞춤형 커리어 로드맵을 고도화해드려요.
                    </p>

                    <div className="flex flex-col gap-4">
                        {portfolioFile ? (
                            <div className="bg-white p-6 rounded-[24px] border-2 border-dashed border-[#16A34A] flex items-center justify-between shadow-md">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center">
                                        <FileText size={24} />
                                    </div>
                                    <div>
                                        <div className="text-[15px] font-bold text-[#111] line-clamp-1">{portfolioFile.name}</div>
                                        <div className="text-[12px] text-[#999]">{portfolioFile.size}</div>
                                    </div>
                                </div>
                                <button onClick={() => setPortfolioFile(null)} className="p-2 text-[#999] hover:text-red-500 transition-colors">
                                    <X size={24} />
                                </button>
                            </div>
                        ) : (
                            <label className="cursor-pointer">
                                <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
                                <div className="bg-white p-16 rounded-[32px] border-2 border-dashed border-[#E5E7EB] flex flex-col items-center justify-center gap-4 hover:border-[#8B5CF6] hover:bg-[#F5F3FF]/30 transition-all group shadow-sm">
                                    <div className="w-16 h-16 rounded-full bg-[#F8F9FA] text-[#CCC] flex items-center justify-center group-hover:text-[#8B5CF6] group-hover:bg-white transition-all shadow-sm">
                                        <Upload size={28} />
                                    </div>
                                    <div className="text-[16px] font-bold text-[#999] group-hover:text-[#8B5CF6]">여기를 눌러 파일 업로드</div>
                                    <div className="text-[12px] text-[#BBB]">PDF, Word 파일 (최대 10MB)</div>
                                </div>
                            </label>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Footer Action */}
            <div className="absolute bottom-0 left-0 w-full bg-white/80 backdrop-blur-xl border-t border-black/[0.04] p-6 pb-safe-offset z-50">
                <style>{`.pb-safe-offset { padding-bottom: calc(max(env(safe-area-inset-bottom), 24px)); }`}</style>
                <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handleComplete}
                    className="w-full py-4.5 rounded-[20px] bg-[#4F46E5] text-white text-[16px] font-bold flex justify-center items-center shadow-[0_8px_24px_rgba(79,70,229,0.3)] transition-all">
                    역량 분석 시작하기
                </motion.button>
            </div>
        </div>
    )
}
