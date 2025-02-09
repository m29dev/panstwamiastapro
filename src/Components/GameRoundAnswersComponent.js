import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { db, ref } from '../firebaseConfig'
import { useParams } from 'react-router-dom'
import { update } from 'firebase/database'

const GameRoundAnswersComponent = () => {
    const { game } = useSelector((state) => state.game)
    const { user } = useSelector((state) => state.user)
    const { roomId } = useParams()

    const playersArray = Object.entries(game.players)

    const handleToggleAnswer = async (id, atr) => {
        console.log('handleToggleAnswer: ', id, atr)
        const roomRef = ref(
            db,
            `rooms/${roomId}/players/${id}/roundAnswers/${atr}`
        )

        const status = !game.players[id].roundAnswers[atr].status

        const res = await update(roomRef, {
            status,
        })

        console.log(res)
    }

    const handlePoints = async () => {
        const categories = ['celebrity', 'city', 'country', 'thing']
        const playersArrayToCopy = Object.values(game?.players) //array
        const playersArray = structuredClone(playersArrayToCopy) //copy array

        const players = structuredClone(game?.players)
        const playersIdArray = game?.playersIdArray

        // console.log(playersIdArray)

        playersIdArray.forEach((playerId) => {
            const playerObject = players[playerId]
            // console.log(playerObject)
            let playerPoints = 0

            categories.forEach((category) => {
                const search = playerObject?.roundAnswers[category]?.string
                const status = playerObject?.roundAnswers[category]?.status

                // console.log(search, status)

                // if answer is empty or status is false 0 points
                if (search === '' || !status) {
                    playerObject.roundAnswers[category].points = 0
                    return console.log(playerObject.email, category, '0 points')
                }

                // filter for 15 points
                const filteredPlayers15 = playersArray.filter(
                    (player) =>
                        player.email !== playerObject.email &&
                        ((player.roundAnswers[category]?.status === true &&
                            player.roundAnswers[category]?.string === '') ||
                            player.roundAnswers[category]?.status === false)
                )
                if (
                    filteredPlayers15.length ===
                    game.playersIdArray.length - 1
                ) {
                    playerPoints += 15
                    playerObject.roundAnswers[category].points = 15
                    return console.log(
                        playerObject.email,
                        category,
                        '15 points'
                    )
                }

                const filteredPlayers10 = playersArray.filter(
                    (player) =>
                        player.email !== playerObject.email &&
                        player.roundAnswers[category]?.status === true &&
                        player.roundAnswers[category]?.string !== search
                )
                if (filteredPlayers10.length > 0) {
                    playerPoints += 10
                    playerObject.roundAnswers[category].points = 10
                    return console.log(
                        playerObject.email,
                        category,
                        '10 points'
                    )
                }

                const filteredPlayers5 = playersArray.filter(
                    (player) =>
                        player.email !== playerObject.email &&
                        player.roundAnswers[category]?.status === true &&
                        player.roundAnswers[category]?.string === search
                )
                if (filteredPlayers5.length > 0) {
                    playerPoints += 5
                    playerObject.roundAnswers[category].points = 5
                    return console.log(playerObject.email, category, '5 points')
                }
            })

            playerObject.roundAnswers.roundPoints = playerPoints
            playerObject.gamePoints = playerObject.gamePoints
                ? playerObject.gamePoints + playerPoints
                : playerPoints
        })

        console.log(players)

        const roomRef = ref(db, `rooms/${roomId}`)
        await update(roomRef, {
            players,
        })
    }

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Odpowiedzi graczy - Runda</h2>

            <div style={styles.playerList}>
                {playersArray.map(([id, player]) => (
                    <div key={id} style={styles.playerItem}>
                        <p style={styles.playerEmail}>{player.email}</p>
                        <p style={styles.playerEmail}>
                            Round points: {player?.roundAnswers?.roundPoints}
                        </p>
                        <div style={styles.answerList}>
                            {/* country */}
                            <div style={styles.answerItemContainer}>
                                <div style={styles.answerItem}>
                                    <div style={styles.answerName}>PAŃSTWO</div>

                                    <div style={styles.answerItem}>
                                        {player?.roundAnswers?.country?.string}
                                    </div>
                                </div>

                                <div style={styles.answerItem}>
                                    {/* host */}
                                    {user?.id === game?.host && (
                                        <img
                                            src={`/icon_${
                                                player?.roundAnswers?.country
                                                    ?.status
                                                    ? 'true'
                                                    : 'false'
                                            }.png`}
                                            style={
                                                player?.roundAnswers?.country
                                                    ?.status
                                                    ? styles.icon_true
                                                    : styles.icon_false
                                            }
                                            alt="Dynamiczny obrazek"
                                            onClick={() =>
                                                handleToggleAnswer(
                                                    id,
                                                    'country'
                                                )
                                            }
                                        />
                                    )}

                                    {/* player */}
                                    {user?.id !== game?.host && (
                                        <img
                                            src={`/icon_${
                                                player?.roundAnswers?.country
                                                    ?.status
                                                    ? 'true'
                                                    : 'false'
                                            }.png`}
                                            style={
                                                player?.roundAnswers?.country
                                                    ?.status
                                                    ? styles.icon_player_true
                                                    : styles.icon_player_false
                                            }
                                            alt="Dynamiczny obrazek"
                                        />
                                    )}

                                    <div>
                                        {player?.roundAnswers?.country?.points}
                                    </div>
                                </div>
                            </div>

                            {/* city */}
                            <div style={styles.answerItemContainer}>
                                <div style={styles.answerItem}>
                                    <div style={styles.answerName}>MIASTO</div>

                                    <div style={styles.answerItem}>
                                        {player?.roundAnswers?.city?.string}
                                    </div>
                                </div>

                                <div style={styles.answerItem}>
                                    {/* host */}
                                    {user?.id === game?.host && (
                                        <img
                                            src={`/icon_${
                                                player?.roundAnswers?.city
                                                    ?.status
                                                    ? 'true'
                                                    : 'false'
                                            }.png`}
                                            style={
                                                player?.roundAnswers?.city
                                                    ?.status
                                                    ? styles.icon_true
                                                    : styles.icon_false
                                            }
                                            alt="Dynamiczny obrazek"
                                            onClick={() =>
                                                handleToggleAnswer(id, 'city')
                                            }
                                        />
                                    )}

                                    {/* player */}
                                    {user?.id !== game?.host && (
                                        <img
                                            src={`/icon_${
                                                player?.roundAnswers?.city
                                                    ?.status
                                                    ? 'true'
                                                    : 'false'
                                            }.png`}
                                            style={
                                                player?.roundAnswers?.city
                                                    ?.status
                                                    ? styles.icon_player_true
                                                    : styles.icon_player_false
                                            }
                                            alt="Dynamiczny obrazek"
                                        />
                                    )}

                                    <div>
                                        {player?.roundAnswers?.city?.points}
                                    </div>
                                </div>
                            </div>

                            {/* celebrity */}
                            <div style={styles.answerItemContainer}>
                                <div style={styles.answerItem}>
                                    <div style={styles.answerName}>
                                        CELEBRYTA
                                    </div>

                                    <div style={styles.answerItem}>
                                        {
                                            player?.roundAnswers?.celebrity
                                                ?.string
                                        }
                                    </div>
                                </div>

                                <div style={styles.answerItem}>
                                    {/* host */}
                                    {user?.id === game?.host && (
                                        <img
                                            src={`/icon_${
                                                player?.roundAnswers?.celebrity
                                                    ?.status
                                                    ? 'true'
                                                    : 'false'
                                            }.png`}
                                            style={
                                                player?.roundAnswers?.celebrity
                                                    ?.status
                                                    ? styles.icon_true
                                                    : styles.icon_false
                                            }
                                            alt="Dynamiczny obrazek"
                                            onClick={() =>
                                                handleToggleAnswer(
                                                    id,
                                                    'celebrity'
                                                )
                                            }
                                        />
                                    )}

                                    {/* player */}
                                    {user?.id !== game?.host && (
                                        <img
                                            src={`/icon_${
                                                player?.roundAnswers?.celebrity
                                                    ?.status
                                                    ? 'true'
                                                    : 'false'
                                            }.png`}
                                            style={
                                                player?.roundAnswers?.celebrity
                                                    ?.status
                                                    ? styles.icon_player_true
                                                    : styles.icon_player_false
                                            }
                                            alt="Dynamiczny obrazek"
                                        />
                                    )}

                                    <div>
                                        {
                                            player?.roundAnswers?.celebrity
                                                ?.points
                                        }
                                    </div>
                                </div>
                            </div>

                            {/* thing */}
                            <div style={styles.answerItemContainer}>
                                <div style={styles.answerItem}>
                                    <div style={styles.answerName}>
                                        PRZEDMIOT
                                    </div>

                                    <div style={styles.answerItem}>
                                        {player?.roundAnswers?.thing?.string}
                                    </div>
                                </div>

                                <div style={styles.answerItem}>
                                    {/* host */}
                                    {user?.id === game?.host && (
                                        <img
                                            src={`/icon_${
                                                player?.roundAnswers?.thing
                                                    ?.status
                                                    ? 'true'
                                                    : 'false'
                                            }.png`}
                                            style={
                                                player?.roundAnswers?.thing
                                                    ?.status
                                                    ? styles.icon_true
                                                    : styles.icon_false
                                            }
                                            alt="Dynamiczny obrazek"
                                            onClick={() =>
                                                handleToggleAnswer(id, 'thing')
                                            }
                                        />
                                    )}

                                    {/* player */}
                                    {user?.id !== game?.host && (
                                        <img
                                            src={`/icon_${
                                                player?.roundAnswers?.thing
                                                    ?.status
                                                    ? 'true'
                                                    : 'false'
                                            }.png`}
                                            style={
                                                player?.roundAnswers?.thing
                                                    ?.status
                                                    ? styles.icon_player_true
                                                    : styles.icon_player_false
                                            }
                                            alt="Dynamiczny obrazek"
                                        />
                                    )}

                                    <div>
                                        {player?.roundAnswers?.thing?.points}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                <div className="cta-btn" onClick={handlePoints}>
                    Calculate points
                </div>
            </div>
        </div>
    )
}

// Definiowanie nowego stylu
const styles = {
    container: {
        fontFamily: 'Arial, sans-serif',
        // backgroundColor: '#f8f8f8',
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
    icon_true: {
        width: '30px',
        height: '30px',
        cursor: 'pointer',
        backgroundColor: 'green',
        borderRadius: '50%',
    },
    icon_false: {
        width: '30px',
        height: '30px',
        cursor: 'pointer',
        backgroundColor: 'red',
        borderRadius: '50%',
    },
    icon_player_true: {
        width: '30px',
        height: '30px',
        backgroundColor: 'green',
        borderRadius: '50%',
    },
    icon_player_false: {
        width: '30px',
        height: '30px',
        backgroundColor: 'red',
        borderRadius: '50%',
    },

    answerItemContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px',
    },

    playerList: {
        listStyleType: 'none',
        paddingLeft: '0',
    },
    playerItem: {
        // backgroundColor: '#fff',
        // padding: '20px',
        marginBottom: '15px',
        borderRadius: '21px',
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
        padding: '20px',
    },
    answerItem: {
        fontSize: '16px',
        marginBottom: '10px',
        margin: '0px',
        display: 'flex',
        // color: '#34495e',
    },
    answerName: {
        width: '200px',
        textAlign: 'start',
    },

    button: {
        // backgroundColor: '#3498db',
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
