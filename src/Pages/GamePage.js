import React, { useEffect } from 'react'
import GameComponent from '../Components/GameComponent'
import GameLobbyComponent from '../Components/GameLobbyComponent'
import { child, get, onValue, ref, update } from 'firebase/database'
import { db } from '../firebaseConfig'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setGame } from '../Redux/gameSlice'
import { radndomizeLetter } from '../Services/randomizeLetterService'

const GamePage = () => {
    const { roomId } = useParams()
    const { game } = useSelector((state) => state.game)
    const { user } = useSelector((state) => state.user)

    const handleGameStart = async () => {
        try {
            const letter = radndomizeLetter()

            const roomRef = ref(db, `rooms/${roomId}`)
            await update(roomRef, {
                roundStart: true,
                roundLetter: letter,
                roundSendAnswers: false,
            })
        } catch (error) {
            console.error('Error fetching game:', error)
            return null
        }
    }

    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
        // fetch room from db
        const fetchRoom = async () => {
            const dbRef = ref(db)
            try {
                const snapshot = await get(child(dbRef, `rooms/${roomId}`))
                if (snapshot.exists()) {
                    dispatch(setGame(snapshot.val()))
                } else {
                    console.log('Room not found')
                }
            } catch (error) {
                console.error('Error fetching room:', error)
            }
        }
        fetchRoom()

        listenToRoom()
    }, [])

    const listenToRoom = () => {
        console.log('new data')
        const roomRef = ref(db, `rooms/${roomId}`)

        onValue(roomRef, (snapshot) => {
            if (snapshot.exists()) {
                dispatch(setGame(snapshot.val()))

                if (snapshot.val()?.roundSendAnswers) {
                    console.log('on send answers init')
                }
            } else {
                console.log('Room does not exist.')
            }
        })
    }

    return (
        <div className="app-container">
            <header className="header">
                <h1>Państwa Miasta</h1>
            </header>

            {!game && (
                <div className={'cta-btn'} onClick={() => navigate('/')}>
                    Back to lobby
                </div>
            )}

            {!game?.roundStart && (
                <>
                    <GameLobbyComponent />

                    {user?.id === game?.host && (
                        <div className={'cta-btn'} onClick={handleGameStart}>
                            Start Game
                        </div>
                    )}
                </>
            )}
            {game?.roundStart && <GameComponent />}

            <footer className="footer">
                <p>&copy; 2025 Państwa Miasta</p>
            </footer>
        </div>
    )
}

export default GamePage
