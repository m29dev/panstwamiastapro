import { ref, update } from 'firebase/database'
import React from 'react'
import { useSelector } from 'react-redux'
import { db } from '../firebaseConfig'
import { useParams } from 'react-router-dom'

const ResultComponent = () => {
    const { game } = useSelector((state) => state.game)
    const { roomId } = useParams()

    const playersArray = Object.entries(game?.players)

    const handleGoToLobby = async () => {
        const roomRef = ref(db, `rooms/${roomId}`)

        await update(roomRef, {
            round: 0,
            displayResults: false,
        })
        return
    }

    return (
        <div className="player-list">
            {playersArray?.length > 0 ? (
                playersArray?.map(([index, player]) => (
                    <div key={index} className="player-card">
                        <span className="player-avatar">🎮</span>
                        <span className="player-name">{player?.email}</span>
                        <span style={{ marginLeft: '10px' }}>
                            {player?.gamePoints}
                        </span>
                    </div>
                ))
            ) : (
                <p className="waiting-text">Oczekiwanie na graczy...</p>
            )}

            <div className={'cta-btn'} onClick={handleGoToLobby}>
                Back to lobby
            </div>
        </div>
    )
}

export default ResultComponent
