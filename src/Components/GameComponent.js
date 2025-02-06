import React, { useEffect, useState } from 'react'
import './GameComponent.css'
import { onValue, ref, update } from 'firebase/database'
import { db } from '../firebaseConfig'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
// import TimerComponent from './TimerComponent'

const GameComponent = () => {
    const [answerCountry, setAnswerCountry] = useState('')
    const [answerCapital, setAnswerCapital] = useState('')
    const [answerThing, setAnswerThing] = useState('')
    const [answerCelebrity, setAnswerCelebrity] = useState('')
    const { roomId } = useParams()
    const { game } = useSelector((state) => state.game)
    const { user } = useSelector((state) => state.user)

    useEffect(() => {
        if (game?.roundSendAnswers) {
            console.log(20, answerCountry)
        }
    }, [game])

    const handleStopRound = async () => {
        try {
            const roomRef = ref(db, `rooms/${roomId}`)
            await update(roomRef, { roundStart: false, roundSendAnswers: true })
        } catch (error) {
            console.error('Error fetching game:', error)
            return null
        }
    }

    return (
        <main className="game-board">
            {/* <TimerComponent /> */}

            <div>
                <h1>{game?.roundLetter}</h1>
            </div>

            <div className="input-section">
                <label>Państwo</label>
                <input
                    type="text"
                    placeholder=""
                    className="answer-input"
                    value={answerCountry}
                    onChange={(e) => setAnswerCountry(e.target.value)}
                />

                <label>Stolica</label>
                <input
                    type="text"
                    placeholder=""
                    className="answer-input"
                    value={answerCapital}
                    onChange={(e) => setAnswerCapital(e.target.value)}
                />

                <label>Przedmiot</label>
                <input
                    type="text"
                    placeholder=""
                    className="answer-input"
                    value={answerThing}
                    onChange={(e) => setAnswerThing(e.target.value)}
                />

                <label>Celebryta</label>
                <input
                    type="text"
                    placeholder=""
                    className="answer-input"
                    value={answerCelebrity}
                    onChange={(e) => setAnswerCelebrity(e.target.value)}
                />

                <div className="cta-btn" onClick={handleStopRound}>
                    Stop
                </div>
            </div>
        </main>
    )
}

export default GameComponent
