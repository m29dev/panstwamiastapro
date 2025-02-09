import React, { useEffect } from 'react'
import GameComponent from '../Components/GameComponent'
import GameLobbyComponent from '../Components/GameLobbyComponent'
import ResultsComponent from '../Components/ResultsComponent'
import { child, get, onValue, ref, update } from 'firebase/database'
import { db } from '../firebaseConfig'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setGame } from '../Redux/gameSlice'
import { radndomizeLetter } from '../Services/randomizeLetterService'
import GameRoundAnswersComponent from '../Components/GameRoundAnswersComponent'

const GamePage = () => {
    const { roomId } = useParams()
    const { game } = useSelector((state) => state.game)
    const { user } = useSelector((state) => state.user)

    const handleGameStart = async () => {
        try {
            const letter = radndomizeLetter()
            const playersEdit = structuredClone(game.players)
            const roomRef = ref(db, `rooms/${roomId}`)
            game.playersIdArray.forEach((playerId) => {
                playersEdit[playerId].roundSendAnswers = false
            })

            if (game.round >= 3) {
                await update(roomRef, {
                    
                    roundStart: false,
                    roundSendAnswers: false,
                    players: playersEdit,
                    displayResults: true,
                })
                return
            }

            await update(roomRef, {
                round: +game.round + 1,
                roundStart: true,
                roundLetter: letter,
                roundSendAnswers: false,
                players: playersEdit,
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
                // console.log(snapshot.val().players)
                dispatch(setGame(snapshot.val()))
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

            {!game && !game.displayResults && (
                <div className={'cta-btn'} onClick={() => navigate('/')}>
                    Back to lobby
                </div>
            )}

            {!game?.roundStart && game?.round === 0 && (
                <>
                    <GameLobbyComponent />

                    {user?.id === game?.host && (
                        <div className={'cta-btn'} onClick={handleGameStart}>
                            Start Game
                        </div>
                    )}
                </>
            )}

            {!game?.roundStart &&
                game?.round > 0 &&
                game?.round < 3 &&
                !game.displayResults && (
                    <>
                        <GameRoundAnswersComponent />

                        {user?.id === game?.host && (
                            <div
                                className={'cta-btn'}
                                onClick={handleGameStart}
                            >
                                Next Round
                            </div>
                        )}
                    </>
                )}

            {!game?.roundStart && game?.round >= 3 && !game.displayResults && (
                <>
                    <GameRoundAnswersComponent />

                    {user?.id === game?.host && (
                        <div className={'cta-btn'} onClick={handleGameStart}>
                            Display game results
                        </div>
                    )}
                </>
            )}

            {game?.roundStart && !game.displayResults && <GameComponent />}

            {!game?.roundStart && game.displayResults && <ResultsComponent />}

            <footer className="footer">
                <p>&copy; 2025 Państwa Miasta</p>
            </footer>
        </div>
    )
}

export default GamePage
