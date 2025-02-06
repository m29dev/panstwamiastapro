import React from 'react'
import './GameLobbyComponent.css'
import { useSelector } from 'react-redux'

const GameLobbyComponent = ({ players }) => {
    const { game } = useSelector((state) => state.game)

    return (
        <div className="lobby-container">
            <h2 className="lobbyTitle">🛋️ Poczekalnia</h2>

            {/* Lista graczy */}
            <div className="player-list">
                {game?.players?.length > 0 ? (
                    game?.players?.map((player, index) => (
                        <div key={index} className="player-card">
                            <span className="player-avatar">🎮</span>
                            <span className="player-name">{player?.email}</span>
                        </div>
                    ))
                ) : (
                    <p className="waiting-text">Oczekiwanie na graczy...</p>
                )}
            </div>
        </div>
    )
}

export default GameLobbyComponent
