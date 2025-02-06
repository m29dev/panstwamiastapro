import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

const TimerComponent = () => {
    const { game } = useSelector((state) => state.game)
    const [timeLeft, setTimeLeft] = useState(30)

    useEffect(() => {
        const timerInfo = game.roundTimer

        if (!timerInfo) return

        const endTime = timerInfo.endTime
        const calculateTimeLeft = () => {
            const currentTime = Date.now()
            const remainingTime = endTime - currentTime
            const elapsed = remainingTime / 1000
            setTimeLeft(Math.max(elapsed, 0))
        }

        calculateTimeLeft()

        const intervalId = setInterval(calculateTimeLeft, 100)
        return () => clearInterval(intervalId)
    }, [])

    useEffect(() => {
        if (timeLeft === 0) {
            console.log('Czas minął!')

            // set round = false
            const gameVar = structuredClone(game)
            console.log(33, gameVar)
            gameVar.roundStart = false
        }
    }, [timeLeft])

    return (
        <div
            style={{
                fontSize: '24px',
                fontWeight: 'bold',
                textAlign: 'center',
            }}
        >
            {timeLeft > 0
                ? `Pozostały czas: ${timeLeft.toFixed(1)}s`
                : 'Czas minął!'}
        </div>
    )
}

export default TimerComponent
