import React, { useState, useEffect } from 'react'

const ResultComponent = () => {
    const [roundInfo, setRoundInfo] = useState(null)

    useEffect(() => {
        // Retrieve round info from localStorage
        const storedRoundInfo = localStorage.getItem('roundInfo')
        if (storedRoundInfo) {
            setRoundInfo(JSON.parse(storedRoundInfo))
        }
    }, [])

    if (!roundInfo) {
        return <div>Loading round information...</div>
    }

    return (
        <div>
            <h2>Round Number: {roundInfo.roundNumber}</h2>
            <h3>Answers:</h3>
            <ul>
                {roundInfo.answers.map((answer, index) => (
                    <li key={index}>{answer}</li>
                ))}
            </ul>
        </div>
    )
}

export default ResultComponent
