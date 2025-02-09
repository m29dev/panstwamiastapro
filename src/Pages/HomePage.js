import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { db, ref, set, get } from '../firebaseConfig'
import { child, push, update } from 'firebase/database'
import { useSelector } from 'react-redux'

const HomePage = () => {
    const [newGame, setNewGame] = useState(false)
    const [joinGame, setJoinGame] = useState(false)
    const [room, setRoom] = useState('')

    const navigate = useNavigate()

    const { user } = useSelector((state) => state.user)

    useEffect(() => {
        if (!user) return navigate('/auth')
    })

    const toggleNewGame = () => {
        setNewGame(true)
        setJoinGame(false)
        handleCreateGame()
    }

    const toggleJoinGame = () => {
        setJoinGame(true)
        setNewGame(false)
    }

    const handleJoinGame = async () => {
        if (room === '') return

        try {
            const dbRef = ref(db)
            const snapshot = await get(child(dbRef, `rooms/${room}`))

            if (snapshot.exists()) {
                const playerObject = { email: user?.email, roundAnswers: {} }
                const playersIdInfo = snapshot?.val()?.playersIdArray
                const playersIdArrayEdit = structuredClone(playersIdInfo)

                // Add the new player if they’re not already in the array
                if (!playersIdInfo.some((item) => item.id === user?.id)) {
                    playersIdArrayEdit.push(user.id)
                } else {
                    console.log('Player already in room.')
                }

                // Update the room's players in Firebase
                const roomRef = ref(db, `rooms/${room}`)
                await update(roomRef, {
                    [`players/${user.id}`]: playerObject,
                    playersIdArray: playersIdArrayEdit,
                })

                return navigate(`/game/${room}`)
            } else {
                console.log('Game not found')
                return null
            }
        } catch (error) {
            console.error('Error fetching game:', error)
            return null
        }
    }

    const handleCreateGame = async () => {
        try {
            const roomsRef = ref(db, 'rooms')
            const newRoomRef = push(roomsRef)

            await set(newRoomRef, {
                roomId: newRoomRef.key,
                name: room,
                host: user?.id,
                round: 0,
                roundStart: false,
                roundTimer: 0,
                playersIdArray: [user.id],
                players: {
                    [user.id]: { email: user?.email, roundAnswers: {} },
                },
                createdAt: Date.now(),
            })

            const snapshot = await get(newRoomRef)
            if (snapshot.exists()) {
                const roomId = newRoomRef.key
                return navigate(`/game/${roomId}`)
            } else {
                console.log('Game not created')
                return null
            }
        } catch (error) {
            console.error('Error creating game:', error)
            return null
        }
    }

    return (
        <div className="app-container">
            <header className="header">
                <h1>Państwa Miasta</h1>
                <p className="description"></p>
            </header>

            <main className="game-board">
                <div
                    className={newGame ? 'cta-btn active' : 'cta-btn'}
                    onClick={toggleNewGame}
                >
                    Nowa gra
                </div>
                <div
                    className={joinGame ? 'cta-btn active' : 'cta-btn'}
                    onClick={toggleJoinGame}
                >
                    Dołącz do gry
                </div>

                {joinGame && (
                    <div className="input-section">
                        <input
                            type="text"
                            placeholder="ID pokoju..."
                            className="answer-input"
                            value={room}
                            onChange={(e) => setRoom(e.target.value)}
                        />

                        <div className="cta-btn" onClick={handleJoinGame}>
                            Dołącz
                        </div>
                    </div>
                )}
            </main>

            <footer className="footer">
                <p>&copy; 2025 Państwa Miasta</p>
            </footer>
        </div>
    )
}

export default HomePage
