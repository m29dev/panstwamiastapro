import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import GamePage from './Pages/GamePage'
import HomePage from './Pages/HomePage'
import AuthPage from './Pages/AuthPage'

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/auth" element={<AuthPage />} />
                {/* <Route path="/user" element={<UserPage />} /> */}
                <Route path="/game/:roomId" element={<GamePage />} />
            </Routes>
        </Router>
    )
}

export default App
