import { createSlice } from '@reduxjs/toolkit'
import {
    clearGameInfo,
    getGameInfo,
    setGameInfo,
} from '../Services/localStorageService'

const initialState = {
    game: getGameInfo(),
}

const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        setGame: (state, action) => {
            state.game = action.payload
            setGameInfo(action.payload)
        },
        clearGame(state, action) {
            state.game = null
            clearGameInfo()
        },
    },
})

export const { setGame, clearGame } = gameSlice.actions
export default gameSlice.reducer
