// user
export const setUserInfo = (userObject) => {
    localStorage.setItem('userInfo', JSON.stringify(userObject))
}
export const clearUserInfo = () => {
    localStorage.removeItem('userInfo')
}
export const getUserInfo = () => {
    const user = localStorage.getItem('userInfo')
    if (!user) return null
    return JSON.parse(localStorage.getItem('userInfo'))
}

// game
export const setGameInfo = (gameObject) => {
    localStorage.setItem('gameInfo', JSON.stringify(gameObject))
}
export const clearGameInfo = () => {
    localStorage.removeItem('gameInfo')
}
export const getGameInfo = () => {
    const game = localStorage.getItem('gameInfo')
    if (!game) return null
    return JSON.parse(localStorage.getItem('gameInfo'))
}
