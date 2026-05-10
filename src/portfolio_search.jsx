import { useState } from 'react'
import { ChevronLeft, Check, Upload, FileText, X, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { analyzePortfolioFile } from './gemini'
import demoPdfUrl from './assets/Fortpolio_for_Testing_Service.pdf'

export default function PortfolioSearch({ onComplete, onBack }) {
    const [portfolioFile, setPortfolioFile] = useState(null)
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [showAiWarning, setShowAiWarning] = useState(false);
    const color = '#8B5CF6' // Using the Skill track color
    const bgColor = '#F5F3FF'

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPortfolioFile({ 
                name: file.name, 
                size: (file.size / 1024 / 1024).toFixed(2) + 'MB',
                fileObj: file
            });
        }
    }

    const handleUseDemoPdf = async () => {
        try {
            const response = await fetch(demoPdfUrl);
            const blob = await response.blob();
            const file = new File([blob], 'Fortpolio_for_Testing_Service.pdf', { type: 'application/pdf' });
            setPortfolioFile({ 
                name: file.name, 
                size: (file.size / 1024 / 1024).toFixed(2) + 'MB',
                fileObj: file
            });
        } catch (error) {
            console.error("Demo PDF load error:", error);
        }
    }

    const handleComplete = async () => {
        if (!portfolioFile?.fileObj) return;

        setShowAiWarning(true);
    }

    const proceedAnalysis = async () => {
        setShowAiWarning(false);
        setIsAnalyzing(true);
        const file = portfolioFile.fileObj;
        const cacheKeyScore = `reon_portfolio_score_${file.name}`;
        const cacheKeyFile = `reon_portfolio_${file.name}`;

        try {
            const reader = new FileReader();
            reader.onload = async (event) => {
                const base64Data = event.target.result;
                
                // Save file to storage (ignoring quota errors gracefully)
                try {
                    localStorage.setItem(cacheKeyFile, base64Data);
                } catch(e) { 
                    console.warn('Storage quota exceeded for file, saving score only.'); 
                }

                // Check for cached score
                const cachedScore = localStorage.getItem(cacheKeyScore);
                let aiResult;

                if (cachedScore) {
                    aiResult = JSON.parse(cachedScore);
                } else {
                    aiResult = await analyzePortfolioFile(base64Data, file.type);
                    localStorage.setItem(cacheKeyScore, JSON.stringify(aiResult));
                }

                setIsAnalyzing(false);
                onComplete({
                    portfolio: portfolioFile,
                    skillScores: aiResult.skillScores,
                    jobReadinessScore: aiResult.jobReadinessScore,
                    isValidPortfolio: aiResult.isValidPortfolio
                });
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error(error);
            setIsAnalyzing(false);
        }
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
                            <div className="bg-white p-6 rounded-[24px] border-2 border-dashed border-[#16A34A] flex items-center justify-between shadow-md overflow-hidden">
                                <div className="flex items-center gap-4 min-w-0">
                                    <div className="w-12 h-12 rounded-xl bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center shrink-0">
                                        <FileText size={24} />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="text-[15px] font-bold text-[#111] truncate">{portfolioFile.name}</div>
                                        <div className="text-[12px] text-[#999]">{portfolioFile.size}</div>
                                    </div>
                                </div>
                                <button onClick={() => setPortfolioFile(null)} className="p-2 text-[#999] hover:text-red-500 transition-colors shrink-0 ml-2">
                                    <X size={24} />
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2">
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
                                <div className="flex gap-2 mt-2">
                                    <button onClick={handleUseDemoPdf} className="flex-1 py-4 bg-white border border-[#E5E7EB] rounded-[20px] text-[#333] text-[14px] font-bold shadow-sm hover:bg-[#F8F9FA] transition-colors">
                                        시연용 PDF 사용
                                    </button>
                                    <a href={demoPdfUrl} download="Fortpolio_for_Testing_Service.pdf" className="flex-1 py-4 bg-[#F4F4F5] rounded-[20px] text-[#666] text-[14px] font-bold text-center hover:bg-[#E4E4E7] transition-colors">
                                        시연용 PDF 다운로드
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Footer Action */}
            <div className="absolute bottom-0 left-0 w-full bg-white/80 backdrop-blur-xl border-t border-black/[0.04] p-6 pb-safe-offset z-50">
                <style>{`.pb-safe-offset { padding-bottom: calc(max(env(safe-area-inset-bottom), 24px)); }`}</style>
                <motion.button
                    whileTap={{ scale: isAnalyzing ? 1 : 0.98 }}
                    onClick={handleComplete}
                    disabled={isAnalyzing || !portfolioFile}
                    className={`w-full py-4.5 rounded-[20px] text-white text-[16px] font-bold flex justify-center items-center gap-2 shadow-[0_8px_24px_rgba(79,70,229,0.3)] transition-all
                        ${isAnalyzing || !portfolioFile ? 'bg-[#A5B4FC] cursor-not-allowed' : 'bg-[#4F46E5] hover:bg-[#4338CA]'}`}>
                    {isAnalyzing ? (
                        <>
                            <Loader2 className="animate-spin" size={20} /> AI 분석 중...
                        </>
                    ) : (
                        '역량 분석 시작하기'
                    )}
                </motion.button>
            </div>

            {/* Loading Overlay */}
            <AnimatePresence>
                {isAnalyzing && (
                    <div className="absolute inset-0 z-[200] flex items-center justify-center bg-white/80 backdrop-blur-md">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="flex flex-col items-center bg-white p-8 rounded-[32px] shadow-[0_8px_40px_rgba(0,0,0,0.12)] border border-black/[0.04]">
                            <Loader2 size={48} className="animate-spin text-[#4F46E5] mb-5" />
                            <h3 className="text-[18px] font-extrabold text-[#111] mb-2">AI 포트폴리오 분석 중</h3>
                            <p className="text-[14px] text-[#666] text-center leading-[1.6]">
                                잠시만 기다려주세요.<br/>서류에서 실무 역량을 추출하고 있습니다.
                            </p>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* AI Warning Modal */}
            <AnimatePresence>
                {showAiWarning && (
                    <div className="absolute inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAiWarning(false)} />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="relative bg-white rounded-[24px] w-full max-w-[320px] p-6 shadow-2xl overflow-hidden">
                            <div className="w-12 h-12 rounded-full bg-[#FFF5F0] text-[#FF5A00] flex items-center justify-center mb-4">
                                <FileText size={24} />
                            </div>
                            <h3 className="text-[18px] font-extrabold mb-2 text-[#111]">AI 학습 이용 동의</h3>
                            <p className="text-[14px] text-[#666] leading-[1.6] mb-6 break-keep">
                                업로드하신 포트폴리오(이력서) 파일은 더 정교한 분석과 맞춤형 서비스 제공을 위해 <span className="font-bold text-[#111]">AI 학습 데이터로 활용</span>될 수 있습니다.<br/><br/>동의하시겠습니까?
                            </p>
                            <div className="flex gap-2 w-full">
                                <button onClick={() => setShowAiWarning(false)} className="flex-1 py-3.5 bg-[#F4F4F5] text-[#666] rounded-[16px] font-bold text-[14px] hover:bg-[#E4E4E7] transition-colors">
                                    취소
                                </button>
                                <button onClick={proceedAnalysis} className="flex-[1.5] py-3.5 bg-[#4F46E5] text-white rounded-[16px] font-bold text-[14px] shadow-md hover:bg-[#4338CA] transition-colors">
                                    동의하고 계속
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
