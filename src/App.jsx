import { useState, useEffect } from 'react'
import { Briefcase, Compass, Heart, Home, Plus, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import First from './first'
import Search from './search'
import Result from './result'
import Information from './information'
import Skill from './skill'
import Mind from './mind'
import Profile from './profile'
import ReSearch from './re_search'
import Chat from './chat'
import PortfolioSearch from './portfolio_search'
import ReSkill from './re_skill'
import './index.css'

export default function App() {
  const [page, setPage] = useState(() => {
    const savedScores = localStorage.getItem('reon_survey_scores');
    const savedTrack = localStorage.getItem('reon_last_track');
    
    if (savedScores && savedTrack) {
      return savedTrack; // 역량, 취업, 심리 중 마지막 선택했던 트랙으로
    } else if (savedScores) {
      return 'result'; // 검사는 했으나 트랙 선택 안 한 경우
    }
    return 'first'; // 아무 기록 없음
  });

  const [scores, setScores] = useState(() => {
    const saved = localStorage.getItem('reon_survey_scores');
    return saved ? JSON.parse(saved) : null;
  });

  const [showSubTracks, setShowSubTracks] = useState(false)
  const [showProfileSheet, setShowProfileSheet] = useState(false)
  const [showResultSheet, setShowResultSheet] = useState(false)
  const [showSkillSheet, setShowSkillSheet] = useState(false)
  const [bookmarks, setBookmarks] = useState(() => {
    return JSON.parse(localStorage.getItem('reon_bookmarks') || '[]');
  });

  const toggleBookmark = (item) => {
    const exists = bookmarks.find(b => b.id === item.id && b.category === item.category);
    let updated;
    if (exists) {
      updated = bookmarks.filter(b => !(b.id === item.id && b.category === item.category));
    } else {
      updated = [...bookmarks, { ...item, savedAt: new Date().toISOString() }];
    }
    setBookmarks(updated);
    localStorage.setItem('reon_bookmarks', JSON.stringify(updated));
  };

  const goToSearch = () => setPage('search')
  const goToReSearch = () => setPage('re-search')
  const goToPortfolioSearch = () => setPage('portfolio-search')
  const goToChat = () => setPage('chat')
  const goToFirst = () => setPage('first')
  useEffect(() => {
    if (['job', 'skill', 'mental'].includes(page)) {
      localStorage.setItem('reon_last_track', page);
    }
  }, [page]);

  const goToResult = (scoreData, targetPage = 'result') => {
    if (scoreData) {
      // If we are doing a re-search or portfolio update, preserve existing scores
      setScores(prev => {
        const newScores = prev ? { ...prev, ...scoreData } : scoreData;
        localStorage.setItem('reon_survey_scores', JSON.stringify(newScores));
        localStorage.setItem('reon_survey_date', new Date().toISOString());
        return newScores;
      });
    }
    setPage(targetPage)
  }

  return (
    <div className="min-h-screen bg-[#E5E7EB] flex items-center justify-center p-0 sm:p-4 md:p-8 font-sans selection:bg-[#DD5A1B] selection:text-white">
      <div className="w-full h-[100dvh] sm:h-[844px] max-w-[390px] bg-white sm:rounded-[40px] shadow-none sm:shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden relative flex flex-col sm:border-[8px] sm:border-white ring-1 ring-black/5">
        {page === 'first' && <First onStart={goToSearch} onNavigate={(p) => setPage(p)} />}
        {page === 'search' && <Search onComplete={goToResult} onBack={goToFirst} />}
        {page === 're-search' && <ReSearch onComplete={goToResult} onBack={() => setPage('result')} />}
        {page === 'result' && <Result scores={scores} onRetry={goToSearch} onReSearch={goToReSearch} onHome={goToFirst} onStartTrack={(trackKey) => setPage(trackKey)} onProfile={() => setShowProfileSheet(true)} />}
        {page === 'job' && <Information scores={scores} onBack={() => goToResult()} onProfile={() => setShowProfileSheet(true)} bookmarks={bookmarks} onToggleBookmark={toggleBookmark} />}
        {page === 'skill' && <Skill scores={scores} onBack={() => goToResult()} onProfile={() => setShowProfileSheet(true)} bookmarks={bookmarks} onToggleBookmark={toggleBookmark} onStartPortfolioSearch={goToPortfolioSearch} />}
        {page === 'mental' && <Mind onBack={() => goToResult()} onProfile={() => setShowProfileSheet(true)} bookmarks={bookmarks} onToggleBookmark={toggleBookmark} onStartChat={goToChat} />}
        {page === 'profile' && <Profile onBack={() => goToResult()} onGoToResult={() => setShowResultSheet(true)} bookmarks={bookmarks} onToggleBookmark={toggleBookmark} />}
        {page === 'chat' && <Chat onBack={() => setPage('mental')} />}
        {page === 'portfolio-search' && <PortfolioSearch onComplete={(data) => goToResult(data, 'skill')} onBack={() => setPage('skill')} />}

        {/* Profile Bottom Sheet Overlay */}
        <AnimatePresence>
          {showProfileSheet && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-black/40 z-[100] flex flex-col justify-end"
            >
              <div className="absolute inset-0" onClick={() => setShowProfileSheet(false)} />
              <motion.div 
                initial={{ y: '100%' }}
                animate={{ y: '0%' }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="w-full h-[90%] bg-white rounded-t-[32px] overflow-hidden shadow-[0_-8px_30px_rgba(0,0,0,0.12)] relative z-10"
              >
                {/* Drag Handle */}
                <div className="w-full flex justify-center pt-3 pb-1 absolute top-0 left-0 z-50 bg-white/80 backdrop-blur-sm">
                  <div className="w-12 h-1.5 rounded-full bg-[#E5E7EB]" />
                </div>
                <div className="w-full h-full pt-6 overflow-hidden rounded-t-[32px]">
                  <Profile 
                    onBack={() => setShowProfileSheet(false)} 
                    onGoToResult={() => { setShowResultSheet(true); }} 
                    onGoToSkill={() => { setShowSkillSheet(true); }}
                    bookmarks={bookmarks}
                    onToggleBookmark={toggleBookmark}
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result Bottom Sheet Overlay (View Only Mode) */}
        <AnimatePresence>
          {showResultSheet && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-black/40 z-[110] flex flex-col justify-end"
            >
              <div className="absolute inset-0" onClick={() => setShowResultSheet(false)} />
              <motion.div 
                initial={{ y: '100%' }}
                animate={{ y: '0%' }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="w-full h-[95%] bg-white rounded-t-[32px] overflow-hidden shadow-[0_-8px_30px_rgba(0,0,0,0.12)] relative z-10"
              >
                {/* Drag Handle */}
                <div className="w-full flex justify-center pt-3 pb-1 absolute top-0 left-0 z-50 bg-white/80 backdrop-blur-sm">
                  <div className="w-12 h-1.5 rounded-full bg-[#E5E7EB]" />
                </div>
                <div className="w-full h-full pt-6 overflow-hidden rounded-t-[32px]">
                  <Result 
                    scores={scores || { totalScore: 10, categoryScores: [3, 3, 4] }} 
                    isViewOnly={true} 
                    onClose={() => setShowResultSheet(false)} 
                    onReSearch={() => {
                      setShowResultSheet(false);
                      setShowProfileSheet(false);
                      goToReSearch();
                    }}
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Skill Result Bottom Sheet Overlay (View Only Mode) */}
        <AnimatePresence>
          {showSkillSheet && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-black/40 z-[120] flex flex-col justify-end"
            >
              <div className="absolute inset-0" onClick={() => setShowSkillSheet(false)} />
              <motion.div 
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="w-full h-[95%] bg-white rounded-t-[32px] overflow-hidden shadow-[0_-8px_30px_rgba(0,0,0,0.12)] relative z-10"
              >
                {/* Drag Handle */}
                <div className="w-full flex justify-center pt-3 pb-1 absolute top-0 left-0 z-50 bg-white/80 backdrop-blur-sm">
                  <div className="w-12 h-1.5 rounded-full bg-[#E5E7EB]" />
                </div>
                <div className="w-full h-full pt-6 overflow-hidden rounded-t-[32px]">
                  <ReSkill 
                    scores={scores} 
                    onBack={() => setShowSkillSheet(false)} 
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Action Button for Other Tracks */}
        {['job', 'skill', 'mental'].includes(page) && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full px-6 z-50 flex flex-col items-end pointer-events-none">
            <AnimatePresence>
              {showSubTracks && (
                <motion.div 
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.95 }}
                  className="bg-white p-3 rounded-[24px] shadow-[0_12px_40px_rgba(0,0,0,0.15)] border border-black/[0.05] mb-4 flex gap-2 pointer-events-auto w-full justify-around"
                >
                  {['job', 'skill', 'mental'].filter(t => t !== page).map(t => {
                    const icons = { job: Briefcase, skill: Compass, mental: Heart };
                    const labels = { job: '취업 정보', skill: '역량 개발', mental: '심리 회복' };
                    const Icon = icons[t];
                    return (
                      <button 
                        key={t}
                        onClick={() => { setPage(t); setShowSubTracks(false); }}
                        className="flex flex-col items-center gap-2 p-2 flex-1 hover:bg-[#F8F9FA] rounded-[16px] transition-colors"
                      >
                        <div className="w-12 h-12 rounded-full bg-[#F4F4F5] text-[#71717A] flex items-center justify-center">
                          <Icon size={24} />
                        </div>
                        <span className="text-[12px] font-bold text-[#333]">{labels[t]}</span>
                      </button>
                    )
                  })}
                </motion.div>
              )}
            </AnimatePresence>
            <div className="flex gap-3 pointer-events-auto w-full justify-end">
              <button 
                onClick={() => setShowProfileSheet(true)}
                className="bg-white text-[#111] w-[52px] h-[52px] rounded-[20px] shadow-[0_8px_20px_rgba(0,0,0,0.1)] border border-black/[0.05] flex items-center justify-center hover:scale-105 transition-all active:scale-95"
              >
                <User size={22} />
              </button>
              <button 
                onClick={() => setShowSubTracks(!showSubTracks)}
                className="bg-[#111] text-white px-5 py-3.5 rounded-[20px] shadow-[0_8px_20px_rgba(0,0,0,0.2)] flex items-center gap-2 hover:scale-105 transition-all active:scale-95 flex-1 max-w-[200px] justify-center"
              >
                <motion.div animate={{ rotate: showSubTracks ? 45 : 0 }}>
                  <Plus size={20} />
                </motion.div>
                <span className="text-[14px] font-bold">{showSubTracks ? '닫기' : '다른 트랙 보기'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}