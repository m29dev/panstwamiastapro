import React, { useEffect, useState } from 'react'
import './GameComponent.css'
import { onValue, ref, update } from 'firebase/database'
import { db } from '../firebaseConfig'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getGameInfo } from '../Services/localStorageService'
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
        const roomRef = ref(
            db,
            `rooms/${roomId}/players/${user.id}/roundSendAnswers`
        )
        const roomRefSave = ref(db, `rooms/${roomId}/players/${user.id}`)

        onValue(roomRef, async (snapshot) => {
            if (snapshot.exists()) {
                console.log('onRoundSendAnswers')

                const roundAnswers = JSON?.parse(
                    localStorage?.getItem('answersInfo')
                )

                await update(roomRefSave, {
                    roundSendAnswers: false,
                    roundAnswers,
                })
            } else {
                console.log('no data on this user update')
            }
        })
    }, [])

    const handleStopRound = async () => {
        try {
            const roomRef = ref(db, `rooms/${roomId}`)
            const gameInfoObject = structuredClone(game)

            const playersArray = Object.entries(game?.players)

            playersArray?.map(([id, player]) => {
                return (gameInfoObject.players[id].roundSendAnswers = true)
            })

            await update(roomRef, {
                roundStart: false,
                players: gameInfoObject.players,
            })
        } catch (error) {
            console.error('Error fetching game:', error)
            return null
        }
    }

    useEffect(() => {
        console.log('NEW ANS')

        const ansObject = {
            country: { string: answerCountry, status: true },
            city: { string: answerCapital, status: true },
            thing: { string: answerThing, status: true },
            celebrity: { string: answerCelebrity, status: true },
        }

        localStorage.setItem('answersInfo', JSON.stringify(ansObject))
    }, [answerCountry, answerCapital, answerThing, answerCelebrity])

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
