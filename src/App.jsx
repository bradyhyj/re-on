import { useState } from 'react'
import First from './first'
import Search from './search'
import Result from './result'
import './App.css'

export default function App() {
  const [page, setPage] = useState('first')
  const [scores, setScores] = useState(null)

  const goToSearch = () => setPage('search')
  const goToFirst = () => setPage('first')
  const goToResult = (scoreData) => {
    setScores(scoreData)
    setPage('result')
  }

  return (
    <div className="app">
      {page === 'first' && <First onStart={goToSearch} />}
      {page === 'search' && <Search onComplete={goToResult} onBack={goToFirst} />}
      {page === 'result' && <Result scores={scores} onRetry={goToSearch} onHome={goToFirst} />}
    </div>
  )
}