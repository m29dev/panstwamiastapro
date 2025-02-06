import { useEffect, useState } from 'react'
import {
    auth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
} from '../firebaseConfig'
import { setUser } from '../Redux/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const AuthPage = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isRegistering, setIsRegistering] = useState(false)
    const [error, setError] = useState('')

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { user } = useSelector((state) => state.user)

    useEffect(() => {
        console.log(user)

        if (user) {
            return navigate('/')
        }
    }, [user, navigate])

    // Obsługa logowania
    const handleLogin = async () => {
        try {
            const user = await signInWithEmailAndPassword(auth, email, password)
            console.log(user)
            const object = {
                id: user?.user?.uid,
                email: user?.user?.email,
            }
            console.log(object)
            dispatch(setUser(object))
        } catch (error) {
            setError(error.message)
        }
    }

    // Obsługa rejestracji
    const handleRegister = async () => {
        try {
            const user = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            )
            const object = {
                id: user?.user?.uid,
                email: user?.user?.email,
            }
            dispatch(setUser(object))
        } catch (error) {
            setError(error.message)
        }
    }

    return (
        <div style={{ maxWidth: '400px', margin: 'auto', textAlign: 'center' }}>
            <h2>{isRegistering ? 'Rejestracja' : 'Logowanie'}</h2>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                    display: 'block',
                    margin: '10px auto',
                    padding: '10px',
                }}
            />
            <input
                type="password"
                placeholder="Hasło"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                    display: 'block',
                    margin: '10px auto',
                    padding: '10px',
                }}
            />

            {isRegistering ? (
                <button
                    onClick={handleRegister}
                    style={{ padding: '10px 20px', margin: '10px' }}
                >
                    Zarejestruj się
                </button>
            ) : (
                <button
                    onClick={handleLogin}
                    style={{ padding: '10px 20px', margin: '10px' }}
                >
                    Zaloguj się
                </button>
            )}

            <p
                onClick={() => setIsRegistering(!isRegistering)}
                style={{ cursor: 'pointer', color: 'blue' }}
            >
                {isRegistering
                    ? 'Masz już konto? Zaloguj się!'
                    : 'Nie masz konta? Zarejestruj się!'}
            </p>
        </div>
    )
}

export default AuthPage
