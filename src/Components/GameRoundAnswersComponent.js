import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { db, ref } from '../firebaseConfig'
import { useParams } from 'react-router-dom'
import { update } from 'firebase/database'

const GameRoundAnswersComponent = () => {
    const { game } = useSelector((state) => state.game)
    const { user } = useSelector((state) => state.user)
    const { roomId } = useParams()

    const playersArray = Object.entries(game.players)

    // const [playersArray, setPlayerArray] = useState([])

    const handleToggleAnswer = async (id, atr) => {
        console.log('handleToggleAnswer: ', id, atr)
        const roomRef = ref(
            db,
            `rooms/${roomId}/players/${id}/roundAnswers/${atr}`
        )

        const status = !game.players[id].roundAnswers[atr].status

        await update(roomRef, {
            status,
        })
    }

    // useEffect(() => {
    //     const array = Object.entries(game.players)
    //     setPlayerArray(array)
    // }, [game])

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Odpowiedzi graczy - Runda</h2>
            <ul style={styles.playerList}>
                {playersArray.map(([id, player]) => (
                    <li key={id} style={styles.playerItem}>
                        <div>
                            <p style={styles.playerEmail}>{player.email}</p>
                            <ul style={styles.answerList}>
                                <li style={styles.answerItem}>
                                    <strong>Celebrity:</strong>{' '}
                                    {player.roundAnswers.celebrity.string}
                                    {user?.id === game?.host && (
                                        <button
                                            style={styles.button}
                                            onClick={() =>
                                                handleToggleAnswer(
                                                    id,
                                                    'celebrity'
                                                )
                                            } // Wywołanie funkcji przy kliknięciu
                                        >
                                            {player.roundAnswers.celebrity
                                                .status
                                                ? '1'
                                                : '0'}
                                        </button>
                                    )}
                                </li>
                                <li style={styles.answerItem}>
                                    <strong>City:</strong>{' '}
                                    {player.roundAnswers.city.string}
                                    {user?.id === game?.host && (
                                        <button
                                            style={styles.button}
                                            onClick={() =>
                                                handleToggleAnswer(id, 'city')
                                            } // Wywołanie funkcji przy kliknięciu
                                        >
                                            {player.roundAnswers.city.status
                                                ? '1'
                                                : '0'}
                                        </button>
                                    )}
                                </li>
                                <li style={styles.answerItem}>
                                    <strong>Country:</strong>{' '}
                                    {player.roundAnswers.country.string}
                                    {user?.id === game?.host && (
                                        <button
                                            style={styles.button}
                                            onClick={() =>
                                                handleToggleAnswer(
                                                    id,
                                                    'country'
                                                )
                                            } // Wywołanie funkcji przy kliknięciu
                                        >
                                            {player.roundAnswers.country.status
                                                ? '1'
                                                : '0'}
                                        </button>
                                    )}
                                </li>
                                <li style={styles.answerItem}>
                                    <strong>Thing:</strong>{' '}
                                    {player.roundAnswers.thing.string}
                                    {user?.id === game?.host && (
                                        <button
                                            style={styles.button}
                                            onClick={() =>
                                                handleToggleAnswer(id, 'thing')
                                            } // Wywołanie funkcji przy kliknięciu
                                        >
                                            {player.roundAnswers.thing.status
                                                ? '1'
                                                : '0'}
                                        </button>
                                    )}
                                </li>
                            </ul>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}

// Definiowanie nowego stylu
const styles = {
    container: {
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f8f8f8',
        padding: '30px',
        borderRadius: '10px',
        maxWidth: '800px',
        margin: '30px auto',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    },
    title: {
        fontSize: '28px',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: '30px',
        color: '#2c3e50',
        textTransform: 'uppercase',
        letterSpacing: '2px',
    },
    playerList: {
        listStyleType: 'none',
        paddingLeft: '0',
    },
    playerItem: {
        backgroundColor: '#fff',
        padding: '20px',
        marginBottom: '15px',
        borderRadius: '10px',
        border: '2px solid #ddd',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        position: 'relative',
    },
    playerEmail: {
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#34495e',
        marginBottom: '10px',
    },
    answerList: {
        marginTop: '15px',
        paddingLeft: '20px',
    },
    answerItem: {
        fontSize: '16px',
        marginBottom: '10px',
        color: '#34495e',
    },
    button: {
        backgroundColor: '#3498db',
        color: '#fff',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '14px',
        transition: 'background-color 0.3s ease',
    },
    buttonHovered: {
        backgroundColor: '#2980b9',
    },
    status: {
        fontStyle: 'italic',
        marginTop: '10px',
        color: '#7f8c8d',
    },
}

export default GameRoundAnswersComponent
