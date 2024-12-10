import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import BlurredLanding from './components/BlurredLanding'
import AuthPage from './components/AuthPage'
import HomePage from './components/HomePage' 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BlurredLanding />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </Router>
  )
}

export default App