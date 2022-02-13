import { useSelector } from 'react-redux'

export const useUser = () => useSelector(state => state.user)

export const useGame = () => useSelector(state => state.game)
